"""
FAZ 4 — Recraft v3 photoreal wax seal render.

Mevcut wax seal'ler (V2 flux-pro) illustration tendency. Recraft v3 ile
gerçek 3D wax stamp photograph hissi.

style: "realistic_image" zorlar photographic look.
"""

import time, json, urllib.request, urllib.error
from pathlib import Path

import os
KEY = os.environ.get("FAL_KEY", "").strip()  # secret from env (none in source)
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}
OUT = Path(__file__).resolve().parent.parent / "public"

PROMPTS = [
    {
        "edition": "aethel",
        "filename": "wax-seal-luxe-v3",
        "prompt": (
            "Macro photograph of a luxury wedding wax seal stamp on pure white background, "
            "deep sage green wax with rich texture, embossed olive branch motif with 3 leaves "
            "and 2 small olives in delicate fine line detail, photorealistic 3D depth with "
            "real wax sheen, soft directional studio light from upper left creating realistic "
            "highlights and shadows, isolated centered single object, no text no logo, "
            "ultra-detailed product photography"
        ),
    },
    {
        "edition": "nocturne",
        "filename": "wax-seal-v3",
        "prompt": (
            "Macro photograph of a luxury wedding wax seal stamp on pure white background, "
            "rich gold leaf colored wax with deep navy base, embossed intricate art-deco "
            "filigree pattern — geometric symmetrical rosette with elegant flourishes, "
            "metallic foil finish with raised relief, photorealistic 3D depth, soft directional "
            "studio light creating real highlights, isolated centered single object, "
            "ultra-detailed product photography"
        ),
    },
    {
        "edition": "candela",
        "filename": "wax-seal-v3",
        "prompt": (
            "Macro photograph of a luxury wedding wax seal stamp on pure white background, "
            "deep burgundy red wax with rich texture, embossed ornate Ottoman candelabra motif "
            "— single tall candle with flame surrounded by delicate baroque frame, warm gold "
            "accent line work, photorealistic 3D depth with real wax sheen, soft directional "
            "studio light, isolated centered single object, ultra-detailed product photography"
        ),
    },
    {
        "edition": "mistral",
        "filename": "wax-seal-v3",
        "prompt": (
            "Macro photograph of a luxury wedding wax seal stamp on pure white background, "
            "deep aegean blue wax with rich texture, embossed elegant nautical anchor motif "
            "intertwined with stylized waves, fine minimalist line work, photorealistic 3D "
            "depth with real wax sheen, soft directional studio light, isolated centered "
            "single object, ultra-detailed product photography"
        ),
    },
    {
        "edition": "olea",
        "filename": "wax-seal-v3",
        "prompt": (
            "Macro photograph of a luxury wedding wax seal stamp on pure white background, "
            "deep olive green wax with rich texture, embossed cluster of 3 olive branches "
            "with leaves and small olives — organic elegant botanical composition, "
            "photorealistic 3D depth with real wax sheen, soft directional studio light, "
            "isolated centered single object, ultra-detailed product photography"
        ),
    },
    {
        "edition": "aurora",
        "filename": "wax-seal-v3",
        "prompt": (
            "Macro photograph of a luxury minimalist wedding wax seal stamp on pure white "
            "background, soft rose-gold wax with Future Dusk twilight purple subtle gradient, "
            "embossed single thin geometric horizon line with abstract small sun rising — "
            "contemporary minimalist composition, photorealistic 3D depth with real wax sheen, "
            "soft directional studio light, isolated centered single object, "
            "ultra-detailed product photography"
        ),
    },
]


def submit(payload):
    req = urllib.request.Request(
        "https://queue.fal.run/fal-ai/recraft-v3",
        data=json.dumps(payload).encode("utf-8"),
        headers=HDR,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def poll(req_id, max_wait=240):
    status_url = f"https://queue.fal.run/fal-ai/recraft-v3/requests/{req_id}/status"
    res_url = f"https://queue.fal.run/fal-ai/recraft-v3/requests/{req_id}"
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
            print(f"  poll error: {e}")
    raise TimeoutError(f"poll timeout after {max_wait}s")


def download(url, dest):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=120) as r:
        dest.write_bytes(r.read())


def main():
    for i, p in enumerate(PROMPTS, 1):
        edition_dir = OUT / p["edition"]
        edition_dir.mkdir(exist_ok=True)
        dest = edition_dir / f"{p['filename']}.png"
        if dest.exists() and dest.stat().st_size > 50_000:
            print(f"[{i}/{len(PROMPTS)}] {p['edition']}/{p['filename']}.png — cached, skip")
            continue
        print(f"\n[{i}/{len(PROMPTS)}] {p['edition']} (Recraft v3) → submit")
        payload = {
            "prompt": p["prompt"],
            "image_size": "square_hd",  # 1:1 1024x1024
            "style": "realistic_image",
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
                print(f"  ERROR: no url: {result}")
                continue
            print(f"  download…")
            download(img_url, dest)
            kb = dest.stat().st_size // 1024
            print(f"  ✓ saved ({kb} kB)")
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            continue
    print("\nDone.")


if __name__ == "__main__":
    main()
