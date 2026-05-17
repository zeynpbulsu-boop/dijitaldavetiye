"use client";

/**
 * AethelChapelDemo — FAZ 5.11
 *
 * Premium entegrasyon kuralları:
 *   1. Background isolation: Fal.ai PNG'leri (pure white BG) →
 *      mix-blend-mode: multiply ile cream/ivory zemine şeffaf otur.
 *   2. Texture integration: chapel-vignette → tüm sayfada 5-8% opacity
 *      arka plan dokusu olarak yedirilir.
 *   3. Whitespace: Cormorant Garamond Light 300, padding 4-8rem,
 *      incecik border'lar (0.5px), nefes alan tipografi.
 *
 * Story timeline yok. Slot machine interaktif. Editorial monolit cream.
 */

import { motion } from "framer-motion";
import { useState } from "react";
import { AETHEL_CHAPEL } from "@/lib/design/tokens";
import { CalligraphyName } from "@/components/themed/calligraphy-name";
import { ThemedSeparator } from "@/components/themed/themed-separator";
import { LiveRsvpCounter } from "@/components/themed/live-rsvp-counter";
import { MusicWaveformPlayer } from "@/components/themed/music-waveform-player";
import { WaxSealLuxe } from "@/components/themed/wax-seal-luxe";
import { ChapelWatermark } from "@/components/themed/chapel-watermark";
import { EnvelopeCeremony } from "@/components/themed/envelope-ceremony";
import { Lovebirds } from "@/components/ornaments/lovebirds";
import { SlotPicker, slotOptions } from "@/components/inputs/slot-picker";

const T = AETHEL_CHAPEL;

// Cream paleti — dark sage'i bıraktık, editorial monolit cream
const CREAM_BG = "#F2EEE4"; // Hafif daha sıcak cream
const INK = "#2E3326"; // Koyu yosun mürekkep
const INK_SOFT = "#5E6650"; // Açık ink
const INK_MUTED = "#8A9078"; // En açık (eyebrow, divider)
const SAGE = "#7A8A6E"; // Aksan — wax seal halo, ornament

const SCHEDULE = [
  { time: "16:00", title: "Tören · Şapelde", desc: "Sevgiyi taş duvarların arasında mühürleyeceğiz", icon: "bell" },
  { time: "17:30", title: "Aperitivo · Bahçede", desc: "Prosecco, mevsim çiçekleri arasında", icon: "glass" },
  { time: "19:30", title: "Akşam Yemeği · Loggia'da", desc: "Mum ışığında, yıldızların altında", icon: "plate" },
  { time: "22:00", title: "Dans · Sarmaşıkların Altında", desc: "Sabaha kadar bizimle kalın", icon: "star" },
] as const;

const FAQ = [
  { q: "Şapele nasıl ulaşırız?", a: "Köy meydanından 5 dakikalık yürüyüş mesafesinde." },
  { q: "Ne giymeli?", a: "Bahçe-şık. Topuklu yerine alçak topuk veya zarif sandalet öneririz." },
  { q: "Çocuklar gelebilir mi?", a: "Elbette — küçük misafirler için ayrı bir alan ve aktivite planımız var." },
  { q: "Konaklama önerisi?", a: "Köy içinde 3 boutique otel ayırdık." },
];

export function AethelChapelDemo() {
  const [opened, setOpened] = useState(false);
  const [day, setDay] = useState("12");
  const [month, setMonth] = useState("Eylül");
  const [year, setYear] = useState("2026");

  // Themed separator — light cream variant'ı için ad-hoc
  const themeForSep = { ...T, ornamentColor: INK_MUTED, bodyBg: CREAM_BG, bodyInk: INK };

  return (
    <>
      {/* ZARF SEREMONISI — cream zemin, luxe wax seal */}
      {!opened && (
        <EnvelopeCeremony
          greeting="Bir davet sizi bekliyor"
          ctaLabel="Davetiyeyi Aç"
          bgColor={CREAM_BG}
          inkColor={INK}
          haloColor={SAGE}
          onOpened={() => setOpened(true)}
        />
      )}

      {/* AÇILDIKTAN SONRA — editorial monolit cream */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        data-edition="aethel-chapel"
        className="relative min-h-screen overflow-x-hidden"
        style={{
          background: CREAM_BG,
          color: INK,
          fontFamily: "var(--font-display), Georgia, serif",
          fontWeight: 300,
          letterSpacing: "0.018em",
        }}
      >
        {/* Sayfa boyunca chapel watermark (fixed) — gözü yormayan doku */}
        <ChapelWatermark position="fixed" opacity={0.045} maxWidth={1200} bgColor={CREAM_BG} />

        <FloatingControls />

        {/* HERO */}
        <Hero day={day} month={month} year={year} />

        <ThemedSeparator theme={themeForSep} lineLength={100} />

        {/* SLOT MACHINE — interaktif tarih */}
        <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-40">
          <SectionHeader eyebrow="— Tarihi Değiştirin" title="Kendi gününüzü seçin" />
          <p
            className="mx-auto mt-8 max-w-[480px] px-2 text-center text-[13px]"
            style={{ color: INK_SOFT, lineHeight: 1.8, fontWeight: 300 }}
          >
            Slot makinesini çevirin — yukarıdaki tarih anında güncellensin.
            Demo modundadır; gerçek davetiyenizde editörden ayarlarsınız.
          </p>

          <div className="mx-auto mt-12 grid max-w-[560px] grid-cols-3 gap-3 sm:mt-16 sm:gap-8">
            <SlotPicker
              label="Gün"
              options={slotOptions.days}
              value={day}
              onChange={setDay}
              itemHeight={48}
              visibleItems={3}
            />
            <SlotPicker
              label="Ay"
              options={slotOptions.monthsTr}
              value={month}
              onChange={setMonth}
              itemHeight={48}
              visibleItems={3}
            />
            <SlotPicker
              label="Yıl"
              options={slotOptions.yearsNext10}
              value={year}
              onChange={setYear}
              itemHeight={48}
              visibleItems={3}
            />
          </div>
        </section>

        <ThemedSeparator theme={themeForSep} lineLength={100} />

        {/* SCHEDULE */}
        <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-40">
          <SectionHeader eyebrow="— O Günün Akışı" title="Programımız" />
          <ul className="mx-auto mt-12 max-w-[760px] space-y-4 sm:mt-20 sm:space-y-6">
            {SCHEDULE.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 px-4 py-4 sm:gap-8 sm:px-8 sm:py-6"
                style={{
                  background: "rgba(255, 255, 255, 0.35)",
                  border: `0.5px solid ${INK_MUTED}40`,
                  borderRadius: 2,
                  backdropFilter: "blur(2px)",
                }}
              >
                <span
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center sm:h-14 sm:w-14"
                  style={{
                    background: `${SAGE}12`,
                    border: `0.5px solid ${SAGE}50`,
                    borderRadius: 999,
                    color: SAGE,
                  }}
                >
                  <ScheduleIcon name={item.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[10px] uppercase"
                    style={{ color: SAGE, letterSpacing: "0.42em", fontWeight: 300 }}
                  >
                    {item.time}
                  </div>
                  <h3
                    className="mt-2 italic"
                    style={{
                      color: INK,
                      lineHeight: 1.3,
                      fontWeight: 300,
                      fontSize: "clamp(16px, 4.4vw, 19px)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-2 text-[13px]"
                    style={{ color: INK_SOFT, fontWeight: 300, lineHeight: 1.7 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        <ThemedSeparator theme={themeForSep} lineLength={100} />

        {/* MUSIC */}
        <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-40">
          <SectionHeader eyebrow="— Bizim Müziğimiz" title="O Anın Sesi" />
          <div className="mt-10 flex justify-center sm:mt-14">
            <MusicWaveformPlayer
              trackLabel="Clair de Lune · Claude Debussy"
              color={SAGE}
              inkColor={INK}
              bars={36}
            />
          </div>
        </section>

        <ThemedSeparator theme={themeForSep} lineLength={100} />

        {/* FAQ */}
        <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-40">
          <SectionHeader eyebrow="— Sıkça Sorulanlar" title="Aklındaki Sorular" />
          <ul className="mx-auto mt-10 max-w-[760px] space-y-2 sm:mt-16">
            {FAQ.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="border-b py-5 sm:py-7"
                style={{ borderColor: `${INK_MUTED}40` }}
              >
                <details className="group">
                  <summary
                    className="flex cursor-pointer items-center justify-between gap-3"
                    style={{
                      color: INK,
                      fontWeight: 300,
                      letterSpacing: "0.01em",
                      fontSize: "clamp(15px, 4vw, 17px)",
                      minHeight: 44,
                    }}
                  >
                    <span className="flex-1">{f.q}</span>
                    <span
                      className="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center text-[20px] transition-transform group-open:rotate-45"
                      style={{ color: SAGE, fontWeight: 200 }}
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="mt-4 max-w-[640px] text-[14px]"
                    style={{ color: INK_SOFT, lineHeight: 1.8, fontWeight: 300 }}
                  >
                    {f.a}
                  </p>
                </details>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* CLOSING — daha koyu cream + mini wax seal + lovebirds */}
        <footer
          className="relative px-5 py-20 text-center sm:px-6 sm:py-28 lg:py-32"
          style={{ background: "#E8E3D5", color: INK }}
        >
          {/* Chapel watermark biraz daha güçlü burada — kapanış vurgusu */}
          <ChapelWatermark position="absolute" opacity={0.08} maxWidth={1100} alignment="bottom" bgColor="#E8E3D5" />

          <div className="relative z-10 flex justify-center">
            <WaxSealLuxe size={170} minSize={120} haloColor={SAGE} rotate={-4} bgColor="#E8E3D5" />
          </div>
          <div
            className="relative z-10 mt-10 sm:mt-14"
            style={{
              fontFamily: T.calligraphyFont,
              fontSize: "clamp(38px, 7.2vw, 72px)",
              color: INK,
              letterSpacing: "0.005em",
              lineHeight: 1.1,
            }}
          >
            Defne &amp; Aras
          </div>
          <p
            className="relative z-10 mt-5 px-2 text-[10px]"
            style={{
              color: INK_SOFT,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
          >
            {day} {month} {year} · Aethel&apos;s Chapel
          </p>
          <div className="relative z-10 mt-12 flex justify-center sm:mt-16">
            <Lovebirds size={84} color={`${INK}66`} delay={0.4} />
          </div>
          <p
            className="relative z-10 mt-10 px-2 text-[10px] sm:mt-12"
            style={{
              color: INK_MUTED,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
          >
            Bizimle olmanız bizi onurlandırır
          </p>
        </footer>

        <LiveRsvpCounter
          confirmed={47}
          capacity={60}
          position="bottom"
          inkColor={INK}
          accentColor={SAGE}
          locale="tr"
        />
      </motion.div>
    </>
  );

  /* ── HERO ───────────────────────────────────────────────────────── */
  function Hero({ day, month, year }: { day: string; month: string; year: string }) {
    return (
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-6 lg:py-32"
        style={{ background: CREAM_BG, color: INK }}
      >
        {/* Hero-içi büyük watermark — chapel ön planda zarif */}
        <ChapelWatermark position="absolute" opacity={0.09} maxWidth={1000} bgColor={CREAM_BG} />

        <div className="relative z-10 flex w-full flex-col items-center text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="text-[10px] uppercase"
            style={{
              color: INK_MUTED,
              letterSpacing: "0.5em",
              fontWeight: 300,
            }}
          >
            Evleniyoruz
          </motion.div>

          {/* WAX SEAL — luxe PNG, multiply ile cream'e oturur */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 sm:mt-14"
          >
            <WaxSealLuxe size={210} minSize={140} priority haloColor={SAGE} rotate={-6} delay={1.0} bgColor={CREAM_BG} />
          </motion.div>

          {/* Calligraphy isim — geniş nefes */}
          <div className="mt-12 sm:mt-16">
            <CalligraphyName
              text="Defne & Aras"
              size={130}
              color={INK}
              duration={4.2}
              delay={1.8}
            />
          </div>

          {/* Tarih — slot machine'den canlı */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex items-center gap-3 sm:mt-16 sm:gap-6"
          >
            <span aria-hidden className="h-px w-10 sm:w-20" style={{ background: `${INK}40` }} />
            <span
              key={`${day}-${month}-${year}`}
              style={{
                color: INK,
                fontSize: "clamp(12px, 3.2vw, 14px)",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                fontWeight: 300,
                animation: "inkPulse 1.2s ease-out",
                whiteSpace: "nowrap",
              }}
            >
              {day} {month} {year}
            </span>
            <span aria-hidden className="h-px w-10 sm:w-20" style={{ background: `${INK}40` }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 6.0, duration: 1 }}
            className="mt-4 px-4 text-[11px] italic"
            style={{ color: INK_SOFT, letterSpacing: "0.08em", fontWeight: 300 }}
          >
            Aethel&apos;s Chapel · Toscana
          </motion.div>

          {/* Lovebirds altta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6.6, duration: 1.2 }}
            className="mt-10 sm:mt-14"
          >
            <Lovebirds size={94} color={`${INK}66`} delay={6.8} />
          </motion.div>

          {/* Shimmer CTA */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 7.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            type="button"
            className="relative mt-12 inline-flex min-h-[44px] items-center justify-center overflow-hidden px-10 py-3.5 transition-all hover:tracking-[0.48em] sm:mt-16 sm:px-16 sm:py-4"
            style={{
              border: `0.5px solid ${INK}55`,
              color: INK,
              background: "transparent",
              borderRadius: 999,
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontWeight: 300,
              cursor: "pointer",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(110deg, transparent 0%, transparent 42%, ${INK}18 50%, transparent 58%, transparent 100%)`,
                animation: "shimmerSweep 5s ease-in-out infinite",
              }}
            />
            <span className="relative">Bizimle olur musun?</span>
          </motion.button>

          {/* Scroll hint */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ delay: 8.0, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-20"
            style={{ color: INK, fontSize: 22 }}
          >
            ⌄
          </motion.div>
        </div>
      </section>
    );
  }
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 mb-4 text-center"
    >
      <div
        className="text-[10px] uppercase"
        style={{
          color: "#8A9078",
          letterSpacing: "0.5em",
          fontWeight: 300,
        }}
      >
        {eyebrow}
      </div>
      <h2
        className="mt-6"
        style={{
          fontFamily: AETHEL_CHAPEL.calligraphyFont,
          fontSize: "clamp(42px, 5.5vw, 72px)",
          color: "#2E3326",
          letterSpacing: "0.005em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
    </motion.div>
  );
}

function FloatingControls() {
  /* FAZ A.1 — bottom respects iOS home-indicator safe-area; floor at
     1.5rem so desktop layout is unchanged. */
  const bottom = "max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))";
  return (
    <>
      <button
        type="button"
        aria-label="Dil"
        className="fixed left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110 sm:left-6"
        style={{
          bottom,
          background: "#FFFFFF",
          color: "#2E3326",
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: 11,
          letterSpacing: "0.2em",
          fontWeight: 300,
          boxShadow: "0 4px 14px rgba(46, 51, 38, 0.12)",
          border: "0.5px solid rgba(46, 51, 38, 0.15)",
        }}
      >
        TR
      </button>
      <button
        type="button"
        aria-label="Sesi aç/kapat"
        className="fixed right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110 sm:right-6"
        style={{
          bottom,
          background: "#FFFFFF",
          color: "#2E3326",
          fontSize: 16,
          boxShadow: "0 4px 14px rgba(46, 51, 38, 0.12)",
          border: "0.5px solid rgba(46, 51, 38, 0.15)",
        }}
      >
        ♪
      </button>
    </>
  );
}

/* ── Tematik SVG ikonlar — Schedule için ──────────────────────────── */

function ScheduleIcon({ name }: { name: string }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "bell":
      return (
        <svg {...props}>
          <path d="M12 2 C 8 2, 6 5, 6 9 C 6 14, 4 16, 4 17 L 20 17 C 20 16, 18 14, 18 9 C 18 5, 16 2, 12 2 Z" />
          <path d="M10 20 C 10 21.5, 11 22, 12 22 C 13 22, 14 21.5, 14 20" />
        </svg>
      );
    case "glass":
      return (
        <svg {...props}>
          <path d="M7 3 L 17 3 C 17 9, 15 12, 12 12 C 9 12, 7 9, 7 3 Z" />
          <path d="M12 12 L 12 20" />
          <path d="M8 20 L 16 20" />
        </svg>
      );
    case "plate":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <path d="M5 3 L 5 9 M3 3 L 3 6 M7 3 L 7 6" transform="translate(-1 1)" />
        </svg>
      );
    case "star":
      return (
        <svg {...props}>
          <path d="M12 2 L 14 9 L 21 10 L 16 14 L 17.5 21 L 12 17 L 6.5 21 L 8 14 L 3 10 L 10 9 Z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
}
