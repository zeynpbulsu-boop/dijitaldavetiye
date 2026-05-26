/**
 * CuteSectionLabel — Etsy 2026 trend.
 *
 * "the day", "the details", "kindly RSVP", "with love" tarzı kısa
 * calligraphic section başlığı. Üstte ve altta ince horizontal
 * hairline + center label. Editorial caps eyebrow yerine kullanılır.
 *
 * Tipografi: var(--font-calligraphy) (Pinyon Script).
 */

interface Props {
  text: string;
  /** Sub-label (örn "08.08.2026"). Boşsa gizlenir. */
  sub?: string;
  ink?: string;
  inkSoft?: string;
  accent?: string;
  className?: string;
}

export function CuteSectionLabel({
  text,
  sub,
  ink = "#2E3326",
  inkSoft = "#5E6650",
  accent = "#7A8A6E",
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <span
          aria-hidden
          className="block h-px w-10 sm:w-16"
          style={{ background: accent, opacity: 0.65 }}
        />
        <h2
          className="px-1 italic"
          style={{
            color: ink,
            fontFamily: "var(--font-calligraphy), 'Pinyon Script', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1,
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          {text}
        </h2>
        <span
          aria-hidden
          className="block h-px w-10 sm:w-16"
          style={{ background: accent, opacity: 0.65 }}
        />
      </div>
      {sub && (
        <p
          className="mt-3 text-[10px] uppercase sm:text-[11px]"
          style={{
            color: inkSoft,
            letterSpacing: "0.42em",
            fontWeight: 400,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
