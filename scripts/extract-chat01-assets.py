from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
import io

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / ".chat01-reference"
ASSETS = ROOT / "public" / "chat01-assets"
REF.mkdir(exist_ok=True)
ASSETS.mkdir(parents=True, exist_ok=True)

FILES = {
    "01": "15xbZds2fYGNKeMd1w53VMSAQNIziMpaA",
    "02": "1XCjIjHB-ZzBsd7iqDUs04lrnaQ-gBujk",
    "03": "1u6LSE5umwjr8j8CXSGj6iFlgas0Zjk_A",
    "04": "1EmpKYkdpBWybmQZvbQ_StPxcrb94GP0P",
    "05": "1vxbugAQxm-EPeTIakpLs4WztEgEwKhQ6",
}


def download(file_id: str) -> bytes:
    urls = [
        f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t",
        f"https://drive.google.com/uc?export=download&id={file_id}",
    ]
    last = None
    for url in urls:
        try:
            req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(req, timeout=30) as response:
                data = response.read()
            if data.startswith(b"\x89PNG"):
                return data
            last = RuntimeError(f"non-PNG response from {url}: {data[:80]!r}")
        except Exception as exc:
            last = exc
    raise RuntimeError(f"Unable to download Drive reference {file_id}: {last}")


def save_crop(image: Image.Image, box, name: str, *, jpeg=False, quality=88):
    crop = image.crop(box).convert("RGB")
    path = ASSETS / name
    if jpeg:
        crop.save(path, "JPEG", quality=quality, optimize=True)
    else:
        crop.save(path, "PNG", optimize=True)


refs = {}
for key, file_id in FILES.items():
    data = download(file_id)
    (REF / f"{key}.png").write_bytes(data)
    refs[key] = Image.open(io.BytesIO(data)).convert("RGB")
    if refs[key].size != (1672, 941):
        raise RuntimeError(f"CHAT 01 reference {key} has unexpected size {refs[key].size}")

# 01: exact decorative landing dashboard preview plus reusable brand/business marks.
save_crop(refs["01"], (794, 68, 1590, 452), "landing-dashboard.jpg", jpeg=True, quality=92)
save_crop(refs["01"], (70, 14, 106, 54), "brand-mark.png")
save_crop(refs["01"], (85, 487, 131, 533), "logo-kopi.png")
save_crop(refs["01"], (473, 487, 519, 533), "logo-marina.png")
save_crop(refs["01"], (843, 487, 889, 533), "logo-ocean.png")
save_crop(refs["01"], (1206, 487, 1252, 533), "logo-credit.png")

# 03: pure image areas only; UI text is intentionally excluded.
interest = {
    "interest-real-estate.jpg": (490, 233, 707, 323),
    "interest-private-credit.jpg": (785, 233, 1004, 323),
    "interest-businesses.jpg": (1086, 233, 1303, 323),
    "interest-commodities.jpg": (1390, 233, 1618, 323),
    "interest-crypto.jpg": (500, 423, 707, 513),
    "interest-infrastructure.jpg": (785, 423, 1004, 513),
    "interest-treasury.jpg": (1085, 423, 1303, 513),
    "interest-venture.jpg": (1400, 423, 1618, 513),
}
for name, box in interest.items():
    save_crop(refs["03"], box, name, jpeg=True, quality=86)

save_crop(refs["03"], (443, 699, 518, 775), "follow-kopi.png")
save_crop(refs["03"], (842, 699, 918, 775), "follow-seablue.png")
save_crop(refs["03"], (1237, 699, 1311, 775), "follow-ocean.png")

# 05 wallet icons are reused by login, modal, onboarding and wallet manager.
save_crop(refs["05"], (364, 211, 408, 255), "wallet-metamask.png")
save_crop(refs["05"], (357, 348, 402, 397), "wallet-rabby.png")
save_crop(refs["05"], (358, 422, 402, 466), "wallet-coinbase.png")
save_crop(refs["05"], (358, 495, 402, 541), "wallet-walletconnect.png")

print(f"Prepared {len(list(ASSETS.iterdir()))} CHAT 01 visual assets from Drive references")
