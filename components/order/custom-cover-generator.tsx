"use client";

/**
 * CustomCoverGenerator — order/[slug] içinde Premium add-on.
 *
 * Müşteri kendi venue + atmosfer prompt'u girer, fal.ai Recraft v3 ile
 * per-couple custom cover üretilir (POST /api/custom-cover).
 *
 * Akış:
 *   1. Müşteri textarea'ya prompt yazar
 *      ("ailemizin köy evi, bahçede zeytin ağacı, iki kedi, golden hour")
 *   2. "Özel Cover Oluştur" tıklar → loading (8-15s)
 *   3. Result image preview gözükür
 *   4. "Beğenmedim, tekrar üret" veya "Bu cover'ı kullan"
 *   5. Kullan: onSaved(url) çağrılır, parent state'e custom_cover_url yazılır
 */

import { useState } from "react";
import Image from "next/image";

interface Props {
  edition: string; // "aethel" | "nocturne" | ...
  /** Mevcut custom cover URL — daha önce üretildiyse */
  initialUrl?: string | null;
  /** Yeni cover seçilince çağrılır (parent state + persist). */
  onSaved: (url: string | null) => void;
}

const EXAMPLE_PROMPTS = [
  "Aile mülkümüz Alaçatı'da zeytin bahçesinin içinde küçük taş ev, sabah esintisinde silver leaves, iki tabby kedi yürüyor",
  "Çırağan'da gece, mum ışığında uzun yemek masası, kristal kadehler, kırmızı gül yaprakları, antika gümüş",
  "Bodrum Türkbükü'nde iskele ucunda gün batımı, beyaz yelkenli yaklaşıyor, bougainvillea kemerinde durduğumuzu hayal et",
];

export function CustomCoverGenerator({ edition, initialUrl, onSaved }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(initialUrl ?? null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (prompt.trim().length < 8) {
      setError("En az 8 karakter yaz — sahneni anlat.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/custom-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, edition }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Asset üretimi başarısız.");
        return;
      }
      setGeneratedUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  const useThisCover = () => {
    if (generatedUrl) onSaved(generatedUrl);
  };

  const removeCover = () => {
    setGeneratedUrl(null);
    onSaved(null);
  };

  return (
    <div className="rounded-[12px] border border-brand-cognac/35 bg-brand-cognac/5 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3
          className="font-display italic text-brand-ink"
          style={{ fontSize: "clamp(18px, 2.6vw, 22px)", lineHeight: 1.2 }}
        >
          Özel Kapak{" "}
          <span className="text-brand-cognac" style={{ fontSize: "0.8em" }}>
            · Premium
          </span>
        </h3>
        <span
          className="text-[10px] uppercase tracking-[0.28em] text-brand-cognac"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          ✨ AI
        </span>
      </div>

      <p className="mt-3 text-[13px] leading-[1.65] text-brand-ink/75">
        Mekânını, atmosferini, küçük detayları (kedi, çiçek, sandalye, ışık) yaz —
        senin için özgün bir kapak üretelim. TheDigitalInvite &euro;575&apos;a manuel
        illüstratör yaptırıyor; biz <strong>~15 saniyede</strong> AI ile yapıp{" "}
        <strong>sınırsız varyant</strong> sunuyoruz.
      </p>

      {/* Generated preview */}
      {generatedUrl && (
        <div className="mt-5">
          <div
            className="relative w-full overflow-hidden rounded-[8px] border border-brand-ink/12"
            style={{ aspectRatio: "9 / 16" }}
          >
            <Image
              src={generatedUrl}
              alt="Özel kapak önizlemesi"
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              style={{ objectFit: "cover" }}
              unoptimized // fal.ai CDN dış kaynak
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={useThisCover}
              data-cursor="magnetic"
              data-cursor-label="Kullan"
              className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-brand-cognac px-5 text-[11px] uppercase tracking-[0.22em] text-brand-cream transition hover:tracking-[0.28em]"
            >
              Bu kapağı kullan
            </button>
            <button
              type="button"
              onClick={() => setGeneratedUrl(null)}
              className="inline-flex min-h-[40px] items-center justify-center text-[11px] uppercase tracking-[0.22em] text-brand-mute transition hover:text-brand-cognac"
            >
              Tekrar üret
            </button>
            <button
              type="button"
              onClick={removeCover}
              className="ml-auto inline-flex min-h-[40px] items-center justify-center text-[11px] uppercase tracking-[0.22em] text-brand-mute/70 transition hover:text-red-700"
            >
              Kaldır
            </button>
          </div>
        </div>
      )}

      {/* Prompt input */}
      {!generatedUrl && (
        <>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            maxLength={800}
            placeholder={EXAMPLE_PROMPTS[0]}
            className="mt-5 w-full resize-y rounded-[6px] border border-brand-ink/20 bg-paper px-3.5 py-3 font-[var(--font-sans)] text-[14px] leading-[1.6] text-brand-ink transition focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/20 placeholder:text-brand-mute/55"
          />

          {/* Example chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[10px] uppercase tracking-[0.24em] text-brand-mute">
              Örnek:
            </span>
            {EXAMPLE_PROMPTS.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(ex)}
                className="text-[10px] uppercase tracking-[0.18em] text-brand-cognac/85 underline-offset-2 transition hover:underline"
              >
                {i + 1}.
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={loading || prompt.trim().length < 8}
            data-cursor="magnetic"
            data-cursor-label={loading ? "Üretiliyor" : "Üret"}
            className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-ink px-7 text-[12px] uppercase tracking-[0.24em] text-bg transition-all hover:tracking-[0.3em] disabled:opacity-50"
          >
            {loading ? (
              <>
                <span
                  className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-bg/60 border-t-bg"
                  aria-hidden
                />
                <span>~15 saniye, bekle…</span>
              </>
            ) : (
              <>
                <span aria-hidden>✦</span>
                <span>Özel kapak oluştur</span>
              </>
            )}
          </button>
        </>
      )}

      {error && (
        <p
          className="mt-3 text-[12px]"
          style={{ color: "#b03b3b", lineHeight: 1.5 }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
