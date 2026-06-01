"""
FAZ 2 — Premium wax seal re-render.

Her edition için özgün luxe wax seal:
  AETHEL   → olive branch + monogram
  NOCTURNE → gold filigree N&M art-deco
  CANDÉLA  → candelabra + ornate frame
  MISTRAL  → anchor + Aegean waves
  OLEA     → olive leaf cluster
  AURORA   → minimal geometric debossed

Pure white background, transparent-bg.py ile sonra alpha-clip yapılır.
Önemli: 1:1 aspect ratio, merkezde mühür, edge'ler temiz.

Çalıştırma:
  python3 scripts/render-luxe-wax-seals-v2.py
  python3 scripts/transparent-bg-all.py
  python3 scripts/optimize-assets.py
"""

import os, sys, time, json, urllib.request, urllib.error
from pathlib import Path

KEY = os.environ.get("FAL_KEY", "").strip()  # secret from env (none in source)
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}

OUT_BASE = Path(__file__).resolve().parent.parent / "public"

COMMON_STYLE = (
    "ultra premium luxury wax seal, photorealistic 3D depth, "
    "natural wax texture with embossed relief, soft directional light from upper left "
    "creating realistic highlights and shadows, fine craftsmanship, "
    "ISOLATED ON PURE WHITE BACKGROUND, clean edges, top-down view, "
    "single object centered, no text labels, no logos, no watermark, "
    "no surrounding decorations, hyper realistic 8K macro photography"
)

NEGATIVE = (
    "cartoon, anime, 3D render, low quality, blurry, oversaturated, "
    "neon colors, RGB, fluorescent, plastic, fake, AI art tells, "
    "text, letters in seal design, signature, watermark, "
    "multiple objects, busy pattern, scattered elements, "
    "harsh shadows, vector style, geometric blocks"
)

PROMPTS = [
    {
        "edition": "aethel",
        "filename": "wax-seal-luxe-v2",
        "prompt": (
            "Luxury wax seal stamp in deep sage green color (#5C6450), "
            "embossed with an olive branch motif — three olive leaves and "
            "two small olives in delicate fine art line work, "
            "elegant minimalist composition, soft pearl finish, "
            f"{COMMON_STYLE}"
        ),
    },
    {
        "edition": "nocturne",
        "filename": "wax-seal-v2",
        "prompt": (
            "Luxury wax seal stamp in rich gold leaf color (#D4A158) on deep navy base, "
            "embossed with intricate art-deco filigree pattern — geometric "
            "symmetrical rosette with elegant flourishes, black-tie premium, "
            "soft metallic foil finish with raised relief, "
            f"{COMMON_STYLE}"
        ),
    },
    {
        "edition": "candela",
        "filename": "wax-seal-v2",
        "prompt": (
            "Luxury wax seal stamp in deep burgundy color (#4A1521), "
            "embossed with an ornate Ottoman candelabra motif — single tall "
            "candle with flame surrounded by delicate baroque frame, "
            "warm gold accent line work, intimate elegance, "
            f"{COMMON_STYLE}"
        ),
    },
    {
        "edition": "mistral",
        "filename": "wax-seal-v2",
        "prompt": (
            "Luxury wax seal stamp in deep aegean blue color (#1F3848), "
            "embossed with an elegant nautical anchor motif intertwined with "
            "stylized waves, fine minimalist line work, coastal premium, "
            "soft sea-blue tint with natural wax sheen, "
            f"{COMMON_STYLE}"
        ),
    },
    {
        "edition": "olea",
        "filename": "wax-seal-v2",
        "prompt": (
            "Luxury wax seal stamp in deep olive green color (#3D4528), "
            "embossed with a cluster of three olive branches with leaves and "
            "small olives, organic elegant composition like a natural specimen, "
            "Mediterranean botanical premium, "
            f"{COMMON_STYLE}"
        ),
    },
    {
        "edition": "aurora",
        "filename": "wax-seal-v2",
        "prompt": (
            "Luxury minimalist wax seal stamp in soft rose-gold color (#B8867A), "
            "embossed with a single thin geometric line forming a delicate horizon "
            "with small abstract sun rising — contemporary minimalist composition, "
            "Future Dusk twilight purple accent in subtle gradient, "
            "modernist quiet luxury, "
            f"{COMMON_STYLE}"
        ),
    },
]


def submit(payload):
    req = urllib.request.Request(
        "https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra",
        data=json.dumps(payload).encode("utf-8"),
        headers=HDR,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def poll(req_id, max_wait=240):
    status_url = f"https://queue.fal.run/fal-ai/flux-pro/requests/{req_id}/status"
    res_url = f"https://queue.fal.run/fal-ai/flux-pro/requests/{req_id}"
    start = time.time()
    while time.time() - start < max_wait:
        time.sleep(4)
        req = urllib.request.Request(status_url, headers=HDR)
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                s = json.loads(r.read())
            status = s.get("status")
            if status == "COMPLETED":
                req2 = urllib.request.Request(res_url, headers=HDR)
                with urllib.request.urlopen(req2, timeout=20) as r2:
                    return json.loads(r2.read())
            if status in ("ERROR", "FAILED"):
                raise RuntimeError(f"fal error: {s}")
            print(f"  [{int(time.time()-start)}s] {status}")
        except urllib.error.URLError as e:
            print(f"  poll error: {e}, retrying...")
    raise TimeoutError(f"poll timeout after {max_wait}s")


def download(url, dest):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=120) as r:
        dest.write_bytes(r.read())


def main():
    OUT_BASE.mkdir(exist_ok=True)
    for i, p in enumerate(PROMPTS, 1):
        edition_dir = OUT_BASE / p["edition"]
        edition_dir.mkdir(exist_ok=True)
        dest = edition_dir / f"{p['filename']}.png"
        if dest.exists() and dest.stat().st_size > 50_000:
            print(f"[{i}/{len(PROMPTS)}] {p['edition']}/{p['filename']}.png — cached, skip")
            continue

        print(f"\n[{i}/{len(PROMPTS)}] {p['edition']} wax seal → submit")
        payload = {
            "prompt": p["prompt"],
            "negative_prompt": NEGATIVE,
            "image_size": {"width": 1024, "height": 1024},  # 1:1 square
            "num_images": 1,
            "enable_safety_checker": True,
            "output_format": "png",
            "aspect_ratio": "1:1",
        }
        try:
            r = submit(payload)
            req_id = r.get("request_id") or r.get("id")
            print(f"  request_id={req_id}")
            result = poll(req_id)
            img_url = (
                result.get("images", [{}])[0].get("url")
                or result.get("image", {}).get("url")
            )
            if not img_url:
                print(f"  ERROR: no image url: {result}")
                continue
            print(f"  download {img_url[:60]}...")
            download(img_url, dest)
            kb = dest.stat().st_size // 1024
            print(f"  ✓ saved {dest} ({kb} kB)")
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            continue

    print("\nDone. Next: alpha clip + optimize.")


if __name__ == "__main__":
    main()
