"""
PR #24 — Replace cover.jpg with Swan Lake quality variant.

Önceki cover.jpg → public/<edition>/_orig-pre-swan.jpg arşivle.
Yeni cover-swan.png → 1600px JPEG q88 → cover.jpg
Orijinal cover-swan.png → _orig-cover-swan.png arşivle.
"""

from pathlib import Path
from PIL import Image

OUT_BASE = Path(__file__).resolve().parent.parent / "public"
EDITIONS = ["aethel", "atelier-indigo", "mansion-lights", "bodrum-blue", "olive-grove", "aurora"]
MAX_WIDTH = 1600
QUALITY = 88


def main():
    for ed in EDITIONS:
        d = OUT_BASE / ed
        src = d / "cover-swan.png"
        if not src.exists():
            print(f"  skip {ed} (no cover-swan.png)", flush=True)
            continue

        # Archive previous cover.jpg
        prev = d / "cover.jpg"
        if prev.exists():
            prev.rename(d / "_orig-pre-swan.jpg")

        # Optimize swan PNG → new cover.jpg
        dst = d / "cover.jpg"
        img = Image.open(src).convert("RGB")
        w, h = img.size
        if w > MAX_WIDTH:
            ratio = MAX_WIDTH / w
            img = img.resize((MAX_WIDTH, int(h * ratio)), Image.LANCZOS)
        img.save(dst, format="JPEG", quality=QUALITY, optimize=True, progressive=True)

        # Archive original swan PNG
        src.rename(d / "_orig-cover-swan.png")

        new_kb = dst.stat().st_size // 1024
        print(f"  ✓ {ed}: → cover.jpg {new_kb}KB ({img.size[0]}x{img.size[1]})", flush=True)


if __name__ == "__main__":
    main()
