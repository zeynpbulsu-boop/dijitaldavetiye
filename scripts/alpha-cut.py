"""
alpha-cut.py — Generic PNG white BG → transparent alpha.

Usage:
  python3 scripts/alpha-cut.py <path1> [path2] ...

Pillow ile threshold-based flood. 232+ R/G/B → progressive alpha
(250+ tam transparent, 232-249 arası orantılı solma).

Edit in-place, backup'ı `_orig-<name>` olarak kaydeder.
"""

import shutil
import sys
from pathlib import Path
from PIL import Image

THRESHOLD = 232


def make_transparent(in_path: Path, out_path: Path) -> int:
    img = Image.open(in_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size
    n_clear = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= THRESHOLD and g >= THRESHOLD and b >= THRESHOLD:
                brightness = (r + g + b) / 3
                if brightness >= 250:
                    new_a = 0
                else:
                    new_a = int((250 - brightness) / 18 * 255)
                pixels[x, y] = (r, g, b, new_a)
                if new_a == 0:
                    n_clear += 1
    img.save(out_path, "PNG", optimize=True)
    return n_clear


def main(paths):
    if not paths:
        print("Usage: alpha-cut.py <path1> [path2] ...")
        sys.exit(1)
    for raw in paths:
        p = Path(raw)
        if not p.exists():
            print(f"skip — {p} not found", flush=True)
            continue
        backup = p.parent / f"_orig-{p.name}"
        if not backup.exists():
            shutil.copy2(p, backup)
            print(f"  backup → {backup.name}", flush=True)
        n = make_transparent(backup, p)
        kb = p.stat().st_size // 1024
        print(f"  ✓ {p.name} — {n} transparent px, {kb} kB", flush=True)


if __name__ == "__main__":
    main(sys.argv[1:])
