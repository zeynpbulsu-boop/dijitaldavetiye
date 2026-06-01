"""
FAZ 3 — Hyperrealistic Vogue Weddings PHOTOGRAPH covers (v3).

V1 (Mart 2024) + V2 (Mayıs 2024) ikisi de "painterly watercolor wash"
içeriyordu — kullanıcı "çizgi film gibi" şikayet etti.

V3 RADIKAL DEĞIŞIKLIK:
  - ZERO painterly / watercolor / illustration
  - Hyperrealistic professional wedding photography
  - Vogue Weddings editorial cover seviyesi
  - 35mm Kodak Portra 400 film grain
  - Anne Leibovitz / Tim Walker / Hovey Films pattern
  - Real venue documentary photograph
  - Anamorphic 2.39:1 framing in 9:16 portrait

Çalıştırma:
  python3 scripts/render-photoreal-covers-v3.py
  python3 scripts/optimize-assets.py
"""

import time, json, urllib.request, urllib.error
from pathlib import Path

import os
KEY = os.environ.get("FAL_KEY", "").strip()  # secret from env (none in source)
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}
OUT_BASE = Path(__file__).resolve().parent.parent / "public"

STYLE = (
    "hyperrealistic professional wedding photography, Vogue Weddings editorial cover, "
    "shot on Hasselblad H6D-100c medium format camera, 50mm Zeiss lens at f/1.4, "
    "35mm Kodak Portra 400 film grain with natural halation, anamorphic 2.39:1 framing "
    "in 9:16 vertical portrait composition, cinematic depth of field with creamy oval bokeh, "
    "natural color grading no painterly effects, deep rich shadows with golden highlights, "
    "Anne Leibovitz portraiture style, Tim Walker editorial mood, Hovey Films cinematic, "
    "Mario Testino fashion-wedding crossover, real venue documentary photograph, "
    "no illustration no watercolor no painting no cartoon no anime no sketch no drawing, "
    "ultra-detailed natural skin texture, professional retoucher hand finish"
)

NEGATIVE = (
    "watercolor painting, watercolor wash, painterly, brush strokes, illustration, "
    "cartoon, anime, manga, 3D render, sketch, drawing, vector art, digital painting, "
    "concept art, fantasy illustration, AI-generated look, plastic skin, oversaturated, "
    "neon colors, RGB, fluorescent, blurry, low-resolution, watermark, logo, text overlay, "
    "deepfake uncanny valley, mutated face, extra fingers, doubled limbs, "
    "Pastel, soft pastels, ethereal painterly, dreamy painterly, animated film style, "
    "Disney style, Pixar style, Ghibli style, children's book illustration"
)

PROMPTS = [
    {
        "edition": "aethel",
        "filename": "cover-v3",
        "prompt": (
            "Stunning photographic portrait of an ancient Tuscan stone chapel at golden hour, "
            "weathered Romanesque limestone walls with rich texture, single arched wooden doorway "
            "with soft warm sunlight spilling out from inside, two real white doves caught mid-flight "
            "in front of the bell tower in fast-shutter motion blur, ancient gnarled olive trees in "
            "foreground with silver leaves catching the warm low sun, deep golden hour cinematic shadows, "
            "ultra-detailed stone texture, real photograph atmosphere, "
            f"{STYLE}"
        ),
    },
    {
        "edition": "nocturne",
        "filename": "cover-v3",
        "prompt": (
            "Stunning photographic portrait of an opulent Ottoman palace exterior at midnight, "
            "deep indigo Bosphorus reflecting hundreds of warm golden window lights in long mirror image, "
            "massive antique crystal chandelier visible through a tall arched window casting bright "
            "prismatic light, faint stars in deep navy sky above, distant silhouette of a couple in "
            "formal black-tie attire on a marble balcony, anamorphic lens flare from chandelier, "
            "rich midnight blue and warm gold opulent color palette, deep cinematic shadows, "
            "documentary luxury photography, "
            f"{STYLE}"
        ),
    },
    {
        "edition": "candela",
        "filename": "cover-v3",
        "prompt": (
            "Stunning photographic portrait of a historic Ottoman waterfront mansion (yalı) interior "
            "at intimate dusk, hundreds of warm flickering real candles arranged on long antique "
            "dining table dressed with deep burgundy velvet runner, brass candelabras with real flames "
            "creating bokeh, scattered fresh rose petals catching candlelight, calm Bosphorus water "
            "visible through tall arched window in soft background, deep burgundy and warm gold "
            "candlelit color palette, intimate cinematic grandeur, vintage glamour documentary photograph, "
            f"{STYLE}"
        ),
    },
    {
        "edition": "mistral",
        "filename": "cover-v3",
        "prompt": (
            "Stunning photographic portrait of a pristine Aegean cove at golden sunset, single "
            "traditional white Bodrum gulet sailboat with billowing canvas sails passing crystal "
            "turquoise water, whitewashed limestone houses cascading down hillside with vibrant "
            "magenta bougainvillea flowers, weathered wooden jetty extending into the sea, warm "
            "low-angle sunset light raking across the scene, sun-bleached cream and Aegean blue "
            "color palette, salt-air atmospheric haze, real coastal documentary photograph, "
            f"{STYLE}"
        ),
    },
    {
        "edition": "olea",
        "filename": "cover-v3",
        "prompt": (
            "Stunning photographic portrait of an ancient Aegean olive grove at early morning, "
            "single 600-year-old massive gnarled olive tree silhouetted against pastel sunrise sky, "
            "silver-green leaves shimmering with real morning dew droplets caught in sun, soft mist "
            "rolling between centuries-old trees, whitewashed stone village house with weathered "
            "terracotta roof visible in soft background, golden hour light filtering through "
            "branches, warm cream and sage green palette, real Mediterranean morning atmospheric "
            "documentary photograph, "
            f"{STYLE}"
        ),
    },
    {
        "edition": "aurora",
        "filename": "cover-v3",
        "prompt": (
            "Stunning photographic portrait of a restored Ottoman konak interior, single beam of "
            "warm directional sunlight cutting through tall arched window onto polished travertine "
            "floor creating sharp geometric shadow patterns from stone colonnade, single ancient "
            "pomegranate tree in inner courtyard with red fruits, two minimalist figures in flowing "
            "ivory silk attire visible in soft background, warm beige and contemporary rose-gold "
            "Future Dusk twilight purple accent palette, contemporary quiet luxury restraint, "
            "architectural cinematic documentary photograph, "
            f"{STYLE}"
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
            print(f"  poll error: {e}")
    raise TimeoutError(f"poll timeout after {max_wait}s")


def download(url, dest):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=120) as r:
        dest.write_bytes(r.read())


def main():
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
            "image_size": {"width": 832, "height": 1472},
            "num_images": 1,
            "enable_safety_checker": True,
            "output_format": "jpeg",
            "aspect_ratio": "9:16",
            "raw": True,  # Flux raw mode = less stylized, more photorealistic
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
            print(f"  download…")
            download(img_url, dest)
            kb = dest.stat().st_size // 1024
            print(f"  ✓ saved ({kb} kB)")
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            continue
    print("\nDone. Next: promote cover-v3 → cover, optimize, commit.")


if __name__ == "__main__":
    main()
