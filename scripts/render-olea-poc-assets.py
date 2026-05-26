"""
Olea PoC (2026 Etsy-trend refresh) — flux-pro v1.1 ultra real photography.

Hedef: Etsy "Olive Green Wedding" satıcılarının (SahyeTemplates,
CraftyPrintablessCo) görsel paritesini yakalamak.

Üretilenler (5 yeni asset):
  1. olea/envelope-on-linen.jpg    — gerçek olive zarf, krem keten/satin
                                    üstünde, mat ışık, F2.0, top-down
  2. olea/floral-corner-tl.png     — sol üst köşe ornament: krem güller +
                                    yeşil zeytin + okaliptus + ortanca,
                                    transparent BG (Pillow ile sonra)
  3. olea/floral-corner-br.png     — sağ alt köşe (1'in mirror'ı)
  4. olea/paper-substrate.jpg      — koyu krem keten kâğıt textured BG
                                    (couple foto / story section'ları
                                    için zemin)
  5. olea/wax-seal-on-paper.jpg    — wax seal'ın gerçek beyaz cotton kâğıt
                                    üstünde basılmış hali (envelope
                                    ceremony fallback yerine kullanılır)

Maliyet: 5 × ~$0.05 = ~$0.25 toplam.
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


def quality_prefix(square=True):
    """Universal photo qualifiers — hyperreal, no AI tells."""
    ar = "perfect square 1:1 framing" if square else ""
    return (
        f"Hyperrealistic macro photograph, professional product styling, "
        f"shallow depth of field f/2.8, natural soft window light from upper "
        f"left, warm sage-cream color grade, magazine-quality wedding stationery "
        f"photo, no text no logos no watermarks no signatures, "
        f"editorial flat-lay aesthetic, {ar}. "
    )


PROMPTS = [
    # 1) Real envelope on linen — used as envelope ceremony BG
    {
        "filename": "envelope-on-linen",
        "aspect_ratio": "9:16",  # vertical for envelope ceremony full-bleed
        "prompt": (
            quality_prefix(square=False)
            + "A single elegant matte olive-sage green wedding envelope, "
            "vertical portrait orientation, slightly tilted -5 degrees, sits "
            "alone center-frame on a textured natural cream linen tablecloth "
            "background, the envelope flap is closed with a small visible "
            "fold line, faint paper texture visible, three small fresh white "
            "ranunculus flowers and two olive branch leaves arranged around "
            "the lower-right corner of the envelope as styling, soft natural "
            "morning light, the envelope itself is the hero of the shot, "
            "no wax seal in this shot — the seal will be composited "
            "separately, NO TEXT on the envelope, completely blank envelope "
            "face."
        ),
    },
    # 2) Floral corner ornament — top-left, will be alpha-cut
    {
        "filename": "floral-corner-tl",
        "aspect_ratio": "1:1",
        "prompt": (
            quality_prefix()
            + "Top-left corner ornamental floral arrangement isolated on "
            "PURE WHITE background, cluster of fresh ivory and cream garden "
            "roses, white ranunculus, soft sage olive branches with small "
            "leaves and tiny olive fruits, delicate eucalyptus stems, "
            "arrangement spills from the top-left corner toward the center, "
            "leaves the right and bottom areas empty white space, no stems "
            "visible at the cut edge, looks like a real photographed wedding "
            "florist arrangement, natural soft lighting, no shadows on the "
            "background, ready to be alpha-cut and used as a corner overlay "
            "ornament on a wedding invitation."
        ),
    },
    # 3) Floral corner ornament — bottom-right (mirror)
    {
        "filename": "floral-corner-br",
        "aspect_ratio": "1:1",
        "prompt": (
            quality_prefix()
            + "Bottom-right corner ornamental floral arrangement isolated on "
            "PURE WHITE background, cluster of fresh ivory and cream garden "
            "roses, white ranunculus, soft sage olive branches with small "
            "leaves and tiny olive fruits, delicate eucalyptus stems, "
            "arrangement spills from the bottom-right corner toward the "
            "center, leaves the left and top areas empty white space, "
            "mirrored composition to the top-left version, no stems visible "
            "at the cut edge, real wedding florist arrangement aesthetic, "
            "natural soft lighting, no shadows on the background, ready to "
            "be alpha-cut and used as a corner overlay ornament."
        ),
    },
    # 4) Paper substrate — used as section BG behind story / details
    {
        "filename": "paper-substrate",
        "aspect_ratio": "16:9",
        "prompt": (
            quality_prefix(square=False)
            + "Seamless flat-lay photograph of high-end natural cream cotton "
            "watercolor paper texture filling the entire frame, visible fine "
            "weave and tiny natural fiber inclusions, slight warm tonal "
            "variation across the surface (cream center, slightly warmer "
            "sage-cream edges), perfectly clean — no objects, no shadows, no "
            "watermarks, just the paper itself, used as a luxury wedding "
            "invitation background texture, museum-quality archival paper."
        ),
    },
    # 5) Wax seal on real paper — composite shot
    {
        "filename": "wax-seal-on-paper",
        "aspect_ratio": "1:1",
        "prompt": (
            quality_prefix()
            + "Top-down macro photograph of a single small round olive-sage "
            "green wax seal stamp pressed into the center of natural cream "
            "cotton paper, the wax seal embossed with a delicate olive "
            "branch motif with two pairs of leaves and one olive fruit, "
            "real wax texture with slight asymmetry where wax cooled, soft "
            "natural shadow from the raised seal onto the paper just below "
            "and to the right, paper has visible fine cotton weave fibers, "
            "luxury wedding stationery aesthetic, perfectly centered composition."
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
    res_url = (
        f"https://queue.fal.run/fal-ai/flux-pro/v1.1-ultra/requests/{req_id}"
    )
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
        "\n=== Olea PoC Asset Render (flux-pro v1.1 ultra) ===\n"
        f"5 asset, ~$0.25 toplam maliyet.\n"
        f"Output: {OUT.relative_to(OUT.parent.parent)}/\n"
    )
    for i, p in enumerate(PROMPTS, 1):
        # png mı jpg mı — floral-corner'lar PNG (sonra alpha cut), diğerleri JPG
        ext = "png" if "floral-corner" in p["filename"] else "jpg"
        dest = OUT / f"{p['filename']}.{ext}"
        if dest.exists() and dest.stat().st_size > 80_000:
            print(f"[{i}/{len(PROMPTS)}] {dest.name} — cached, skip")
            continue
        print(f"\n[{i}/{len(PROMPTS)}] {dest.name} → submit")
        payload = {
            "prompt": p["prompt"],
            "aspect_ratio": p["aspect_ratio"],
            "raw": True,
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
            print(f"  ✓ {dest.name} ({kb} kB)")
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            continue
    print(
        "\nDone.\n"
        "Sırada (sadece floral-corner-* için):\n"
        "  python3 scripts/transparent-bg.py public/olea/floral-corner-tl.png\n"
        "  python3 scripts/transparent-bg.py public/olea/floral-corner-br.png\n"
    )


if __name__ == "__main__":
    main()
