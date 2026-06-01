"""
Render a watercolor envelope paper texture per edition (Pressed Love
Big Entrance & Swan Lake paritesi). Envelope ceremony'de wax seal
arkasında render edilir, "gerçek bir zarf üzerinde mühür" hissi verir.

Output: public/<edition>/envelope-paper.jpg (4:5 portrait, optimize edilmiş)
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

# Per-edition cream/paper tone hint
PALETTES = {
    "aethel": "warm Tuscan cream paper, antique vellum, soft sage shadows",
    "nocturne": "deep velvety midnight indigo paper with faint silver foil shimmer",
    "candela": "rich burgundy textured paper with antique gold leaf accents",
    "mistral": "crisp Mediterranean white linen-textured paper, soft turquoise tint",
    "olea": "olive-cream natural linen paper, dusty sage tones",
    "aurora": "soft pearl ivory paper, blush pink and lavender hints",
}


def make_prompt(edition: str, tone: str) -> str:
    return (
        f"Vertical 4:5 portrait painterly watercolor of an elegant closed wedding "
        f"envelope flat on a soft surface. Diagonal triangle flap folds visible "
        f"at the top, gentle paper texture with visible deckle edges, painterly "
        f"shadow at the bottom. {tone}. Hand-painted feel, hyper-elegant editorial "
        f"wedding stationery aesthetic, soft atmospheric lighting, NO text, NO logos, "
        f"NO wax seal in the image (will be overlaid separately), 8k. The envelope "
        f"should fill 80% of the frame with breathing space around it."
    )


def post(url, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=HDR, method="POST")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def get(url):
    req = urllib.request.Request(url, headers=HDR, method="GET")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def submit(prompt: str):
    return post(
        "https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra",
        {
            "prompt": prompt,
            "aspect_ratio": "4:5",
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
                raise RuntimeError(f"{tag} job {s}")
        except urllib.error.HTTPError as e:
            if e.code != 404:
                raise
        time.sleep(3)
    raise TimeoutError(f"{tag} timeout")


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "curl/8.0"})
    with urllib.request.urlopen(req, timeout=90) as r:
        path.write_bytes(r.read())


def main():
    jobs = []
    for edition, tone in PALETTES.items():
        try:
            r = submit(make_prompt(edition, tone))
            jobs.append({"edition": edition, "request_id": r["request_id"]})
            print(f"submit {edition} → {r['request_id']}", flush=True)
        except Exception as e:
            print(f"SUBMIT FAIL {edition}: {e}", flush=True)

    for j in jobs:
        try:
            res = poll(j["request_id"], j["edition"])
            imgs = res.get("images") or res.get("data", {}).get("images") or []
            if not imgs:
                print(f"NO IMAGES {j['edition']}", flush=True)
                continue
            url = imgs[0].get("url") or imgs[0]
            out_dir = OUT_BASE / j["edition"]
            out_dir.mkdir(parents=True, exist_ok=True)
            out = out_dir / "envelope-paper-orig.png"
            download(url, out)
            print(f"  ✓ {j['edition']} → {out.name} ({out.stat().st_size // 1024} KB)", flush=True)
        except Exception as e:
            print(f"FAIL {j['edition']}: {e}", flush=True)

    print("\nDone. envelope-paper-orig.png hazır. optimize ile JPEG'e çevir.", flush=True)


if __name__ == "__main__":
    main()
