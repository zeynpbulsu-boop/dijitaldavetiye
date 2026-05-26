/**
 * HeartIconRow — Etsy 2026 trend.
 *
 * 4 farklı renkte mini kalp + altta açıklama. "Dress code" gibi
 * section'larda kullanılır; palet ipucu vermek için bir mood-row.
 *
 * Default renkler: gold / sage / cream / dusty-pink (olive-green
 * wedding paletine uygun).
 */

interface HeartIconRowProps {
  /** İsteğe bağlı palet override. 4 hex değeri. */
  colors?: [string, string, string, string];
  /** Üst eyebrow başlık (örn "Dress Code"). Boşsa gizlenir. */
  label?: string;
  /** Tek satır alt açıklama. */
  description?: string;
  /** Tipografik ana renk. */
  ink?: string;
  /** Soft ink (label + description). */
  inkSoft?: string;
}

export function HeartIconRow({
  colors = ["#C4A85E", "#7A8A6E", "#F2EBD8", "#D4A4A0"],
  label,
  description,
  ink = "#2E3326",
  inkSoft = "#5E6650",
}: HeartIconRowProps) {
  return (
    <div className="mx-auto flex max-w-[480px] flex-col items-center">
      {label && (
        <p
          className="mb-3 text-[11px] uppercase"
          style={{
            color: inkSoft,
            letterSpacing: "0.32em",
            fontWeight: 400,
          }}
        >
          {label}
        </p>
      )}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {colors.map((c, i) => (
          <svg
            key={i}
            width="22"
            height="20"
            viewBox="0 0 22 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            style={{ filter: `drop-shadow(0 1px 1px ${c}55)` }}
          >
            <path
              d="M11 18.5C11 18.5 1 12.5 1 6.5C1 3.5 3.5 1 6.5 1C8.5 1 10 2 11 3.5C12 2 13.5 1 15.5 1C18.5 1 21 3.5 21 6.5C21 12.5 11 18.5 11 18.5Z"
              fill={c}
              stroke={c}
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
      {description && (
        <p
          className="mt-4 px-4 text-center"
          style={{
            color: ink,
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            lineHeight: 1.55,
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
