"""
PR #17 — Per-edition full-bleed COVER scenes for TemplateCarousel cards.

Bu script /public/<edition>/cover.png olarak 6 PNG render eder.
Önceki watermark PNG'leri vignette + alpha clipping içindi (mühür
arkasına subtle scene koymak için). Bu yeni cover'lar tam dolu sahne —
kartın ana görseli; mühür hâlâ üstte oturur ama bg artık "tema yok"
hissi vermez, her edisyon kendi sahnesini gösterir (Pressed Love +
The Digital Invite paritesi).

Çıkış aspect: 4:5 portrait (kart aspect-[3/4]'e yakın).
Çıkış yerleşimi: public/<edition>/cover.png
"""

import json
import time
import urllib.error
import urllib.request
from pathlib import Path

KEY = "7441b24e-10e4-445f-87ed-5ef928088a0b:82a7f49c3728ef622af17281125214a9"
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}

OUT_BASE = Path(__file__).resolve().parent.parent / "public"

PROMPTS = [
    # ── 1. AETHEL — Toskana antik şapel ──
    {
        "edition": "aethel",
        "name": "cover",
        "aspect": "4:5",
        "prompt": (
            "Vertical fine art watercolor illustration of an ancient Tuscan stone "
            "chapel at golden hour, surrounded by tall cypress trees and olive groves. "
            "Soft warm cream sky with gentle sun rays. Dusty sage green foliage, "
            "weathered ivory stone walls, subtle terracotta roof. Editorial wedding "
            "stationery aesthetic, painterly brush strokes, raw cotton paper texture. "
            "Hyper-elegant slow living premium identity. Empty centered space for a "
            "wax seal overlay. NO people, NO text, NO buildings besides the chapel. "
            "Muted palette: #EDE9DD cream, #9EAA8E sage, #C6B9A0 stone. 8k resolution."
        ),
    },
    # ── 2. ATELIER INDIGO — gece yarısı kozmik ──
    {
        "edition": "atelier-indigo",
        "name": "cover",
        "aspect": "4:5",
        "prompt": (
            "Vertical fine art illustration of a deep midnight starry sky over "
            "softly lit Ottoman architectural silhouettes. Velvety indigo and "
            "midnight blue gradient with constellations of tiny gold stars, a "
            "delicate crescent moon, and subtle champagne gold dust scattered. "
            "Painterly watercolor with metallic gold foil accents. Editorial luxury "
            "stationery aesthetic. Empty centered space for a wax seal overlay. "
            "NO people, NO text. Dominant palette: #0F1A3D midnight, #1B2E5F royal "
            "indigo, #C9A35C antique gold. Hyper-elegant, mystic, 8k resolution."
        ),
    },
    # ── 3. MANSION LIGHTS — Bosphorus yalı + chandelier ──
    {
        "edition": "mansion-lights",
        "name": "cover",
        "aspect": "4:5",
        "prompt": (
            "Vertical fine art watercolor of an opulent Ottoman waterfront mansion "
            "(Yalı) ballroom at dusk seen from inside, with a glowing crystal "
            "chandelier hanging from a richly ornamented ceiling. Warm amber light "
            "spilling onto deep burgundy velvet drapery and antique gold molding. "
            "Soft bokeh of candle flames, lush atmospheric perspective. Editorial "
            "luxury stationery aesthetic, painterly brush, raw paper texture. "
            "Empty centered space for a wax seal overlay. NO people, NO text. "
            "Dominant palette: #11261E deep emerald, #4A1521 burgundy, #C9A35C "
            "antique gold. Hyper-regal, 8k resolution."
        ),
    },
    # ── 4. BODRUM BLUE — Ege kıyı + yelkenli ──
    {
        "edition": "bodrum-blue",
        "name": "cover",
        "aspect": "4:5",
        "prompt": (
            "Vertical fine art watercolor of a sun-drenched Aegean coastline at "
            "late afternoon, calm turquoise sea with a single graceful sailboat in "
            "the distance, bright Cycladic white-washed cubic houses cascading "
            "down the cliffs, with magenta bougainvillea flowers spilling over "
            "stone walls. Editorial wedding stationery aesthetic, soft painterly "
            "brush strokes, raw cotton paper texture. Empty centered space for a "
            "wax seal overlay. NO people, NO text. Dominant palette: #F4F1EA cream, "
            "#7BA8B5 Aegean turquoise, #DA4C8B bougainvillea pink. Hyper-elegant "
            "Mediterranean, 8k resolution."
        ),
    },
    # ── 5. OLIVE GROVE — zeytin bahçesi golden hour ──
    {
        "edition": "olive-grove",
        "name": "cover",
        "aspect": "4:5",
        "prompt": (
            "Vertical fine art watercolor of a Mediterranean olive grove at golden "
            "hour. Ancient gnarled olive trees with sage-green silver leaves, tiny "
            "pale yellow lemons, soft afternoon sunlight filtering through "
            "branches. Warm vellum sky, dry desaturated grass below. Editorial "
            "botanical wedding stationery aesthetic, painterly delicate brush, raw "
            "cotton paper texture, hand-drawn feel. Empty centered space for a wax "
            "seal overlay. NO people, NO text. Dominant palette: #F2EFE0 vellum, "
            "#9CAF7E olive sage, #C6B377 pale gold. Hyper-elegant, slow living, "
            "8k resolution."
        ),
    },
    # ── 6. AURORA — modern minimal geometric ──
    {
        "edition": "aurora",
        "name": "cover",
        "aspect": "4:5",
        "prompt": (
            "Vertical fine art minimal abstract composition. Soft aurora-like "
            "gradient bands of muted blush pink, warm taupe, and lavender flowing "
            "diagonally across an off-white canvas, with sharp delicate geometric "
            "line work and a single fine rose-gold metallic arc. Avant-garde "
            "editorial luxury stationery aesthetic, raw paper texture, painterly "
            "yet contemporary. Empty centered space for a wax seal overlay. NO "
            "people, NO text, NO 3D rendering. Dominant palette: #F8F7F4 off-"
            "white, #C9B8D6 lavender, #D4A88F warm taupe, #B98E6F rose gold. "
            "Hyper-elegant modernist, 8k resolution."
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
            out = out_dir / f"{j['name']}.png"
            download(url, out)
            print(
                f"  ✓ {j['tag']} → {out.relative_to(OUT_BASE.parent)} "
                f"({out.stat().st_size // 1024} KB)",
                flush=True,
            )
        except Exception as e:
            print(f"FAIL {j['tag']}: {e}", flush=True)

    print("\nDone. 6 cover PNG'leri public/<edition>/cover.png olarak hazır.", flush=True)


if __name__ == "__main__":
    main()
