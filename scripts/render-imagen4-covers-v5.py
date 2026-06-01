"""
FAZ 5 — Imagen4 ULTRA photoreal cover render (Google's best model).

Recraft v3 (V4) hâlâ illustration tendency. Imagen4 = Google'ın Veo3
ailesinden text-to-image, hyper-photoreal master.

Endpoint: fal-ai/imagen4/preview (full quality, not /fast)
Aspect: portrait_16_9 (9:16)
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
        "filename": "cover-v5",
        "prompt": (
            "Editorial wedding photograph of an ancient Tuscan stone chapel at golden hour. "
            "Romanesque limestone walls weathered by centuries, single arched wooden doorway "
            "with warm sunlight spilling out from within, two white doves in graceful flight "
            "near the bell tower with motion blur, gnarled olive trees framing the foreground "
            "their silver leaves catching warm low sun, deep cinematic shadows, atmospheric "
            "morning haze in distance. Shot on Hasselblad H6D-100c medium format, 50mm Zeiss "
            "lens f/1.4, natural color grading. Vogue Weddings editorial cover. 9:16 vertical "
            "portrait composition."
        ),
    },
    {
        "edition": "nocturne",
        "filename": "cover-v5",
        "prompt": (
            "Editorial wedding photograph of opulent Ottoman palace exterior at midnight. "
            "Deep indigo Bosphorus water reflecting hundreds of warm golden window lights in "
            "shimmering mirror image, massive antique crystal chandelier visible through tall "
            "arched window casting prismatic light beams, faint stars in deep navy sky above, "
            "silhouette of elegantly-dressed couple on marble balcony. Anamorphic lens flare "
            "from chandelier. Rich midnight blue and warm gold color palette. Shot on Leica "
            "M11, 35mm Summilux f/1.4. Vogue Weddings luxury editorial cover. 9:16 vertical."
        ),
    },
    {
        "edition": "candela",
        "filename": "cover-v5",
        "prompt": (
            "Editorial wedding photograph of historic Ottoman waterfront mansion interior at "
            "intimate dusk. Hundreds of real flickering candles arranged on long antique "
            "dining table dressed with deep burgundy velvet runner, brass candelabras with "
            "real flames creating warm bokeh, scattered fresh rose petals catching candlelight, "
            "calm Bosphorus water visible through tall arched window in soft background. Deep "
            "burgundy and warm gold candlelit palette. Shot on Hasselblad medium format. "
            "Vogue Weddings intimate editorial cover. 9:16 vertical portrait."
        ),
    },
    {
        "edition": "mistral",
        "filename": "cover-v5",
        "prompt": (
            "Editorial wedding photograph of pristine Aegean cove at golden sunset. Single "
            "traditional white Bodrum gulet sailboat with billowing canvas sails on crystal "
            "turquoise water, whitewashed limestone houses cascading down hillside dotted "
            "with vibrant magenta bougainvillea flowers, weathered wooden jetty extending "
            "into sea, warm low-angle sunset light raking across the scene. Sun-bleached "
            "cream and Aegean blue palette with salt-air atmospheric haze. Shot on Sony "
            "A7R V, 35mm GMaster f/1.4. Vogue Weddings coastal editorial cover. 9:16 vertical."
        ),
    },
    {
        "edition": "olea",
        "filename": "cover-v5",
        "prompt": (
            "Editorial wedding photograph of ancient Aegean olive grove at early dawn. "
            "Single 600-year-old massive gnarled olive tree silhouetted against soft pastel "
            "sunrise sky, silver-green leaves shimmering with real morning dew droplets, soft "
            "mist rolling between centuries-old trees, whitewashed stone village house with "
            "weathered terracotta roof in soft background, golden hour light filtering through "
            "branches. Warm cream and sage green palette. Shot on Canon EOS R5, 85mm f/1.2. "
            "Vogue Weddings Mediterranean editorial cover. 9:16 vertical portrait."
        ),
    },
    {
        "edition": "aurora",
        "filename": "cover-v5",
        "prompt": (
            "Editorial architectural wedding photograph of restored Ottoman konak interior. "
            "Single beam of warm directional sunlight cutting through tall arched window onto "
            "polished travertine floor creating sharp geometric shadow patterns from stone "
            "colonnade, single ancient pomegranate tree in inner courtyard with red fruits, "
            "two minimalist figures in flowing ivory silk attire in soft background. Warm "
            "beige with contemporary rose-gold and Future Dusk twilight purple accent palette. "
            "Shot on Phase One XT medium format, 80mm Schneider lens. Vogue Weddings "
            "contemporary editorial cover. 9:16 vertical portrait."
        ),
    },
]


def submit(payload):
    req = urllib.request.Request(
        "https://queue.fal.run/fal-ai/imagen4/preview",
        data=json.dumps(payload).encode("utf-8"),
        headers=HDR,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def poll(req_id, max_wait=300):
    status_url = f"https://queue.fal.run/fal-ai/imagen4/preview/requests/{req_id}/status"
    res_url = f"https://queue.fal.run/fal-ai/imagen4/preview/requests/{req_id}"
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
        dest = edition_dir / f"{p['filename']}.jpg"
        if dest.exists() and dest.stat().st_size > 100_000:
            print(f"[{i}/{len(PROMPTS)}] {p['edition']}/{p['filename']}.jpg — cached, skip")
            continue
        print(f"\n[{i}/{len(PROMPTS)}] {p['edition']} (Imagen4) → submit")
        payload = {
            "prompt": p["prompt"],
            "aspect_ratio": "9:16",
            "num_images": 1,
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


if __name__ == "__main__":
    main()
