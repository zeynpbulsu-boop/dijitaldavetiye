"""
V4 — Premium wax seal render (flux-pro v1.1 ultra).

Önceki v3 (Recraft) hâlâ AI / illustration hissi veriyor. V4 flux-pro/v1.1
ultra ile MACRO PRODUCT PHOTOGRAPHY paritesi:
  - "macro photograph at f/2.8" → DOF kontrolü
  - "wax slightly asymmetric" → AI perfection circle hatası kırılır
  - "visible wax grain, not smooth" → AI smooth gradient hatası kırılır
  - "embossed depth with sharp inner shadow" → impression hissi
  - "cotton card paper substrate" → seal kağıda yapışmış
  - "no logo, no text" → sigil/symbol pure
  - Pure white background → Pillow ile alpha cut sonra

Boyut: 1024×1024 (square). Output: public/<edition>/wax-seal-v4.png
sonra transparent-bg.py ile alfaya çevrilir.

Maliyet: ~$0.05/render × 6 = ~$0.30 toplam.
"""

import json
import time
import urllib.error
import urllib.request
from pathlib import Path

KEY = "616e465e-8d9a-4e17-8cb7-51553467fcbe:58d59bb81e7ac4b162110e1eb29c4be1"
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}
OUT = Path(__file__).resolve().parent.parent / "public"

# Universal realism qualifiers — all prompts share these
BASE = (
    "Hyperrealistic macro product photograph at f/2.8 aperture, shallow depth of "
    "field, single round wax seal stamp centered on pure white seamless paper "
    "background, slight natural asymmetry around the perimeter where wax cooled "
    "and drooped, visible wax grain and pigment scatter on the surface, "
    "embossed design pressed deeply into the wax with sharp inner shadow showing "
    "physical depth, side lighting from upper-left at 45 degrees creating realistic "
    "specular highlights and warm shadow falloff, professional product photography, "
    "no text, no letters, no logos, no watermarks, no signature, pristine clean "
    "background, photo not illustration, photo not 3D render. "
)

PROMPTS = [
    {
        "edition": "aethel",
        "filename": "wax-seal-luxe-v4",
        "prompt": BASE + (
            "Deep sage green wax (Pantone 5615 muted forest tone) with subtle warm "
            "olive undertones, embossed design: a single olive branch with two pairs "
            "of leaves and one olive fruit, delicate fine line botanical engraving, "
            "Tuscan chapel aesthetic, the wax has a matte sheen with realistic surface "
            "irregularities like real sealing wax."
        ),
    },
    {
        "edition": "nocturne",
        "filename": "wax-seal-v4",
        "prompt": BASE + (
            "Deep midnight navy wax with bright 24k gold leaf flecks scattered across "
            "the surface (real gold powder dusted onto wax while warm), embossed design: "
            "a symmetric Art Deco rosette with eight pointed star at center and "
            "geometric filigree petals, debossed with sharp inner shadow, "
            "luxurious gold foil hits on the raised embossed edges only."
        ),
    },
    {
        "edition": "candela",
        "filename": "wax-seal-v4",
        "prompt": BASE + (
            "Deep burgundy oxblood red wax with slightly metallic warm copper sheen, "
            "embossed design: a single tall ornate Ottoman palace candle with a flame, "
            "framed by a delicate baroque oval cartouche with tiny scrollwork, "
            "rich red surface with realistic wax grain texture, "
            "candlelit warm hue."
        ),
    },
    {
        "edition": "mistral",
        "filename": "wax-seal-v4",
        "prompt": BASE + (
            "Pale Aegean blue wax (washed sea-glass tone) with hint of pearl iridescence, "
            "embossed design: a simple minimalist anchor crossing three stylized wave "
            "lines below, fine line nautical engraving in mid-century coastal style, "
            "matte powdery wax finish, salt-air patina."
        ),
    },
    {
        "edition": "olea",
        "filename": "wax-seal-v4",
        "prompt": BASE + (
            "Warm olive green wax (Mediterranean foliage tone) with subtle golden undertone, "
            "embossed design: a small cluster of three olive branches woven into a "
            "circular wreath with five oval leaves and two tiny olives, organic asymmetric "
            "botanical composition, matte natural sheen."
        ),
    },
    {
        "edition": "aurora",
        "filename": "wax-seal-v4",
        "prompt": BASE + (
            "Pale rose-gold wax with a delicate gradient blending into soft twilight violet "
            "at the lower edge, embossed design: a single ultra-thin horizontal line "
            "representing a horizon with a small abstract semi-circle rising above it "
            "like a stylized sun or arc, contemporary minimalist Scandinavian wedding "
            "aesthetic, smooth wax with subtle pearlescent sheen."
        ),
    },
]


def submit(payload):
    req = urllib.request.Request(
        "https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra",
        data=json.dumps(payload).encode("utf-8"),
        headers=HDR,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def poll(req_id, max_wait=300):
    status_url = (
        f"https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra/requests/{req_id}/status"
    )
    res_url = f"https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra/requests/{req_id}"
    start = time.time()
    while time.time() - start < max_wait:
        time.sleep(5)
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
            print(f"  [{int(time.time() - start)}s] {status}")
        except urllib.error.URLError as e:
            print(f"  poll error: {e}")
    raise TimeoutError(f"poll timeout after {max_wait}s")


def download(url, dest):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=120) as r:
        dest.write_bytes(r.read())


def main():
    print(
        "\n=== V4 Premium Wax Seal Render (flux-pro v1.1 ultra) ===\n"
        "6 seals × ~$0.05 = ~$0.30 total cost.\n"
        "After render, transparent-bg.py ile alpha kanalı uygulanmalı.\n"
    )
    for i, p in enumerate(PROMPTS, 1):
        edition_dir = OUT / p["edition"]
        edition_dir.mkdir(exist_ok=True)
        dest = edition_dir / f"{p['filename']}.png"
        if dest.exists() and dest.stat().st_size > 50_000:
            print(f"[{i}/{len(PROMPTS)}] {p['edition']}/{p['filename']}.png — cached, skip")
            continue
        print(f"\n[{i}/{len(PROMPTS)}] {p['edition']} (flux-pro ultra) → submit")
        payload = {
            "prompt": p["prompt"],
            "aspect_ratio": "1:1",
            "raw": True,            # less stylized, more photographic
            "num_images": 1,
            "enable_safety_checker": True,
        }
        try:
            r = submit(payload)
            req_id = r.get("request_id") or r.get("id")
            print(f"  request_id={req_id}")
            result = poll(req_id)
            img_url = (
                (result.get("images") or [{}])[0].get("url")
                or result.get("image", {}).get("url")
            )
            if not img_url:
                print(f"  ERROR: no url: {result}")
                continue
            print("  download…")
            download(img_url, dest)
            kb = dest.stat().st_size // 1024
            print(f"  ✓ saved ({kb} kB) → {dest.relative_to(OUT.parent)}")
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            continue
    print(
        "\nDone.\n"
        "Sırada: `python3 scripts/transparent-bg-all.py` çalıştır ki\n"
        "       beyaz BG alpha'ya dönsün. Sonra wax-seal-v4 → wax-seal\n"
        "       olarak rename ya da theme'lerde src path güncelle."
    )


if __name__ == "__main__":
    main()
