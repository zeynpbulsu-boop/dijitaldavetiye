"""
FAZ 4 — Recraft v3 ULTRA photoreal cover render.

Kullanıcı geri bildirimi: V3 (flux-pro raw) hâlâ illustration tendency
gösteriyor. Recraft v3 — photorealism için en iyi fal modeli.

Recraft v3 API: fal-ai/recraft-v3
  - style: "realistic_image" zorlar photoreal
  - "realistic_image/natural_light" daha cinematic
  - "realistic_image/hdr" yüksek dinamik aralık

Çalıştırma:
  python3 scripts/render-recraft-covers-v4.py
  python3 scripts/optimize-assets.py
"""

import time, json, urllib.request, urllib.error
from pathlib import Path

KEY = "616e465e-8d9a-4e17-8cb7-51553467fcbe:58d59bb81e7ac4b162110e1eb29c4be1"
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}
OUT_BASE = Path(__file__).resolve().parent.parent / "public"

PROMPTS = [
    {
        "edition": "aethel",
        "filename": "cover-v4",
        "prompt": (
            "Cinematic wedding photograph of an ancient Tuscan stone chapel at golden hour, "
            "weathered Romanesque limestone walls richly textured, single arched wooden doorway "
            "with warm sunlight spilling out, two white doves caught mid-flight near the bell tower "
            "with natural motion blur, gnarled ancient olive trees in foreground silver leaves "
            "catching low warm sun, deep cinematic shadows, Vogue editorial wedding cover, "
            "shot on Hasselblad medium format, 9:16 vertical portrait composition"
        ),
        "style": "realistic_image/natural_light",
    },
    {
        "edition": "nocturne",
        "filename": "cover-v4",
        "prompt": (
            "Cinematic wedding photograph of Ottoman palace at midnight, deep indigo Bosphorus "
            "reflecting hundreds of warm golden window lights, antique crystal chandelier visible "
            "through tall arched window casting prismatic light, faint stars in deep navy sky, "
            "silhouette of formally-dressed couple on marble balcony, deep shadows, anamorphic "
            "lens flare from chandelier, Vogue editorial luxury wedding cover, shot on Leica M11, "
            "9:16 vertical portrait composition"
        ),
        "style": "realistic_image/hdr",
    },
    {
        "edition": "candela",
        "filename": "cover-v4",
        "prompt": (
            "Cinematic wedding photograph of historic Ottoman waterfront mansion interior at dusk, "
            "hundreds of real flickering candles on long antique dining table with deep burgundy "
            "velvet runner, brass candelabras with bokeh, scattered fresh rose petals catching "
            "candlelight, Bosphorus water through tall arched window in background, intimate "
            "vintage grandeur, Vogue editorial wedding cover, shot on Hasselblad medium format, "
            "9:16 vertical portrait composition"
        ),
        "style": "realistic_image/natural_light",
    },
    {
        "edition": "mistral",
        "filename": "cover-v4",
        "prompt": (
            "Cinematic wedding photograph of pristine Aegean cove at golden sunset, single "
            "traditional white Bodrum gulet sailboat with billowing canvas sails on crystal "
            "turquoise water, whitewashed limestone houses cascading down hillside with vibrant "
            "magenta bougainvillea, weathered wooden jetty extending into sea, warm sunset light "
            "raking, salt-air atmospheric haze, Vogue editorial coastal wedding cover, "
            "shot on Sony A7R V, 9:16 vertical portrait composition"
        ),
        "style": "realistic_image/natural_light",
    },
    {
        "edition": "olea",
        "filename": "cover-v4",
        "prompt": (
            "Cinematic wedding photograph of ancient Aegean olive grove at early morning, single "
            "600-year-old massive gnarled olive tree silhouetted against soft pastel sunrise sky, "
            "silver-green leaves shimmering with morning dew, soft mist rolling between trees, "
            "whitewashed stone village house with terracotta roof in background, golden hour "
            "light filtering through branches, Vogue editorial Mediterranean wedding cover, "
            "shot on Canon EOS R5, 9:16 vertical portrait composition"
        ),
        "style": "realistic_image/natural_light",
    },
    {
        "edition": "aurora",
        "filename": "cover-v4",
        "prompt": (
            "Cinematic wedding photograph of restored Ottoman konak interior, beam of warm "
            "directional sunlight cutting through tall arched window onto polished travertine "
            "floor with sharp geometric shadows from stone colonnade, single ancient pomegranate "
            "tree in inner courtyard with red fruits, two minimalist figures in flowing ivory "
            "silk in background, warm beige with rose-gold accent, architectural Vogue editorial "
            "wedding cover, shot on Phase One XT, 9:16 vertical portrait composition"
        ),
        "style": "realistic_image/hdr",
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
        edition_dir = OUT_BASE / p["edition"]
        edition_dir.mkdir(exist_ok=True)
        dest = edition_dir / f"{p['filename']}.jpg"
        if dest.exists() and dest.stat().st_size > 100_000:
            print(f"[{i}/{len(PROMPTS)}] {p['edition']}/{p['filename']}.jpg — cached, skip")
            continue
        print(f"\n[{i}/{len(PROMPTS)}] {p['edition']} (Recraft v3) → submit")
        payload = {
            "prompt": p["prompt"],
            "image_size": "portrait_16_9",  # 9:16 portrait
            "style": p["style"],
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
    print("\nDone. Next: promote → cover.jpg, optimize, commit.")


if __name__ == "__main__":
    main()
