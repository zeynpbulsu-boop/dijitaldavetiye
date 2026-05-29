"""
Roll out cinematic video + realistic wax-seal + cover texture to the 6 remaining
themes (Geceyarısı already done). Sweet, soft, romantic palettes. All ORIGINAL
fal.ai-generated content.

Submits every job up front (fal processes concurrently), then polls + downloads.
Key from env:  FAL_KEY=... python3 scripts/render-all-themes.py
"""

import os, sys, time, json, urllib.request, urllib.error
from pathlib import Path

KEY = os.environ.get("FAL_KEY", "").strip()
if not KEY:
    sys.exit("FAL_KEY env var required")
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}
BASE = Path(__file__).resolve().parent.parent / "public" / "themes-v2"

SWEET = "soft romantic dreamy palette, sweet and delicate, gentle diffused light, premium wedding mood, no people, no text, cinematic"

THEMES = {
    "celenk": {
        "video": f"Cinematic slow drift through a dreamy garden of baby's-breath and eucalyptus, pale sage green and soft blush-pink blooms, floating pollen sparkles, shallow-focus bokeh, gentle morning breeze, {SWEET}, seamless calm motion.",
        "seal": "Macro photograph of a sage-green molten wax seal stamp ON PURE WHITE BACKGROUND for clean alpha clipping, glossy soft sage-green sealing wax with organic rounded drip edges, ornate embossed laurel border, smooth blank concave center, soft directional studio light, gentle shadow, photorealistic, premium wedding stationery, 8k.",
        "texture": "Soft cream cotton watercolor paper texture, barely-there pale sage and blush wash blooms, fine cold-press grain, gentle warm tone, NO text NO objects, gallery-quality stationery, 8k.",
        "seal_aspect": "1:1", "tex_aspect": "16:9",
    },
    "polaroid": {
        "video": f"Cinematic warm golden-hour summer meadow, expired-film nostalgic tones, soft sun flare and dreamy light leaks, gentle breeze through tall grass and wildflowers, shallow bokeh, slow motion, {SWEET}.",
        "seal": "Macro photograph of a dusty-rose blush molten wax seal stamp ON PURE WHITE BACKGROUND for alpha clipping, glossy soft blush-pink sealing wax, organic rounded edges, ornate embossed floral border, smooth blank center, warm soft studio light, photorealistic, premium wedding stationery, 8k.",
        "texture": "Warm cream kraft paper texture, soft expired-film warmth, faint terracotta tint, fine grain, NO text NO objects, nostalgic editorial stationery, 8k.",
        "seal_aspect": "1:1", "tex_aspect": "16:9",
    },
    "kurdele": {
        "video": f"Cinematic soft flowing dusty-blue silk chiffon fabric rippling gently in slow motion, ivory and powder-blue, delicate folds catching soft diffused light, elegant and tender, {SWEET}.",
        "seal": "Macro photograph of a dusty powder-blue molten wax seal stamp ON PURE WHITE BACKGROUND for alpha clipping, glossy soft blue sealing wax, organic rounded edges, ornate embossed ribbon-and-laurel border, smooth blank center, soft studio light, photorealistic, premium wedding stationery, 8k.",
        "texture": "Ivory vellum cotton paper texture, very faint powder-blue corner wash, fine deckled grain, soft cream tone, NO text NO objects, gallery stationery, 8k.",
        "seal_aspect": "1:1", "tex_aspect": "16:9",
    },
    "fener": {
        "video": f"Cinematic warm dusk vineyard with glowing golden string-light bokeh, soft amber and honey tones, fireflies drifting, olive leaves, tender golden-hour glow, {SWEET}.",
        "seal": "Macro photograph of an amber honey-gold molten wax seal stamp ON PURE WHITE BACKGROUND for alpha clipping, glossy warm amber sealing wax, organic rounded edges, ornate embossed laurel border, smooth blank center, warm directional light, photorealistic, premium wedding stationery, 8k.",
        "texture": "Warm deep-cream handmade paper texture with faint gold dust flecks, soft amber glow vignette, velvety grain, NO text NO objects, premium stationery, 8k.",
        "seal_aspect": "1:1", "tex_aspect": "16:9",
    },
    "defter": {
        "video": f"Cinematic cozy close-up of soft warm candlelight over pressed wildflowers and natural linen, gentle flicker glow, warm honey and sage tones, intimate shallow focus, slow motion, {SWEET}.",
        "seal": "Macro photograph of a warm terracotta-brown molten wax seal stamp ON PURE WHITE BACKGROUND for alpha clipping, glossy sienna-brown sealing wax, organic rounded edges, ornate embossed botanical border, smooth blank center, soft warm light, photorealistic, premium wedding stationery, 8k.",
        "texture": "Natural ivory linen weave fabric texture, fine threads, warm cream tone, soft shadow, NO text NO objects, intimate editorial stationery, 8k.",
        "seal_aspect": "1:1", "tex_aspect": "16:9",
    },
    "postakart": {
        "video": f"Cinematic vintage Aegean coastline at golden sunset, soft sepia-warm film tones, gentle turquoise waves lapping the shore, distant wooden sailboat, hazy nostalgic glow, slow gentle motion, {SWEET}.",
        "seal": "Macro photograph of a wine-red terracotta molten wax seal stamp ON PURE WHITE BACKGROUND for alpha clipping, glossy deep-red sealing wax, organic rounded edges, ornate embossed vintage crest border, smooth blank center, soft warm light, photorealistic, premium wedding stationery, 8k.",
        "texture": "Aged warm kraft sepia paper texture, soft vintage stains and fiber grain, gentle warm tone, NO text NO objects, vintage editorial stationery, 8k.",
        "seal_aspect": "1:1", "tex_aspect": "16:9",
    },
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


def poll(app_path, rid, tag, max_iter=180):
    base = f"https://queue.fal.run/{app_path}/requests/{rid}"
    for i in range(max_iter):
        try:
            st = get(f"{base}/status")
            s = st.get("status")
            if i % 4 == 0:
                print(f"  [{tag}] {i+1} → {s}", flush=True)
            if s == "COMPLETED":
                return get(base)
            if s in ("FAILED", "CANCELLED", "ERROR"):
                raise RuntimeError(f"{tag} {s}")
        except urllib.error.HTTPError as e:
            if e.code != 404:
                raise
        time.sleep(5)
    raise TimeoutError(f"{tag} timeout")


def submit_image(prompt, aspect):
    return post("https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra", {
        "prompt": prompt, "aspect_ratio": aspect, "num_images": 1,
        "enable_safety_checker": True, "output_format": "png", "raw": False,
    })["request_id"]


def submit_video(prompt):
    return post("https://queue.fal.run/fal-ai/kling-video/v1/standard/text-to-video", {
        "prompt": prompt, "duration": "5", "aspect_ratio": "16:9",
    })["request_id"]


def main():
    jobs = []
    for slug, t in THEMES.items():
        (BASE / slug).mkdir(parents=True, exist_ok=True)
        try:
            jobs.append(("fal-ai/flux-pro", submit_image(t["seal"], t["seal_aspect"]), slug, "wax-seal.png", "image"))
            print(f"submit {slug}/wax-seal", flush=True); time.sleep(0.5)
            jobs.append(("fal-ai/flux-pro", submit_image(t["texture"], t["tex_aspect"]), slug, "cover-texture.png", "image"))
            print(f"submit {slug}/cover-texture", flush=True); time.sleep(0.5)
            jobs.append(("fal-ai/kling-video", submit_video(t["video"]), slug, "hero-video.mp4", "video"))
            print(f"submit {slug}/hero-video", flush=True); time.sleep(0.5)
        except Exception as e:
            print(f"SUBMIT FAIL {slug}: {e}", flush=True)

    print(f"\n{len(jobs)} jobs submitted; polling…\n", flush=True)
    for app_path, rid, slug, name, kind in jobs:
        tag = f"{slug}/{name}"
        try:
            result = poll(app_path, rid, tag)
            if kind == "image":
                imgs = result.get("images") or result.get("data", {}).get("images") or []
                url = imgs[0].get("url") if imgs else None
            else:
                vid = result.get("video") or result.get("data", {}).get("video") or {}
                url = vid.get("url") if isinstance(vid, dict) else None
            if not url:
                print(f"NO URL {tag}: {json.dumps(result)[:200]}", flush=True); continue
            out = BASE / slug / name
            download(url, out)
            print(f"  ✓ {tag} ({out.stat().st_size//1024} KB)", flush=True)
        except Exception as e:
            print(f"FAIL {tag}: {e}", flush=True)
    print("\nDone.", flush=True)


if __name__ == "__main__":
    main()
