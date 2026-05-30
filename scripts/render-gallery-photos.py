#!/usr/bin/env python3
"""themes-v2 galeri fotoğrafları — premium editöryel düğün seti (fal.ai).

SAMPLE_DATA.photos'taki 5 caption boş polaroid çerçevesi gösteriyordu
(PhotoScene soyut placeholder). Bu script her caption'a eşleşen, gerçek
kişilerin yüz fotoğraflarını SCRAPE ETMEDEN üretilen — telif + gizlilik
temiz — premium editöryel görseller render eder. Kompozisyonlar bilinçli
olarak yüz-içermez (silüet / arkadan / detay / manzara): hem daha şık
placeholder, hem gizlilik-güvenli, hem çift kendi fotoğrafıyla değiştirir.

FAL_KEY env'den okunur (script'e gömülü değil). Çalıştırma:
  FAL_KEY=$(python3 -c "import re;print(re.search(r'KEY\\s*=\\s*\"([^\"]+)\"',
    open('scripts/render-photoreal-covers-v3.py').read()).group(1))") \\
    python3 scripts/render-gallery-photos.py
"""
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

KEY = os.environ.get("FAL_KEY")
if not KEY:
    raise SystemExit("FAL_KEY env yok — README'deki çalıştırma satırını kullan.")

HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}
OUT = Path("public/themes-v2/gallery")
OUT.mkdir(parents=True, exist_ok=True)

STYLE = (
    "editorial wedding photography, 35mm film, soft natural light, warm muted "
    "timeless tones, shallow depth of field, fine grain, elegant, no text, "
    "no watermark"
)
NEGATIVE = (
    "text, watermark, logo, words, caption, distorted face, deformed hands, "
    "extra limbs, oversaturated, cartoon, illustration, 3d render, blurry, "
    "low quality, harsh light"
)

# Her biri SAMPLE_DATA.photos caption'ına eşleşir. Yüz-içermez (silüet/detay).
PROMPTS = [
    {
        "file": "photo-1",  # "İlk tanıştığımız gün"
        "prompt": "A couple sharing coffee at a sunlit minimalist cafe, seen "
        "from behind and slightly to the side, two cups on a marble table, "
        "soft window light, candid intimate moment, faces not visible, "
        + STYLE,
    },
    {
        "file": "photo-2",  # "Mart 2024 · Kapadokya"
        "prompt": "Cappadocia at sunrise, dozens of hot air balloons floating "
        "over rocky fairy chimneys, a small couple silhouette on a terrace "
        "watching from behind, golden warm haze, travel wedding photography, "
        + STYLE,
    },
    {
        "file": "photo-3",  # "Birlikte ilk yılbaşı"
        "prompt": "Cozy winter evening by a frosted window, warm string fairy "
        "lights with soft bokeh, two mugs of mulled wine on a wooden sill, "
        "golden glow, intimate, no people, " + STYLE,
    },
    {
        "file": "photo-4",  # "Evet dediği an"
        "prompt": "Close-up of a hand presenting a delicate gold engagement "
        "ring in an open velvet box, soft romantic candlelight, shallow depth "
        "of field, no faces, " + STYLE,
    },
    {
        "file": "photo-5",  # "Bir nehir kenarı"
        "prompt": "A couple walking hand in hand away from the camera along a "
        "misty riverbank at golden hour, full silhouette back view, soft "
        "reflections on calm water, romantic, faces not visible, " + STYLE,
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
        try:
            with urllib.request.urlopen(
                urllib.request.Request(status_url, headers=HDR), timeout=20
            ) as r:
                s = json.loads(r.read())
            status = s.get("status")
            if status == "COMPLETED":
                with urllib.request.urlopen(
                    urllib.request.Request(res_url, headers=HDR), timeout=20
                ) as r2:
                    return json.loads(r2.read())
            if status in ("ERROR", "FAILED"):
                raise RuntimeError(f"fal error: {s}")
            print(f"  [{int(time.time() - start)}s] {status}")
        except urllib.error.URLError as e:
            print(f"  poll error: {e}")
    raise TimeoutError(f"poll timeout after {max_wait}s")


def download(url, dest):
    with urllib.request.urlopen(urllib.request.Request(url), timeout=120) as r:
        dest.write_bytes(r.read())


def main():
    for i, p in enumerate(PROMPTS, 1):
        dest = OUT / f"{p['file']}.jpg"
        if dest.exists() and dest.stat().st_size > 50_000:
            print(f"[{i}/{len(PROMPTS)}] {p['file']} — cached, skip")
            continue
        print(f"\n[{i}/{len(PROMPTS)}] {p['file']} → submit")
        payload = {
            "prompt": p["prompt"],
            "negative_prompt": NEGATIVE,
            "num_images": 1,
            "enable_safety_checker": True,
            "output_format": "jpeg",
            "aspect_ratio": "3:4",
            "raw": True,
        }
        try:
            r = submit(payload)
            req_id = r.get("request_id") or r.get("id")
            print(f"  request_id={req_id}")
            result = poll(req_id)
            img_url = result.get("images", [{}])[0].get("url") or result.get(
                "image", {}
            ).get("url")
            if not img_url:
                print(f"  ERROR: no image url: {result}")
                continue
            download(img_url, dest)
            print(f"  ✓ saved ({dest.stat().st_size // 1024} kB)")
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            continue
    print("\nDone. Next: WebP optimize + SAMPLE_DATA.photos src wire.")


if __name__ == "__main__":
    main()
