"""
FAZ 5.11 — Fal.ai luxe asset render

Generates 2 PNGs:
  1. chapel-vignette.png — Aethel Chapel architectural watercolor (white BG)
  2. wax-seal-luxe.png   — Sage green wax seal + peony + lace (white BG)

Both white-background by design so we can mix-blend-mode: multiply them
into the dark sage hero or use them as 6% opacity watermarks on body bg.

Saves:
  public/aethel/chapel-vignette.png
  public/aethel/wax-seal-luxe.png
"""

import os, sys, time, json, urllib.request, urllib.error
from pathlib import Path

KEY = "616e465e-8d9a-4e17-8cb7-51553467fcbe:58d59bb81e7ac4b162110e1eb29c4be1"
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}

OUT = Path(__file__).resolve().parent.parent / "public" / "aethel"
OUT.mkdir(parents=True, exist_ok=True)

PROMPTS = [
    {
        "name": "chapel-vignette",
        "prompt": (
            "Isolated architectural vignette of an ancient stone wedding chapel "
            "in Tuscany, overgrown with minimal climbing ivy and subtle muted "
            "wisteria. Fine art watercolor illustration, high-end editorial "
            "stationery texture, raw cotton paper feel. Soft desaturated moss "
            "greens, ivory, and antique vellum colors. ON A PURE WHITE "
            "BACKGROUND, clean edges, vignette style, NO 3D rendering, NO "
            "cartoonish gradients, hyper-elegant, slow living premium "
            "aesthetic, 8k resolution."
        ),
        "size": "portrait_4_3",
    },
    {
        "name": "wax-seal-luxe",
        "prompt": (
            "High-end luxury digital wax seal asset. A sage green circular wax "
            "seal with an embossed intricate peony bouquet motif in the center. "
            "The outer edges of the seal are adorned with an ultra-fine, "
            "delicate line work inspired by vintage traditional lace patterns. "
            "Shimmering champagne gold foil accents. DISPLAYED ON A PURE WHITE "
            "BACKGROUND, clean vector-like edges for easy background isolation, "
            "soft natural shadows, photorealistic luxury branding element."
        ),
        "size": "square",
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


def submit(prompt, size):
    """Submit to flux-pro/v1.1-ultra queue."""
    return post(
        "https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra",
        {
            "prompt": prompt,
            "aspect_ratio": "1:1" if size == "square" else "4:3",
            "num_images": 1,
            "enable_safety_checker": True,
            "output_format": "png",
            "raw": False,
        },
    )


def poll(request_id, name):
    base = f"https://queue.fal.run/fal-ai/flux-pro/requests/{request_id}"
    for i in range(60):  # up to ~3 min
        try:
            st = get(f"{base}/status")
            status = st.get("status")
            print(f"  [{name}] poll {i+1}/60 → {status}", flush=True)
            if status == "COMPLETED":
                return get(base)
            if status in ("FAILED", "CANCELLED", "ERROR"):
                raise RuntimeError(f"job {status}: {st}")
        except urllib.error.HTTPError as e:
            if e.code == 404 and i < 3:
                # Sometimes queue takes a moment to index — wait
                pass
            else:
                raise
        time.sleep(3)
    raise TimeoutError(f"job {name} never completed")


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "curl/8.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        path.write_bytes(r.read())


def main():
    requests_q = []
    for p in PROMPTS:
        print(f"submit {p['name']}…", flush=True)
        try:
            resp = submit(p["prompt"], p["size"])
            requests_q.append({**p, "request_id": resp["request_id"]})
            print(f"  → {resp['request_id']}", flush=True)
        except Exception as e:
            print(f"  SUBMIT FAILED: {e}", flush=True)
            sys.exit(1)

    for q in requests_q:
        print(f"\npoll {q['name']}…", flush=True)
        result = poll(q["request_id"], q["name"])
        images = result.get("images") or result.get("data", {}).get("images") or []
        if not images:
            print(f"  NO IMAGES in result: {json.dumps(result)[:600]}", flush=True)
            continue
        url = images[0].get("url") or images[0]
        out = OUT / f"{q['name']}.png"
        print(f"  download → {out}", flush=True)
        download(url, out)
        print(f"  ✓ saved ({out.stat().st_size // 1024} KB)", flush=True)


if __name__ == "__main__":
    main()
