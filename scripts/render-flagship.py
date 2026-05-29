"""
Flagship (Geceyarısı) premium assets — fal.ai.

Generates ORIGINAL cinematic assets to lift the flagship to competitor-grade
production value (own content, not anyone else's files):
  1) wax-seal-gold      — realistic embossed gold wax seal (image, flux-pro)
  2) cover-texture       — deep navy luxe handmade-paper texture (image)
  3) night-sky (VIDEO)   — cinematic starfield/nebula drift loop (kling video)

Key is read from the environment (never hardcoded here):
  FAL_KEY=... python3 scripts/render-flagship.py
"""

import os, sys, time, json, urllib.request, urllib.error
from pathlib import Path

KEY = os.environ.get("FAL_KEY", "").strip()
if not KEY:
    sys.exit("FAL_KEY env var required (e.g. FAL_KEY=... python3 scripts/render-flagship.py)")
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}

OUT = Path(__file__).resolve().parent.parent / "public" / "themes-v2" / "geceyarisi"
OUT.mkdir(parents=True, exist_ok=True)

IMAGES = [
    {
        "name": "wax-seal-gold",
        "aspect": "1:1",
        "prompt": (
            "Macro product photograph of a luxurious molten gold wax seal stamp, "
            "isolated ON PURE WHITE BACKGROUND for clean alpha clipping. Glossy "
            "antique-gold sealing wax with realistic organic rounded drip edges, an "
            "ornate embossed laurel-and-star border pressed into the wax, a smooth "
            "subtly concave polished center left blank. Dramatic soft directional "
            "studio lighting, gentle shadow, rich golden highlights, ultra-detailed "
            "wax surface texture. Centered, premium wedding stationery, "
            "photorealistic, 8k."
        ),
    },
    {
        "name": "cover-texture",
        "aspect": "16:9",
        "prompt": (
            "Deep midnight navy-blue luxe handmade paper texture, fine cotton fiber "
            "grain, very subtle scattered gold dust flecks catching faint light, "
            "soft dark vignette toward the edges, velvety matte surface, elegant and "
            "understated. Flat even studio lighting, NO text, NO objects, just the "
            "rich navy paper surface, gallery-quality, ultra-high resolution, 8k."
        ),
    },
]

VIDEO = {
    "name": "night-sky",
    "aspect": "16:9",
    "duration": "5",
    "prompt": (
        "Cinematic slow drift through a deep midnight-blue night sky, soft glowing "
        "nebula clouds in navy and faint violet, countless shimmering golden stars "
        "twinkling, a few delicate gold particles floating, gentle slow forward "
        "camera push, dreamy ethereal atmosphere, ultra-detailed, volumetric soft "
        "light, no people, no text, premium cinematic wedding mood, seamless calm "
        "motion."
    ),
}


def post(url, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=HDR, method="POST")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def get(url):
    req = urllib.request.Request(url, headers=HDR, method="GET")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "curl/8.0"})
    with urllib.request.urlopen(req, timeout=300) as r:
        path.write_bytes(r.read())


def poll(app_path, rid, tag, max_iter=160):
    base = f"https://queue.fal.run/{app_path}/requests/{rid}"
    for i in range(max_iter):
        try:
            st = get(f"{base}/status")
            s = st.get("status")
            print(f"  [{tag}] {i+1}/{max_iter} → {s}", flush=True)
            if s == "COMPLETED":
                return get(base)
            if s in ("FAILED", "CANCELLED", "ERROR"):
                raise RuntimeError(f"{tag} {s}: {json.dumps(st)[:300]}")
        except urllib.error.HTTPError as e:
            if e.code != 404:
                raise
        time.sleep(5)
    raise TimeoutError(f"{tag} never completed")


def do_image(p):
    tag = f"image/{p['name']}"
    try:
        r = post("https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra", {
            "prompt": p["prompt"], "aspect_ratio": p["aspect"], "num_images": 1,
            "enable_safety_checker": True, "output_format": "png", "raw": False,
        })
        rid = r["request_id"]
        print(f"submit {tag} → {rid}", flush=True)
        result = poll("fal-ai/flux-pro", rid, tag, max_iter=100)
        imgs = result.get("images") or result.get("data", {}).get("images") or []
        url = imgs[0].get("url") if imgs else None
        if not url:
            print(f"NO IMAGE {tag}: {json.dumps(result)[:300]}", flush=True); return
        out = OUT / f"{p['name']}.png"
        download(url, out)
        print(f"  ✓ {tag} → {out} ({out.stat().st_size//1024} KB)", flush=True)
    except Exception as e:
        print(f"FAIL {tag}: {e}", flush=True)


def do_video(p):
    tag = f"video/{p['name']}"
    try:
        r = post("https://queue.fal.run/fal-ai/kling-video/v1/standard/text-to-video", {
            "prompt": p["prompt"], "duration": p["duration"], "aspect_ratio": p["aspect"],
        })
        rid = r["request_id"]
        print(f"submit {tag} → {rid}", flush=True)
        result = poll("fal-ai/kling-video", rid, tag, max_iter=160)
        vid = (result.get("video") or result.get("data", {}).get("video") or {})
        url = vid.get("url") if isinstance(vid, dict) else None
        if not url:
            print(f"NO VIDEO {tag}: {json.dumps(result)[:400]}", flush=True); return
        out = OUT / f"{p['name']}.mp4"
        download(url, out)
        print(f"  ✓ {tag} → {out} ({out.stat().st_size//1024} KB)", flush=True)
    except Exception as e:
        print(f"FAIL {tag}: {e}", flush=True)


def main():
    for img in IMAGES:
        do_image(img)
    do_video(VIDEO)
    print("\nDone.", flush=True)


if __name__ == "__main__":
    main()
