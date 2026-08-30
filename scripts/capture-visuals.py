from pathlib import Path
import json
import shutil
import subprocess
import time
from playwright.sync_api import sync_playwright

VIEWPORT = {"width": 1672, "height": 941}
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "visual-audit"
PREVIEW = ROOT / ".visual-preview"
SITE = PREVIEW / "realworldasset"


def prepare_preview() -> None:
    if PREVIEW.exists():
        shutil.rmtree(PREVIEW)
    SITE.mkdir(parents=True)
    shutil.copytree(ROOT / "out", SITE, dirs_exist_ok=True)
    OUT.mkdir(exist_ok=True)


def wait_ready(page) -> None:
    page.wait_for_load_state("networkidle")
    try:
        page.evaluate("document.fonts && document.fonts.ready")
    except Exception:
        pass
    page.wait_for_timeout(350)


def capture(page, base_url: str, name: str, route: str) -> dict:
    response = page.goto(base_url + route, wait_until="domcontentloaded", timeout=30000)
    wait_ready(page)
    page.screenshot(path=str(OUT / f"{name}.png"), full_page=False)
    return {
        "name": name,
        "route": route,
        "url": page.url,
        "status": response.status if response else None,
        "viewport": VIEWPORT,
        "title": page.title(),
    }


def main() -> None:
    prepare_preview()
    server = subprocess.Popen(
        ["python3", "-m", "http.server", "4173", "--bind", "127.0.0.1", "--directory", str(PREVIEW)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(1)
    base_url = "http://127.0.0.1:4173/realworldasset"
    records = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
            page = browser.new_page(viewport=VIEWPORT, device_scale_factor=1)
            records.append(capture(page, base_url, "01-public-landing", "/"))
            records.append(capture(page, base_url, "02-login-signup", "/login/"))
            records.append(capture(page, base_url, "03-onboarding", "/onboarding/"))
            records.append(capture(page, base_url, "05-manage-wallet", "/account/wallet/"))

            response = page.goto(base_url + "/markets/btc-usdc/", wait_until="domcontentloaded", timeout=30000)
            wait_ready(page)
            connect = page.get_by_role("button", name="Connect Wallet")
            if connect.count() == 0:
                raise RuntimeError("Connect Wallet button not found on /markets/btc-usdc/")
            connect.first.click()
            page.wait_for_timeout(350)
            page.screenshot(path=str(OUT / "04-connect-wallet-modal.png"), full_page=False)
            records.append({
                "name": "04-connect-wallet-modal",
                "route": "/markets/btc-usdc/ + Connect Wallet",
                "url": page.url,
                "status": response.status if response else None,
                "viewport": VIEWPORT,
                "title": page.title(),
            })
            browser.close()
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()

    (OUT / "capture.json").write_text(json.dumps(records, indent=2), encoding="utf-8")
    print(f"Captured {len(records)} CHAT 01 reference surfaces at 1672x941")


if __name__ == "__main__":
    main()
