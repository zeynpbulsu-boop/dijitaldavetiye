"""
FAZ 5.12 — 5 editions × 2 PNG için batch white-bg → alpha transparency.
"""

from pathlib import Path
from PIL import Image
import shutil

THRESHOLD = 232

EDITIONS = ["atelier-indigo", "mansion-lights", "bodrum-blue", "olive-grove", "aurora"]
NAMES = ["watermark", "wax-seal"]


def make_transparent(in_path: Path, out_path: Path):
    img = Image.open(in_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size
    print(f"  {in_path.parent.name}/{in_path.name} → {w}×{h}", flush=True)
    cleared = 0
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
                    cleared += 1
    print(f"    {cleared} → transparent", flush=True)
    img.save(out_path, "PNG", optimize=True)


def main():
    base = Path(__file__).resolve().parent.parent / "public"
    for ed in EDITIONS:
        d = base / ed
        for n in NAMES:
            src = d / f"{n}.png"
            if not src.exists():
                print(f"skip {ed}/{n} — missing", flush=True)
                continue
            backup = d / f"_orig-{n}.png"
            if not backup.exists():
                shutil.copy2(src, backup)
            make_transparent(backup, src)


if __name__ == "__main__":
    main()
