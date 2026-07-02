"use client";

/**
 * EditorPreviewSticky — sticky live preview iframe.
 *
 * Editor sayfasının yanında /i/<slug> davetiyesini iframe ile gösterir.
 * Auto-refresh (10s) form save'leriyle senkron olmak için. Manuel
 * "Yenile" butonu da var.
 *
 * Mobile'da gizlenir (sticky preview ekran yer kaplar) — kullanıcı
 * yine "Yayındaki sayfayı önizle ↗" linki ile yeni sekme açabilir.
 */

import { useCallback, useEffect, useState } from "react";

interface Props {
  slug: string;
  /** Editör erişim token'ı — davetiye henüz live olmadan (paid/incelemede)
   *  /i/[slug] token'sız istekte notFound döndüğü için iframe'e de eklenir. */
  token?: string;
  /** Auto-refresh interval ms. Default: 12000 (12s, save debounce'tan sonra). */
  refreshIntervalMs?: number;
}

export function EditorPreviewSticky({ slug, token, refreshIntervalMs = 12000 }: Props) {
  const previewUrl = token ? `/i/${slug}?token=${encodeURIComponent(token)}` : `/i/${slug}`;
  const [key, setKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    setLoaded(false);
    setKey((k) => k + 1);
  }, []);

  // Auto-refresh on interval
  useEffect(() => {
    const id = window.setInterval(refresh, refreshIntervalMs);
    return () => window.clearInterval(id);
  }, [refresh, refreshIntervalMs]);

  // Refresh when window regains focus (kullanıcı tab değiştirip döndüğünde)
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
            — Canlı önizleme
          </span>
          <button
            type="button"
            onClick={refresh}
            data-cursor="open"
            data-cursor-label="Yenile"
            aria-label="Önizlemeyi yenile"
            className="text-[10px] uppercase tracking-[0.22em] text-brand-mute transition hover:text-brand-cognac"
          >
            Yenile ↻
          </button>
        </div>

        <div
          className="relative overflow-hidden rounded-[12px] border border-brand-ink/12 bg-paper shadow-[0_12px_40px_-16px_rgba(43,30,22,0.18)]"
          style={{ aspectRatio: "9 / 19.5" }}
        >
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/70">
              <span
                className="text-[10px] uppercase tracking-[0.28em] text-brand-mute"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                yükleniyor…
              </span>
            </div>
          )}
          <iframe
            key={key}
            src={previewUrl}
            title="Davetiye önizlemesi"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="h-full w-full"
            style={{
              border: 0,
              transform: "scale(0.86)",
              transformOrigin: "top left",
              width: `${100 / 0.86}%`,
              height: `${100 / 0.86}%`,
            }}
          />
        </div>

        <p className="mt-3 text-[10.5px] leading-[1.55] text-brand-mute">
          Her kayıt sonrası ~12sn&apos;de otomatik yenilenir. Tam ekran için{" "}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener"
            className="underline-offset-2 hover:underline"
          >
            yeni sekmede aç ↗
          </a>
          .
        </p>
      </div>
    </aside>
  );
}
