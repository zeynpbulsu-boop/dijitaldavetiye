"""
FAZ 5.11.2 — PNG beyaz BG → gerçek alpha transparency.

Fal.ai çıktısı "pure white" iddiasında ama PNG anti-aliasing ile
#FAFAFA-#FEFEFE arası gri-beyaz pixel'ler bırakıyor. background-blend-mode
multiply bunları tam silmiyor → hafif kare çerçeve görünüyor.

Çözüm: Pillow ile flood-fill yapıp white-similar pixel'leri alpha=0 yap.
"""

import sys
from pathlib import Path
from PIL import Image

# Beyaza yakınlık eşiği (255-0 sebepsiz tolerans)
THRESHOLD = 232  # 232+'lık R, G, B → transparent yap


def make_transparent(in_path: Path, out_path: Path):
    img = Image.open(in_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size
    print(f"  {in_path.name} → {w}×{h}", flush=True)

    n_made_transparent = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= THRESHOLD and g >= THRESHOLD and b >= THRESHOLD:
                # Yumuşak transparency — ne kadar parlaksa o kadar saydam
                brightness = (r + g + b) / 3
                # 232 → ~50% alpha, 255 → 0% alpha
                if brightness >= 250:
                    new_a = 0
                else:
                    # Eşik üstü ama tam beyaz değil → orantılı solma
                    new_a = int((250 - brightness) / 18 * 255)
                pixels[x, y] = (r, g, b, new_a)
                if new_a == 0:
                    n_made_transparent += 1

    print(f"  {n_made_transparent} pixel made fully transparent", flush=True)
    img.save(out_path, "PNG", optimize=True)
    print(f"  saved {out_path} ({out_path.stat().st_size // 1024} KB)", flush=True)


def main():
    pub = Path(__file__).resolve().parent.parent / "public" / "aethel"
    for name in ["wax-seal-luxe.png", "chapel-vignette.png"]:
        src = pub / name
        if not src.exists():
            print(f"skip — {src} not found", flush=True)
            continue
        # Backup original
        backup = pub / f"_orig-{name}"
        if not backup.exists():
            import shutil
            shutil.copy2(src, backup)
            print(f"  backup → {backup.name}", flush=True)
        make_transparent(backup, src)


if __name__ == "__main__":
    main()
