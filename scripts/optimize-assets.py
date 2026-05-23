#!/usr/bin/env python3
"""
optimize-assets.py — production asset compression

Tüm public/<edition>/*.{png,jpg} (orijinal _orig-* HARİÇ) dosyalarını
yerinde küçültür. Hedef: 8MB → 200-400KB (40× azalma).

İki çıktı:
  1. Aynı dosya adı (.png) — quantize + resize (kod referansları değişmez)
  2. .webp varyantı (~3× daha küçük) — Next/Image runtime'da seçer

Kullanım:
  python3 scripts/optimize-assets.py
  python3 scripts/optimize-assets.py --dry-run   # sadece raporla
  python3 scripts/optimize-assets.py --max 768   # daha agresif boyut
"""

import argparse
import sys
from pathlib import Path
from PIL import Image

DEFAULT_MAX_SIZE = 1024
PNG_PATTERNS = ["watermark.png", "wax-seal.png", "wax-seal-luxe.png", "chapel-vignette.png"]
JPG_PATTERNS = ["cover.jpg"]

def fmt_size(n: int) -> str:
    if n >= 1_000_000:
        return f"{n/1_000_000:.1f}MB"
    if n >= 1_000:
        return f"{n//1_000}kB"
    return f"{n}B"

def optimize_png(path: Path, max_size: int, dry_run: bool) -> tuple[int, int, int]:
    """Returns (orig_size, new_png_size, webp_size)."""
    if path.name.startswith("_orig-"):
        return (0, 0, 0)

    orig_size = path.stat().st_size
    img = Image.open(path)
    has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
    img = img.convert("RGBA" if has_alpha else "RGB")

    if max(img.size) > max_size:
        img.thumbnail((max_size, max_size), Image.LANCZOS)

    # Quantize PNG to 256 colors (preserves alpha)
    try:
        png_img = img.quantize(colors=256, method=Image.Quantize.LIBIMAGEQUANT, kmeans=0)
    except Exception:
        png_img = img.quantize(colors=256)

    webp_path = path.with_suffix(".webp")

    new_png_size = 0
    webp_size = 0
    if not dry_run:
        png_img.save(path, "PNG", optimize=True)
        new_png_size = path.stat().st_size

        webp_kwargs = {"quality": 82, "method": 6}
        if has_alpha:
            img.save(webp_path, "WEBP", **webp_kwargs)
        else:
            img.save(webp_path, "WEBP", **webp_kwargs)
        webp_size = webp_path.stat().st_size
    else:
        new_png_size = orig_size  # placeholder
        webp_size = orig_size

    return orig_size, new_png_size, webp_size


def optimize_jpg(path: Path, max_size: int, dry_run: bool) -> tuple[int, int, int]:
    orig_size = path.stat().st_size
    img = Image.open(path).convert("RGB")
    if max(img.size) > max_size:
        img.thumbnail((max_size, max_size), Image.LANCZOS)

    webp_path = path.with_suffix(".webp")
    new_size = 0
    webp_size = 0
    if not dry_run:
        img.save(path, "JPEG", quality=82, optimize=True, progressive=True)
        new_size = path.stat().st_size
        img.save(webp_path, "WEBP", quality=82, method=6)
        webp_size = webp_path.stat().st_size
    else:
        new_size = orig_size
        webp_size = orig_size

    return orig_size, new_size, webp_size


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--max", type=int, default=DEFAULT_MAX_SIZE)
    ap.add_argument("--root", type=Path, default=Path("public"))
    args = ap.parse_args()

    if not args.root.exists():
        print(f"ERROR: {args.root} not found (run from repo root)", file=sys.stderr)
        return 1

    total_orig = 0
    total_new = 0
    total_webp = 0
    count = 0

    print(f"{'FILE':<60} {'ORIG':>9} → {'PNG':>9} (+webp {'':>7}) saving")
    print("-" * 110)

    for edition_dir in sorted(args.root.iterdir()):
        if not edition_dir.is_dir():
            continue
        for pattern in PNG_PATTERNS:
            for f in edition_dir.glob(pattern):
                orig, new, webp = optimize_png(f, args.max, args.dry_run)
                if orig == 0:
                    continue
                total_orig += orig
                total_new += new
                total_webp += webp
                count += 1
                ratio = orig / max(new, 1)
                webp_ratio = orig / max(webp, 1)
                print(f"{str(f):<60} {fmt_size(orig):>9} → {fmt_size(new):>9} (webp {fmt_size(webp):>7}) {ratio:.1f}x / webp {webp_ratio:.1f}x")
        for pattern in JPG_PATTERNS:
            for f in edition_dir.glob(pattern):
                orig, new, webp = optimize_jpg(f, args.max, args.dry_run)
                if orig == 0:
                    continue
                total_orig += orig
                total_new += new
                total_webp += webp
                count += 1
                ratio = orig / max(new, 1)
                webp_ratio = orig / max(webp, 1)
                print(f"{str(f):<60} {fmt_size(orig):>9} → {fmt_size(new):>9} (webp {fmt_size(webp):>7}) {ratio:.1f}x / webp {webp_ratio:.1f}x")

    print("-" * 110)
    print(f"TOTAL ({count} files): {fmt_size(total_orig)} → {fmt_size(total_new)} (webp {fmt_size(total_webp)})")
    if total_orig:
        print(f"PNG saving:  {(1 - total_new/total_orig) * 100:.1f}%")
        print(f"WebP saving: {(1 - total_webp/total_orig) * 100:.1f}%")
    if args.dry_run:
        print("\n(dry-run, no files written)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
