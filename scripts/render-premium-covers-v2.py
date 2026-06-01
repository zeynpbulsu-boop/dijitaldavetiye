"""
FAZ 2 — Premium cover scene re-render (Vogue Weddings + Pressed Love seviye).

Mevcut cover'lar Mart 2024 fal.ai watercolor sürümünden — kullanıcı şikayeti:
"trendlere uygun değil, çocuk davetiyesi gibi, premium değil".

Bu re-render:
- fal.ai Flux Pro 1.1 Ultra (en kaliteli model)
- 9:16 vertical (mobile-first invite)
- Cinematic editorial photography style (Vogue Weddings)
- Anamorphic 2.39:1 framing içinde 9:16 crop
- 35mm film grain + halation
- Painterly watercolor wash (Pressed Love signature)
- Per-edition spesifik premium atmosfer

Output: public/<edition>/cover-v2.jpg → sonra cover.jpg'ye rename.

Çalıştırma:
  python3 scripts/render-premium-covers-v2.py
  python3 scripts/optimize-assets.py
"""

import os, sys, time, json, urllib.request, urllib.error
from pathlib import Path

KEY = os.environ.get("FAL_KEY", "").strip()  # secret from env (none in source)
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}

OUT_BASE = Path(__file__).resolve().parent.parent / "public"

# Premium 2026 cinematic prompts — Vogue Weddings + Pressed Love + Hovey Films
STYLE_LOCK = (
    "editorial Vogue Weddings cinematic style, painterly watercolor wash "
    "with photographic depth, anamorphic 2.39:1 framing in 9:16 portrait composition, "
    "35mm Kodak Portra 400 film grain with subtle halation, "
    "natural human skin texture with fine pores, shallow depth of field f/1.4, "
    "creamy oval bokeh, slow dolly cinema cadence, unhurried breathing room, "
    "soft diffused golden hour light, dreamy painterly atmosphere, "
    "premium luxury wedding film aesthetic, no text no logo no watermark"
)

NEGATIVE = (
    "plastic airbrushed skin, waxy smooth glossy face, oversaturated cartoon, "
    "anime 3D render, generic stock template, gold particle burst, mandala spinning, "
    "animated heart frame, emoji sticker text, hyperstylized whip-pan, "
    "deepfake uncanny valley, blurry low-resolution, watermark logo text overlay, "
    "distorted face mutated hands extra fingers doubled limbs, neon RGB, busy patterns"
)

PROMPTS = [
    {
        "edition": "aethel",
        "filename": "cover-v2",
        "prompt": (
            "Cinematic painterly portrait composition of an ancient Tuscan stone chapel "
            "at golden hour, weathered limestone walls with rich texture, single arched "
            "doorway with soft warm light spilling out, two white doves taking flight from "
            "the bell tower in slow motion, gnarled olive trees in the foreground silver "
            "leaves shimmering, soft pastel sage and warm cream color palette, ethereal "
            "morning mist between the cypresses, Pressed Love watercolor wash signature, "
            f"{STYLE_LOCK}"
        ),
    },
    {
        "edition": "nocturne",
        "filename": "cover-v2",
        "prompt": (
            "Cinematic black-tie portrait composition of an opulent Ottoman palace at midnight, "
            "deep indigo Bosphorus reflecting hundreds of warm golden window lights, massive "
            "antique crystal chandelier visible through a tall arched window casting reflective "
            "prisms, faint stars in deep navy sky, distant silhouette of a couple in formal attire "
            "on a marble balcony, midnight blue and warm gold opulent palette, rich shadows, "
            f"{STYLE_LOCK}"
        ),
    },
    {
        "edition": "candela",
        "filename": "cover-v2",
        "prompt": (
            "Cinematic intimate portrait composition of a historic Ottoman waterfront mansion "
            "(yalı) at dusk, hundreds of warm flickering candles arranged on long antique dining "
            "table dressed with burgundy velvet runner, brass candelabras with real flames, "
            "rose petals scattered, soft Bosphorus water visible through tall arched window, "
            "deep burgundy and warm gold candlelit palette, intimate grandeur, vintage glamour, "
            f"{STYLE_LOCK}"
        ),
    },
    {
        "edition": "mistral",
        "filename": "cover-v2",
        "prompt": (
            "Cinematic coastal portrait composition of a pristine Aegean cove at golden sunset, "
            "single white traditional Bodrum gulet sailboat with billowing canvas sails passing "
            "calm turquoise water, whitewashed limestone houses cascading down hillside with "
            "vibrant bougainvillea, weathered wooden jetty extending into the sea, warm sunset "
            "light, sun-bleached cream and Aegean blue palette, salt-air spaciousness, "
            f"{STYLE_LOCK}"
        ),
    },
    {
        "edition": "olea",
        "filename": "cover-v2",
        "prompt": (
            "Cinematic slow-living portrait composition of an ancient Aegean olive grove at "
            "early morning, 600-year-old gnarled olive tree silhouetted against pastel sky, "
            "silver-green leaves shimmering with morning dew, soft mist rolling between the "
            "trees, whitewashed stone village house with terracotta roof in soft background, "
            "long rustic wooden table set with wildflowers visible through the grove, "
            "warm cream and sage green palette, painterly Mediterranean morning warmth, "
            f"{STYLE_LOCK}"
        ),
    },
    {
        "edition": "aurora",
        "filename": "cover-v2",
        "prompt": (
            "Cinematic modernist minimalist portrait composition of a restored Ottoman konak "
            "interior, beam of soft warm sunlight cutting through tall arched window onto "
            "polished travertine floor, geometric shadow patterns from stone colonnade, single "
            "ancient pomegranate tree in inner courtyard, two minimalist figures in flowing "
            "ivory silk visible in soft background, warm beige and Future Dusk twilight purple "
            "accent palette, contemporary quiet luxury restraint, contemplative geometric, "
            f"{STYLE_LOCK}"
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
    status_url = (
        f"https://queue.fal.run/fal-ai/flux-pro/requests/{req_id}/status"
    )
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
        dest = edition_dir / f"{p['filename']}.jpg"
        if dest.exists() and dest.stat().st_size > 100_000:
            print(f"[{i}/{len(PROMPTS)}] {p['edition']}/{p['filename']}.jpg — cached, skip")
            continue

        print(f"\n[{i}/{len(PROMPTS)}] {p['edition']} → submit")
        payload = {
            "prompt": p["prompt"],
            "negative_prompt": NEGATIVE,
            "image_size": {"width": 832, "height": 1472},  # ~9:16 vertical
            "num_images": 1,
            "enable_safety_checker": True,
            "output_format": "jpeg",
            "aspect_ratio": "9:16",
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
                print(f"  ERROR: no image url in result: {result}")
                continue
            print(f"  download {img_url[:60]}...")
            download(img_url, dest)
            kb = dest.stat().st_size // 1024
            print(f"  ✓ saved {dest} ({kb} kB)")
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            continue

    print("\nDone. Run: python3 scripts/optimize-assets.py")


if __name__ == "__main__":
    main()
