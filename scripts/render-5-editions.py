"""
FAZ 5.12 — Fal.ai 10-asset render (5 editions × 2 PNG/each).

Saves:
  public/atelier-indigo/{watermark,wax-seal}.png
  public/mansion-lights/{watermark,wax-seal}.png
  public/bodrum-blue/{watermark,wax-seal}.png
  public/olive-grove/{watermark,wax-seal}.png
  public/aurora/{watermark,wax-seal}.png

Then run scripts/transparent-bg-all.py to alpha-clip the white.
"""

import os, sys, time, json, urllib.request, urllib.error
from pathlib import Path

KEY = "616e465e-8d9a-4e17-8cb7-51553467fcbe:58d59bb81e7ac4b162110e1eb29c4be1"
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}

OUT_BASE = Path(__file__).resolve().parent.parent / "public"

PROMPTS = [
    # ── 1. ATELIER INDIGO ──
    {
        "edition": "atelier-indigo",
        "name": "watermark",
        "aspect": "4:3",
        "prompt": (
            "Isolated ethereal fine art vignette of a fluid traditional Turkish "
            "Ebru marbling art pattern. Swirling deep indigo, midnight blue, and "
            "dark navy organic fluid textures with ultra-subtle, elegant shimmering "
            "champagne gold foil veins. Fine art watercolor stationery texture, raw "
            "cotton paper feel. ON A PURE WHITE BACKGROUND, clean vignette edges, "
            "NO harsh vector blocks, NO cartoonish neon gradients, hyper-elegant, "
            "slow living premium identity, 8k resolution."
        ),
    },
    {
        "edition": "atelier-indigo",
        "name": "wax-seal",
        "aspect": "1:1",
        "prompt": (
            "High-end luxury digital wax seal asset. A deep midnight blue circular "
            "wax seal with an embossed intricate crescent moon and stars motif in "
            "the center. The outer edges are adorned with ultra-fine, delicate "
            "line work inspired by vintage traditional lace patterns. Shimmering "
            "gold foil accents. DISPLAYED ON A PURE WHITE BACKGROUND, clean "
            "vector-like edges for alpha transparency isolation, photorealistic "
            "luxury branding element."
        ),
    },
    # ── 2. MANSION LIGHTS ──
    {
        "edition": "mansion-lights",
        "name": "watermark",
        "aspect": "4:3",
        "prompt": (
            "Isolated architectural vignette illustration of a historic Ottoman "
            "waterfront mansion (Yalı) on the Bosphorus at dusk. Soft, warm amber "
            "glowing lights from the windows reflecting subtly on dark calm "
            "waters. Fine art watercolor aesthetic, high-end editorial stationery "
            "texture, raw paper feel. Muted deep burgundy, warm amber, and "
            "antique gold accents. ON A PURE WHITE BACKGROUND, clean faded edges, "
            "NO 3D rendering, NO cartoonish gradients, hyper-elegant, 8k resolution."
        ),
    },
    {
        "edition": "mansion-lights",
        "name": "wax-seal",
        "aspect": "1:1",
        "prompt": (
            "High-end luxury digital wax seal asset. A rich deep burgundy circular "
            "wax seal with an embossed intricate classic calligraphy Monogram/Tuğra "
            "motif in the center. The outer edges are adorned with ultra-fine, "
            "delicate lace pattern line work. Shimmering antique gold foil accents. "
            "DISPLAYED ON A PURE WHITE BACKGROUND, clean edges for background "
            "isolation, photorealistic luxury stationery asset."
        ),
    },
    # ── 3. BODRUM BLUE ──
    {
        "edition": "bodrum-blue",
        "name": "watermark",
        "aspect": "4:3",
        "prompt": (
            "Isolated botanical and tile vignette of vivid yet sophisticated "
            "magenta bougainvillea flowers cascading over a delicate border of "
            "traditional Mediterranean mosaic tile patterns. Fine art watercolor "
            "illustration, high-end editorial stationery texture, raw cotton paper "
            "feel. Crisp Mediterranean white, soft turquoise, and deep fuchsia "
            "tones. ON A PURE WHITE BACKGROUND, clean faded edges, NO 3D "
            "rendering, hyper-elegant, editorial photography style, 8k resolution."
        ),
    },
    {
        "edition": "bodrum-blue",
        "name": "wax-seal",
        "aspect": "1:1",
        "prompt": (
            "High-end luxury digital wax seal asset. A vibrant Mediterranean "
            "turquoise circular wax seal with an embossed intricate antique olive "
            "branch motif in the center. The outer edges feature an ultra-fine, "
            "delicate vintage lace pattern. Shimmering silver foil accents. "
            "DISPLAYED ON A PURE WHITE BACKGROUND, clean vector-like edges for "
            "easy alpha transparency, photorealistic branding element."
        ),
    },
    # ── 4. OLIVE GROVE ──
    {
        "edition": "olive-grove",
        "name": "watermark",
        "aspect": "4:3",
        "prompt": (
            "Isolated soft botanical vignette of delicate watercolor olive tree "
            "branches with muted green leaves and tiny organic lemons. High-end "
            "editorial stationery texture, raw cotton paper feel, soft hand-drawn "
            "aesthetic. Desaturated moss greens, pale yellow, and antique vellum "
            "colors. ON A PURE WHITE BACKGROUND, clean faded vignette edges, NO "
            "3D rendering, NO cartoonish gradients, hyper-elegant premium "
            "aesthetic, 8k resolution."
        ),
    },
    {
        "edition": "olive-grove",
        "name": "wax-seal",
        "aspect": "1:1",
        "prompt": (
            "High-end luxury digital wax seal asset. A matte sage green circular "
            "wax seal with an embossed intricate pair of minimalist lovebirds "
            "motif in the center. The outer edges feature ultra-fine, delicate "
            "vintage lace pattern linework. Shimmering champagne gold foil "
            "accents. DISPLAYED ON A PURE WHITE BACKGROUND, clean edges for "
            "alpha transparency, photorealistic luxury element."
        ),
    },
    # ── 5. AURORA MODERNIST ──
    {
        "edition": "aurora",
        "name": "watermark",
        "aspect": "4:3",
        "prompt": (
            "Isolated minimalist abstract vignette of contemporary architectural "
            "fine lines and soft geometric shadows. Fine art watercolor texture "
            "blended with avant-garde editorial stationery design, raw paper "
            "feel. Soft muted blush pink, warm taupe, and desaturated vizon "
            "tones. ON A PURE WHITE BACKGROUND, clean edges, vignette style, NO "
            "3D rendering, NO cheap gradients, hyper-elegant luxury aesthetic, "
            "8k resolution."
        ),
    },
    {
        "edition": "aurora",
        "name": "wax-seal",
        "aspect": "1:1",
        "prompt": (
            "High-end luxury digital wax seal asset. A sophisticated warm taupe/"
            "vizon circular wax seal with a sharp minimalist geometric abstract "
            "line motif in the center. The outer edges feature an ultra-fine "
            "contemporary lace-inspired pattern. Shimmering rose gold foil "
            "accents. DISPLAYED ON A PURE WHITE BACKGROUND, clean vector-like "
            "edges for background isolation, photorealistic element."
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
    # Submit all 10 in parallel
    jobs = []
    for p in PROMPTS:
        tag = f"{p['edition']}/{p['name']}"
        try:
            r = submit(p)
            jobs.append({**p, "request_id": r["request_id"], "tag": tag})
            print(f"submit {tag} → {r['request_id']}", flush=True)
        except Exception as e:
            print(f"SUBMIT FAIL {tag}: {e}", flush=True)

    # Poll & download each
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
            print(f"  ✓ {j['tag']} → {out.relative_to(OUT_BASE.parent)} ({out.stat().st_size // 1024} KB)", flush=True)
        except Exception as e:
            print(f"FAIL {j['tag']}: {e}", flush=True)

    print("\nDone. Run scripts/transparent-bg-all.py next.", flush=True)


if __name__ == "__main__":
    main()
