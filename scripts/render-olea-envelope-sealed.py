"""
Tek shot: kapalı olive zarf + basılı mühür, Etsy listing photo paritesi.

Çıktı: public/olea/envelope-sealed.jpg
Maliyet: ~$0.05
"""

import json
import time
import urllib.error
import urllib.request
from pathlib import Path

KEY = "616e465e-8d9a-4e17-8cb7-51553467fcbe:58d59bb81e7ac4b162110e1eb29c4be1"
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}
OUT = Path(__file__).resolve().parent.parent / "public" / "olea"
OUT.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Top-down macro photograph of a single sealed elegant matte olive-sage "
    "green wedding envelope, perfectly centered on a textured natural cream "
    "linen tablecloth background, slight tilt -3 degrees, the envelope is "
    "closed and a small round olive-green wax seal with embossed olive branch "
    "motif is pressed in the center of the closed back flap (where the flap "
    "meets the body), real wax texture with natural sheen and subtle "
    "asymmetric edge, soft natural morning light from upper-left creating "
    "delicate shadows, professional product photography f/2.8, Etsy luxury "
    "wedding stationery listing aesthetic, photorealistic not illustration "
    "not 3D render, NO TEXT on envelope, completely blank envelope face, "
    "minimal styling — just envelope + seal + clean linen background, "
    "no flowers no decorations, hero subject is the sealed envelope itself."
)


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
                with urllib.request.urlopen(req2, timeout=30) as r2:
                    return json.loads(r2.read())
            if status in ("ERROR", "FAILED"):
                raise RuntimeError(f"fal error: {s}")
            print(f"  [{int(time.time() - start)}s] {status}", flush=True)
        except urllib.error.URLError as e:
            print(f"  poll error: {e}", flush=True)
    raise TimeoutError(f"poll timeout after {max_wait}s")


def download(url, dest):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=120) as r:
        dest.write_bytes(r.read())


def main():
    dest = OUT / "envelope-sealed.jpg"
    if dest.exists() and dest.stat().st_size > 80_000:
        print(f"cached: {dest}", flush=True)
        return
    print("submitting…", flush=True)
    payload = {
        "prompt": PROMPT,
        "aspect_ratio": "4:3",
        "raw": True,
        "num_images": 1,
        "enable_safety_checker": True,
    }
    r = submit(payload)
    req_id = r.get("request_id") or r.get("id")
    print(f"req_id={req_id}", flush=True)
    result = poll(req_id)
    img_url = (result.get("images") or [{}])[0].get("url") or result.get("image", {}).get("url")
    if not img_url:
        print(f"ERROR no url: {result}", flush=True)
        return
    print("downloading…", flush=True)
    download(img_url, dest)
    kb = dest.stat().st_size // 1024
    print(f"saved: {dest} ({kb} kB)", flush=True)


if __name__ == "__main__":
    main()
