from pathlib import Path
import json, shutil, subprocess, time
from playwright.sync_api import sync_playwright

VIEWPORT={"width":1672,"height":941}
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"visual-audit"
PREVIEW=ROOT/".visual-preview-parity-extra"
SITE=PREVIEW/"realworldasset"
BASE="http://127.0.0.1:4190/realworldasset"
SURFACES={
 "01-public-landing":"/",
 "02-login-signup":"/login/",
 "03-onboarding":"/onboarding/",
 "05-manage-wallet":"/account/wallet/",
 "06-global-search-results":"/search/",
 "07-business-directory":"/businesses/",
 "08-rwa-directory":"/rwa/",
 "61-authenticated-home-main-feed":"/home/",
 "62-discover-hub":"/discover/",
 "66-intelligence-hub-current":"/intelligence/",
}

def ready(page):
    try: page.wait_for_load_state("networkidle",timeout=5000)
    except Exception: pass
    try: page.evaluate("document.fonts && document.fonts.ready")
    except Exception: pass
    page.wait_for_timeout(120)

def state(page,button=None):
    bs={}
    if button is not None:
      try:
        bs={
          "text":(button.inner_text() or "").strip(),
          "ariaLabel":button.get_attribute("aria-label"),
          "ariaPressed":button.get_attribute("aria-pressed"),
          "ariaSelected":button.get_attribute("aria-selected"),
          "dataActive":button.get_attribute("data-active"),
          "class":button.get_attribute("class"),
          "disabled":button.is_disabled(),
        }
      except Exception: bs={"detached":True}
    ps=page.evaluate("""
    () => {
      const s=document.body.innerHTML; let h=2166136261;
      for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
      return {
        bodyHash:(h>>>0).toString(16),
        bodyClass:document.body.className,
        appClass:document.querySelector('.app-shell')?.className||'',
        dialogCount:document.querySelectorAll('[role="dialog"],.rwa-overlay').length,
        statusText:Array.from(document.querySelectorAll('[role="status"]')).map(x=>x.textContent||'').join('|')
      }
    }
    """)
    return {"url":page.url,"button":bs,"page":ps}

def changed(a,b):
    if a["url"]!=b["url"]: return True
    for k in ("bodyHash","bodyClass","appClass","dialogCount","statusText"):
      if a["page"].get(k)!=b["page"].get(k): return True
    for k in ("text","ariaPressed","ariaSelected","dataActive","class"):
      if a["button"].get(k)!=b.get("button",{}).get(k): return True
    return False

def current(a):
    b=a.get("button",{})
    return b.get("ariaPressed")=="true" or b.get("ariaSelected")=="true" or b.get("dataActive")=="true"

def audit_route(page,name,route):
    page.goto(BASE+route,wait_until="domcontentloaded",timeout=30000); ready(page)
    count=page.locator("button:visible").count(); out=[]
    for i in range(count):
      page.goto(BASE+route,wait_until="domcontentloaded",timeout=30000); page.wait_for_timeout(30)
      buttons=page.locator("button:visible")
      if i>=buttons.count():
        out.append({"surface":name,"route":route,"index":i,"status":"SKIP_DYNAMIC"}); continue
      btn=buttons.nth(i); before=state(page,btn)
      label=before["button"].get("ariaLabel") or before["button"].get("text") or f"button-{i}"
      if before["button"].get("disabled"):
        out.append({"surface":name,"route":route,"index":i,"label":label,"status":"SKIP_DISABLED"}); continue
      if current(before):
        out.append({"surface":name,"route":route,"index":i,"label":label,"status":"PASS_CURRENT_STATE"}); continue
      err=None
      try:
        btn.evaluate("el=>el.click()"); page.wait_for_timeout(120)
      except Exception as exc: err=str(exc)
      after=state(page)
      ok=err is None and changed(before,after)
      out.append({"surface":name,"route":route,"index":i,"label":label,"status":"PASS" if ok else "FAIL","beforeUrl":before["url"],"afterUrl":after["url"],"error":err})
    failed=[x for x in out if x["status"]=="FAIL"]
    if failed:
      sample="; ".join(f'#{x["index"]} {x.get("label")}: {x.get("error") or "no observable action"}' for x in failed[:10])
      raise RuntimeError(f"PARITY browser button audit failed: {name} ({len(failed)}): {sample}")
    passed=sum(1 for x in out if x["status"].startswith("PASS")); skipped=len(out)-passed
    print(f"PARITY button audit PASS: {name} — {passed} functional/current-state; {skipped} intentional skips")
    return out

def open_wallet_modal(page):
    route="/markets/btc-usdc/"
    page.goto(BASE+route,wait_until="domcontentloaded",timeout=30000); ready(page)
    opener=page.get_by_role("button",name="Connect Wallet")
    if opener.count()==0: raise RuntimeError("Connect Wallet opener missing")
    opener.first.click(); page.wait_for_timeout(100)
    dialog=page.locator('[role="dialog"]')
    if dialog.count()==0: dialog=page.locator('.rwa-overlay')
    if dialog.count()==0: raise RuntimeError("Connect Wallet modal did not open")
    return dialog

def audit_wallet_modal(page):
    first=open_wallet_modal(page)
    count=first.locator("button:visible").count()
    if count==0: raise RuntimeError("Connect Wallet modal has no interactable buttons")
    labels=[]; results=[]
    page.screenshot(path=str(OUT/"04-connect-wallet-modal.png"),full_page=False)
    for i in range(count):
      dialog=open_wallet_modal(page)
      buttons=dialog.locator("button:visible")
      if i>=buttons.count():
        results.append({"surface":"04-connect-wallet-modal","index":i,"status":"SKIP_DYNAMIC"}); continue
      btn=buttons.nth(i); before=state(page,btn)
      label=before["button"].get("ariaLabel") or before["button"].get("text") or f"modal-button-{i}"
      labels.append(label)
      if before["button"].get("disabled"):
        results.append({"surface":"04-connect-wallet-modal","index":i,"label":label,"status":"SKIP_DISABLED"}); continue
      err=None
      try:
        btn.evaluate("el=>el.click()"); page.wait_for_timeout(120)
      except Exception as exc: err=str(exc)
      after=state(page)
      ok=err is None and changed(before,after)
      results.append({"surface":"04-connect-wallet-modal","index":i,"label":label,"status":"PASS" if ok else "FAIL","error":err})
    failed=[x for x in results if x["status"]=="FAIL"]
    if failed:
      sample="; ".join(f'#{x["index"]} {x.get("label")}: {x.get("error") or "no observable action"}' for x in failed[:10])
      raise RuntimeError(f"Connect Wallet modal button audit failed ({len(failed)}): {sample}")
    passed=sum(1 for x in results if x["status"].startswith("PASS")); skipped=len(results)-passed
    print(f"PARITY modal button audit PASS: 04-connect-wallet-modal — {passed} functional; {skipped} intentional skips; 0 FAIL")
    return results

def main():
    if PREVIEW.exists(): shutil.rmtree(PREVIEW)
    SITE.mkdir(parents=True)
    shutil.copytree(ROOT/"out",SITE,dirs_exist_ok=True)
    OUT.mkdir(exist_ok=True)
    server=subprocess.Popen(["python3","-m","http.server","4190","--bind","127.0.0.1","--directory",str(PREVIEW)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(1)
    records=[]; audits=[]
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
        page=browser.new_page(viewport=VIEWPORT,device_scale_factor=1)
        for name,route in SURFACES.items():
          response=page.goto(BASE+route,wait_until="domcontentloaded",timeout=30000); ready(page)
          text=page.locator("body").inner_text(); placeholder="Route reserved for" in text
          page.screenshot(path=str(OUT/f"{name}.png"),full_page=False)
          records.append({"name":name,"route":route,"url":page.url,"status":response.status if response else None,"placeholder":placeholder,"viewport":VIEWPORT})
          print(f"PARITY capture: {name} -> {route} placeholder={placeholder}")
          audits.extend(audit_route(page,name,route))
        audits.extend(audit_wallet_modal(page))
        records.append({"name":"04-connect-wallet-modal","route":"/markets/btc-usdc/ + Connect Wallet","status":"PASS","viewport":VIEWPORT})
        browser.close()
    finally:
      server.terminate()
      try: server.wait(timeout=5)
      except subprocess.TimeoutExpired: server.kill()
    (OUT/"parity-extra-capture.json").write_text(json.dumps(records,indent=2),encoding="utf-8")
    (OUT/"parity-extra-button-audit.json").write_text(json.dumps(audits,indent=2),encoding="utf-8")
    passed=sum(1 for x in audits if x["status"].startswith("PASS")); skipped=sum(1 for x in audits if x["status"].startswith("SKIP"))
    failed=sum(1 for x in audits if x["status"]=="FAIL")
    if failed: raise RuntimeError(f"Supplemental button proof has {failed} failures")
    print(f"Captured {len(SURFACES)+1} supplemental source surfaces at 1672x941")
    print(f"PARITY supplemental browser button audit PASS: {passed} functional/current-state controls; {skipped} intentional skips; 0 FAIL")

if __name__=="__main__": main()
