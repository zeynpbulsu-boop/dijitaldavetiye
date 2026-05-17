"use client";

/**
 * HowItWorks — 3 adım B2C clean (Pressed Love + TDI paritesi).
 *
 * Önceki 4-step i18n-bound bir grid'di. Kullanıcı geri bildirimi:
 * "rakiplerin landing'i gibi olsun" — 3 adım, basit numara + başlık
 * + kısa açıklama.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    n: "01",
    title: "Tasarımını seç",
    body: "6 lüks koleksiyondan dilediğinle başla — Aethel, Atelier Indigo, Aurora, Bodrum Blue, Mansion Lights, Olive Grove. Hepsi 48 saatte yayında.",
  },
  {
    n: "02",
    title: "Detaylarını doldur",
    body: "İsimler, tarih, mekan, müzik, fotoğraflar, hediye/IBAN, otel önerileri, davetli listesi — hepsini editör panelinden yönet.",
  },
  {
    n: "03",
    title: "Linki paylaş",
    body: "Tek bir bağlantı: WhatsApp, Instagram, SMS — anında. Yanıtlar gerçek zamanlı panelinde toplanır, Excel'e indir.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="relative border-b border-line bg-bg-alt/40 py-24 lg:py-32"
    >
      <div className="container-wide max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center sm:mb-20"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
            — Basit Süreç
          </span>
          <h2
            className="mt-4 font-display text-brand-ink"
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
            }}
          >
            Nasıl Çalışır
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-[1.7] text-brand-mute">
            Üç adımda yayında. Hesap açmaya, ödeme yapmaya gerek yok —
            tasarlamak ücretsiz. Yalnızca yayına almak için tek seferlik
            ödeme.
          </p>
        </motion.div>

        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.2 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex flex-col"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-brand-ink/15 bg-paper text-[18px] font-display text-brand-cognac">
                {step.n}
              </div>
              <h3
                className="font-display text-brand-ink"
                style={{
                  fontSize: "clamp(22px, 2.4vw, 28px)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.018em",
                }}
              >
                {step.title}
              </h3>
              <p
                className="mt-3 max-w-[360px] text-brand-ink/70"
                style={{ fontSize: "15px", lineHeight: 1.65 }}
              >
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
