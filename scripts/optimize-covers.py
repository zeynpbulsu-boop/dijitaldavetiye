"""
PR #17 — Optimize 6 cover PNG'leri (5-8 MB → ~700 KB).

Fal.ai çıktıları 4096px wide ~7MB PNG. Mobile için felaket.
Pillow ile 1600px wide'a downscale + JPEG 88 quality.
Next/Image otomatik AVIF/WebP variant üretir, ama kaynak JPEG
olsun ki orijinal de küçük kalsın.
"""

from pathlib import Path
from PIL import Image

OUT_BASE = Path(__file__).resolve().parent.parent / "public"
EDITIONS = ["aethel", "atelier-indigo", "mansion-lights", "bodrum-blue", "olive-grove", "aurora"]
MAX_WIDTH = 1600
QUALITY = 88


def main():
    for ed in EDITIONS:
        src = OUT_BASE / ed / "cover.png"
        if not src.exists():
            print(f"  skip {ed} (no cover.png)", flush=True)
            continue

        dst_jpg = OUT_BASE / ed / "cover.jpg"
        img = Image.open(src).convert("RGB")
        w, h = img.size
        if w > MAX_WIDTH:
            ratio = MAX_WIDTH / w
            new_size = (MAX_WIDTH, int(h * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        img.save(dst_jpg, format="JPEG", quality=QUALITY, optimize=True, progressive=True)
        orig_kb = src.stat().st_size // 1024
        new_kb = dst_jpg.stat().st_size // 1024
        print(f"  ✓ {ed}: {orig_kb}KB → {new_kb}KB ({img.size[0]}x{img.size[1]})", flush=True)

        # Keep raw PNG for archive
        archive = OUT_BASE / ed / "_orig-cover.png"
        src.rename(archive)


if __name__ == "__main__":
    main()
