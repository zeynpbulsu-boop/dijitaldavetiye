#!/usr/bin/env python3
"""themes-v2 PNG → WebP optimizer.

Wedding davetiyeleri çoğunlukla mobilde, sıklıkla hücresel veriyle açılır.
Aktif themes-v2 görselleri toplam ~84MB PNG — tema sayfası başına 8-15MB.
Bu script hepsini, kullanım bağlamına göre boyutlandırıp WebP'ye çevirir
(alpha korunur). Tipik kazanç 8-12×.

Kurallar (dosya adına göre):
  wax-seal      → max 512px, q90 (odak premium öğe, alpha)
  thumbs/       → max 820px, q82 (carousel kartı 3:4 @380px, retina 2×)
  scene/sketch  → max 1400px, q84 (fotoğrafik içerik)
  diğer (doku)  → max 1920px, q80 (full-bleed arka plan/yıkama)

png dosyaları silinmez — referans güncelleme + build doğrulamasından sonra
ayrı adımda git rm edilir (geri alınabilir).
"""
import glob
import os
from PIL import Image

ROOT = "public/themes-v2"


def rule(path: str):
    # Görsel doğrulama yapılamadığı için (premium ürün) kaliteyi güvenli
    # tarafta tutuyoruz: düz gradyanlarda banding'i önlemek için q88+,
    # odak öğelerde (mühür) q92. Yine de ~9× kazanç kalıyor.
    name = os.path.basename(path).lower()
    if "wax-seal" in name:
        return 512, 92
    if "/thumbs/" in path:
        return 1024, 86  # 1004px native korunur → 380px kartta 2× retina
    if "scene" in name or "sketch" in name or "landscape" in name:
        return 1400, 88
    return 1920, 88


def main() -> None:
    files = sorted(glob.glob(f"{ROOT}/**/*.png", recursive=True))
    old_total = 0.0
    new_total = 0.0
    print(f"{len(files)} png dönüştürülüyor…\n")
    for f in files:
        cap, q = rule(f)
        im = Image.open(f)
        w, h = im.size
        has_alpha = im.mode in ("RGBA", "LA") or (
            im.mode == "P" and "transparency" in im.info
        )
        im = im.convert("RGBA" if has_alpha else "RGB")
        # En uzun kenar cap'i aşıyorsa orantılı küçült.
        longest = max(w, h)
        if longest > cap:
            scale = cap / longest
            im = im.resize(
                (round(w * scale), round(h * scale)), Image.LANCZOS
            )
        out = f[:-4] + ".webp"
        save_kw = {"quality": q, "method": 6}
        if has_alpha:
            save_kw["exact"] = True  # alpha kenarlarını koru
        im.save(out, "WEBP", **save_kw)
        old_kb = os.path.getsize(f) / 1024
        new_kb = os.path.getsize(out) / 1024
        old_total += old_kb
        new_total += new_kb
        rel = f.replace("public/themes-v2/", "")
        print(
            f"  {rel:38} {w}x{h}→{im.size[0]}x{im.size[1]}  "
            f"{old_kb:6.0f}KB → {new_kb:6.0f}KB  ({old_kb / new_kb:.1f}×)"
        )
    print(
        f"\nTOPLAM: {old_total / 1024:.1f}MB → {new_total / 1024:.1f}MB  "
        f"({old_total / new_total:.1f}× küçülme, "
        f"{(old_total - new_total) / 1024:.1f}MB tasarruf)"
    )


if __name__ == "__main__":
    main()
