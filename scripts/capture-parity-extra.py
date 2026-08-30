from pathlib import Path
import json, shutil, subprocess, time
from playwright.sync_api import sync_playwright

VIEWPORT={"width":1672,"height":941}
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"visual-audit"
PREVIEW=ROOT/".visual-preview-parity-extra"
SITE=PREVIEW/"realworldasset"
SURFACES={
 "06-global-search-results":"/search/",
 "07-business-directory":"/businesses/",
 "08-rwa-directory":"/rwa/",
 "61-authenticated-home-main-feed":"/home/",
 "62-discover-hub":"/discover/",
 "66-intelligence-hub-current":"/intelligence/",
}

def main():
    if PREVIEW.exists(): shutil.rmtree(PREVIEW)
    SITE.mkdir(parents=True)
    shutil.copytree(ROOT/"out",SITE,dirs_exist_ok=True)
    OUT.mkdir(exist_ok=True)
    server=subprocess.Popen(["python3","-m","http.server","4190","--bind","127.0.0.1","--directory",str(PREVIEW)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(1)
    records=[]
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
        page=browser.new_page(viewport=VIEWPORT,device_scale_factor=1)
        for name,route in SURFACES.items():
          response=page.goto("http://127.0.0.1:4190/realworldasset"+route,wait_until="domcontentloaded",timeout=30000)
          try: page.wait_for_load_state("networkidle",timeout=5000)
          except Exception: pass
          try: page.evaluate("document.fonts && document.fonts.ready")
          except Exception: pass
          page.wait_for_timeout(250)
          text=page.locator("body").inner_text()
          placeholder="Route reserved for" in text
          page.screenshot(path=str(OUT/f"{name}.png"),full_page=False)
          records.append({"name":name,"route":route,"url":page.url,"status":response.status if response else None,"placeholder":placeholder,"viewport":VIEWPORT})
          print(f"PARITY capture: {name} -> {route} placeholder={placeholder}")
        browser.close()
    finally:
      server.terminate()
      try: server.wait(timeout=5)
      except subprocess.TimeoutExpired: server.kill()
    (OUT/"parity-extra-capture.json").write_text(json.dumps(records,indent=2),encoding="utf-8")
    print(f"Captured {len(records)} extra screenshot-to-code parity surfaces at 1672x941")

if __name__=="__main__": main()
