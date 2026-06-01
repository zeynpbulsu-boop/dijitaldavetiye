"""
PR #24 — Re-render 6 cover scenes with Pressed Love Swan Lake quality.

Pressed Love Swan Lake referansı (720×1280, fal.ai-style):
- Soft pastel watercolor
- Painterly atmospheric perspective
- Romantic dreamy aesthetic
- Yumuşak pembe + lavanta + sage + Aegean turkuaz paleti

Önceki covers (PR #17) gerçekçi atmosferik fotoğraf gibiydi. Swan Lake
seviyesi: hayalimsi, suluboya, mor-pembe-mavi pastel hakim, painterly
fırça izleri görünür.

Çıkış: public/<edition>/cover.jpg (Pillow ile 1600px JPEG q88)
"""

import json
import time
import urllib.error
import urllib.request
from pathlib import Path

import os
KEY = os.environ.get("FAL_KEY", "").strip()  # secret from env (none in source)
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}

OUT_BASE = Path(__file__).resolve().parent.parent / "public"

# Swan Lake style descriptor reused across all prompts
SWAN_STYLE = (
    "Soft pastel watercolor painting, hyper-elegant editorial wedding "
    "stationery aesthetic, painterly visible brush strokes on raw cotton "
    "paper texture, dreamy atmospheric perspective, romantic ethereal mood, "
    "Pressed Love Swan Lake style. Soft pinks, lavenders, sage greens, "
    "powder blue, antique cream. NO photographic realism, NO 3D rendering, "
    "NO sharp digital lines. Hand-painted feel, slow living premium identity, "
    "8k resolution, vertical 720×1280 portrait composition with empty centered "
    "space for a wax seal overlay (subject elements should sit in the lower "
    "third and upper third only, leaving the central 30% breathing space)."
)

PROMPTS = [
    {
        "edition": "aethel",
        "name": "cover",
        "aspect": "9:16",
        "prompt": (
            "Vertical painterly watercolor of an ancient Tuscan stone chapel "
            "nestled in a misty olive grove at golden hour. Soft cypress trees "
            "silhouettes, dreamy pastel sage and cream tones, distant lavender "
            "mountains, scattered wildflowers in lavender and pale yellow, a "
            "few graceful white doves drifting in the sky. " + SWAN_STYLE
        ),
    },
    {
        "edition": "nocturne",
        "name": "cover",
        "aspect": "9:16",
        "prompt": (
            "Vertical painterly watercolor of a deep velvety midnight sky over "
            "soft ethereal Ottoman dome silhouettes. Crescent moon, scattered "
            "tiny gold stars and constellations, drifting silver clouds, a faint "
            "rose-gold aurora hint along the horizon. Powdery indigo, royal "
            "navy and champagne gold accents, dreamy stardust particles. "
            + SWAN_STYLE
        ),
    },
    {
        "edition": "candela",
        "name": "cover",
        "aspect": "9:16",
        "prompt": (
            "Vertical painterly watercolor of an opulent Bosphorus waterfront "
            "Ottoman mansion ballroom at twilight, viewed through ornate arched "
            "windows. A glowing crystal chandelier suspended over deep burgundy "
            "velvet drapery, soft candle bokeh, antique gold molding, distant "
            "calm sea reflections. Painterly atmospheric perspective, warm "
            "amber and deep burgundy palette with soft ivory highlights. "
            + SWAN_STYLE
        ),
    },
    {
        "edition": "mistral",
        "name": "cover",
        "aspect": "9:16",
        "prompt": (
            "Vertical painterly watercolor of a sun-drenched Aegean coastline "
            "at late afternoon. Calm turquoise sea with two graceful sailboats "
            "in soft focus, cascading magenta bougainvillea spilling over "
            "Cycladic white-washed cliffside houses, distant pale Greek "
            "islands. Mediterranean white, soft turquoise, dusty rose, "
            "lavender shadow tones. Dreamy hand-painted feel. " + SWAN_STYLE
        ),
    },
    {
        "edition": "olea",
        "name": "cover",
        "aspect": "9:16",
        "prompt": (
            "Vertical painterly watercolor of a romantic Mediterranean olive "
            "grove at sunrise. Ancient gnarled olive trees with silvery sage "
            "leaves, pale yellow lemons hanging gently, scattered lavender "
            "wildflowers and sage-green ferns at the base. Soft warm golden "
            "morning light filtering through, distant rolling hills in pale "
            "lavender. Antique vellum cream, sage, dusty pink, soft gold "
            "palette. " + SWAN_STYLE
        ),
    },
    {
        "edition": "aurora",
        "name": "cover",
        "aspect": "9:16",
        "prompt": (
            "Vertical painterly watercolor of a soft minimalist abstract dream "
            "landscape. Gentle aurora-like gradient bands of blush pink, "
            "lavender, warm taupe, and powder blue flowing diagonally across "
            "a misty pastel sky. Below: a single graceful rose-gold geometric "
            "arc, delicate floating dust particles, faint pearl shimmer. "
            "Avant-garde editorial dreamy modernism, hand-painted feel, no "
            "harsh edges. " + SWAN_STYLE
        ),
    },
]


def post(url, body):
    req = urllib.request.Request(
        url, data=json.dumps(body).encode(), headers=HDR, method="POST"
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def get(url):
    req = urllib.request.Request(url, headers=HDR, method="GET")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def submit(p):
    return post(
        "https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra",
        {
            "prompt": p["prompt"],
            "aspect_ratio": p["aspect"],
            "num_images": 1,
            "enable_safety_checker": True,
            "output_format": "png",
            "raw": False,
        },
    )


def poll(rid, tag):
    base = f"https://queue.fal.run/fal-ai/flux-pro/requests/{rid}"
    for i in range(80):
        try:
            st = get(f"{base}/status")
            s = st.get("status")
            print(f"  [{tag}] {i+1}/80 → {s}", flush=True)
            if s == "COMPLETED":
                return get(base)
            if s in ("FAILED", "CANCELLED", "ERROR"):
                raise RuntimeError(f"{tag} job {s}: {st}")
        except urllib.error.HTTPError as e:
            if e.code != 404:
                raise
        time.sleep(3)
    raise TimeoutError(f"{tag} never completed")


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "curl/8.0"})
    with urllib.request.urlopen(req, timeout=90) as r:
        path.write_bytes(r.read())


def main():
    jobs = []
    for p in PROMPTS:
        tag = f"{p['edition']}/{p['name']}"
        try:
            r = submit(p)
            jobs.append({**p, "request_id": r["request_id"], "tag": tag})
            print(f"submit {tag} → {r['request_id']}", flush=True)
        except Exception as e:
            print(f"SUBMIT FAIL {tag}: {e}", flush=True)

    for j in jobs:
        out_dir = OUT_BASE / j["edition"]
        out_dir.mkdir(parents=True, exist_ok=True)
        try:
            result = poll(j["request_id"], j["tag"])
            images = result.get("images") or result.get("data", {}).get("images") or []
            if not images:
                print(f"NO IMAGES {j['tag']}: {json.dumps(result)[:300]}", flush=True)
                continue
            url = images[0].get("url") or images[0]
            out = out_dir / f"{j['name']}-swan.png"
            download(url, out)
            print(
                f"  ✓ {j['tag']} → {out.relative_to(OUT_BASE.parent)} "
                f"({out.stat().st_size // 1024} KB)",
                flush=True,
            )
        except Exception as e:
            print(f"FAIL {j['tag']}: {e}", flush=True)

    print("\nDone. swan PNGs hazır. Pillow optimize için scripts/optimize-covers.py'i swan'lara da uygula.", flush=True)


if __name__ == "__main__":
    main()
