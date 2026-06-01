import Link from "next/link";

/**
 * not-found.tsx — Next.js 404 fallback (replaces default).
 *
 * Editorial tone, paralel olarak Hero/HowItWorks ile uyumlu. Hem
 * Türkçe hem İngilizce ipucu (yabancı misafirler için).
 */

export const metadata = {
  title: "Bulunamadı — 404",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main" className="min-h-[80vh] bg-bg py-24 lg:py-32">
      <div className="container-narrow text-center">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-cognac">
          — № 404
        </span>

        <h1
          className="mt-7 font-display text-brand-ink"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.025em",
          }}
        >
          Bu davet{" "}
          <span className="italic text-brand-cognac">kayboldu</span>.
        </h1>

        <p
          className="mx-auto mt-7 max-w-[480px] text-brand-ink/70"
          style={{ fontSize: "16.5px", lineHeight: 1.65 }}
        >
          Adres yanlış girilmiş veya bu davetiye artık yayında değil.
          Endişelenme — aşağıdan ya tasarımlara göz at, ya da kendi
          davetiyeni oluşturmaya başla.
        </p>

        <p className="mx-auto mt-3 max-w-[480px] text-[13px] italic text-brand-mute">
          The page you were looking for has either moved or expired.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-cognac px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-cream transition hover:bg-brand-ink"
          >
            Ana sayfa
          </Link>
          <Link
            href="/tasarimlar"
            className="inline-flex items-center gap-2 rounded-full border border-brand-ink/22 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
          >
            Tasarımları gör →
          </Link>
        </div>

        <p className="mt-16 text-[11px] uppercase tracking-[0.28em] text-brand-mute">
          NUVE · An invitation
        </p>
      </div>
    </main>
  );
}
