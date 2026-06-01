/**
 * WCAG kontrast yardımcıları — tema accent dolguları üstüne okunabilir
 * (AA-geçen) metin rengi seçmek için. Palette renkleri DEĞİŞMEZ; yalnızca
 * accent üstündeki metin koyu/açık olarak hesaplanır. Yeni temalar da
 * otomatik kapsanır (sabit token gerekmez).
 */

/** #RRGGBB → 0..1 göreli parlaklık (WCAG 2.1 relative luminance). */
export function relativeLuminance(hex: string): number {
  let m = hex.replace("#", "").trim();
  // 3-haneli (#abc) → 6-haneli (#aabbcc) genişlet — NaN'i önler.
  if (m.length === 3) m = m[0] + m[0] + m[1] + m[1] + m[2] + m[2];
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** İki renk arasındaki WCAG kontrast oranı (1..21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

const DARK_INK = "#16110B";
const LIGHT = "#FFFFFF";

/**
 * `bg` (genelde tema accent'i) dolgusu üstünde en yüksek kontrastlı metin
 * rengini döndürür (koyu mürekkep vs beyaz). 7 temada da AA (>=4.5) geçer.
 */
export function bestTextOn(bg: string): string {
  return contrastRatio(bg, DARK_INK) >= contrastRatio(bg, LIGHT)
    ? DARK_INK
    : LIGHT;
}
