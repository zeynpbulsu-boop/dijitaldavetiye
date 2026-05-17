"use client";

/**
 * PrivateDashboard — landing'de "Private Admin Panel" mockup'ı
 * (Pressed Love + TDI paritesi). Sol tarafta mock dashboard kart,
 * sağda dört bullet point açıklama.
 *
 * Mock veri statik — admin panel ekran görüntüsü olarak iş görür.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MOCK_GUESTS = [
  { name: "Berke Bulsu", note: "Vegan", status: "Geliyor" },
  { name: "Selin Yılmaz", note: "Glutensiz", status: "Geliyor" },
  { name: "Mehmet Aslan", note: "", status: "Geliyor" },
  { name: "Aile · Kaya", note: "Fıstık alerjisi", status: "Belki" },
  { name: "Lara & Eren", note: "+1 Eren", status: "Geliyor" },
];

const FEATURES = [
  {
    title: "Gerçek zamanlı RSVP",
    body: "Yanıtlar geldikçe panel otomatik güncellenir, push gerek yok.",
  },
  {
    title: "Alerji + menü tercihi",
    body: "Her davetli için ayrı kolon — mekan ekibine direkt link gönder.",
  },
  {
    title: "Net istatistikler",
    body: "Onaylı / bekleyen / gelmeyen sayıları + +1 toplamı tek bakışta.",
  },
  {
    title: "Excel indirme",
    body: "Tüm liste tek tıkla CSV — düğün planlayıcısıyla paylaş.",
  },
];

export function PrivateDashboard() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      className="relative border-b border-line bg-paper py-24 lg:py-36"
    >
      <div className="container-wide max-w-[1280px]">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr,1fr] lg:gap-20">
          {/* SOL — mock dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="rounded-md border border-brand-ink/12 bg-bg-alt p-5 shadow-ed-lg sm:p-7">
              <header className="flex items-end justify-between border-b border-brand-ink/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-brand-mute">
                    Admin Paneli
                  </span>
                  <p className="font-display text-[18px] text-brand-ink">
                    nuve.app/admin/defne-aras
                  </p>
                </div>
                <span className="rounded-full bg-brand-cognac/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-cognac">
                  Canlı
                </span>
              </header>

              <ul className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                <li className="rounded-md border border-brand-cognac/30 bg-brand-cognac/8 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-brand-mute">
                    Onaylı
                  </div>
                  <div className="mt-1 font-display text-[28px] text-brand-cognac">
                    67
                  </div>
                </li>
                <li className="rounded-md border border-brand-ink/12 bg-paper px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-brand-mute">
                    Bekleyen
                  </div>
                  <div className="mt-1 font-display text-[28px] text-brand-ink">
                    14
                  </div>
                </li>
                <li className="rounded-md border border-brand-ink/12 bg-paper px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-brand-mute">
                    Gelmeyen
                  </div>
                  <div className="mt-1 font-display text-[28px] text-brand-ink/60">
                    4
                  </div>
                </li>
              </ul>

              <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-brand-mute">
                <span>Davetli listesi · 85 toplam</span>
                <button
                  type="button"
                  className="rounded-full border border-brand-ink/22 px-3 py-1 text-brand-ink"
                >
                  Excel&apos;e indir ↓
                </button>
              </div>

              <ul className="mt-3 divide-y divide-brand-ink/8">
                {MOCK_GUESTS.map((g) => (
                  <li
                    key={g.name}
                    className="flex items-center justify-between gap-3 py-2.5 text-[13px]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-ink/8 text-[10px] font-medium text-brand-ink"
                      >
                        {g.name
                          .split(/[\s·&]/)
                          .filter(Boolean)
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-brand-ink">{g.name}</p>
                        {g.note && (
                          <p className="text-[10px] uppercase tracking-[0.18em] text-brand-mute">
                            {g.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
                        g.status === "Geliyor"
                          ? "bg-brand-cognac/10 text-brand-cognac"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {g.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* SAĞ — açıklama */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — Özel Yönetici Paneli
            </span>
            <h2
              className="mt-3 font-display text-brand-ink"
              style={{
                fontSize: "clamp(32px, 4.5vw, 56px)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
              }}
            >
              Her şey kontrolün altında,{" "}
              <span className="italic text-brand-cognac">tek bir yerde</span>.
            </h2>
            <p className="mt-4 max-w-[480px] text-[15px] leading-[1.7] text-brand-mute">
              Her davetiyenin arkasında özel bir yönetim paneli — RSVP&apos;ler,
              diyet tercihleri, alerjiler, +1 sayısı, hepsi anında.
            </p>

            <ul className="mt-8 space-y-5">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-cognac/15 text-[11px] text-brand-cognac"
                  >
                    ✓
                  </span>
                  <div>
                    <p className="font-display text-[18px] text-brand-ink">
                      {f.title}
                    </p>
                    <p className="mt-0.5 text-[14px] leading-[1.55] text-brand-mute">
                      {f.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
