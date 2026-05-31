/**
 * Markalı sayfa yükleme iskeleti — Supabase fetch yapan route'larda
 * (/i, /admin, /editor) boş ekran yerine gösterilir.
 *
 * Sunucu bileşeni (state yok). `animate-pulse` Tailwind built-in'i;
 * globals.css'teki prefers-reduced-motion nuclear guard (satır ~144)
 * tüm animasyonları durdurduğu için a11y-safe — ekstra koşul gerekmez.
 */
export function PageLoading({
  label = "Yükleniyor",
}: {
  label?: string;
}) {
  return (
    <main
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-bg"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <span
        className="animate-pulse font-display text-brand-ink/85"
        style={{
          fontSize: "32px",
          letterSpacing: "0.42em",
          paddingLeft: "0.42em",
        }}
      >
        NUVE
      </span>

      <span className="flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-cognac"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </span>

      <span className="text-[10px] uppercase tracking-[0.32em] text-brand-mute">
        {label}
      </span>
    </main>
  );
}
