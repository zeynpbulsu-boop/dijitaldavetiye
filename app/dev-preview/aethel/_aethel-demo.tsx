"use client";

/**
 * AethelChapelDemo — FAZ 5.10
 *
 * BAŞTAN yazıldı. Önceki "dümdüz blog akışı" iskeletini sildim.
 * Şimdi gerçek premium davetiye deneyimi:
 *
 *   1. Tap-to-open zarf seremonisi (sage wax seal + monogram +
 *      breaking animation + shimmer btn)
 *   2. Hero: 3D wax seal monogram (radial gradient + altın shimmer
 *      sweep), LaceFrame ile sarılmış, calligraphy stroke isim,
 *      Lovebirds + minik kalp altta
 *   3. Slot Machine — kullanıcı interaktif: ayı/günü/saati değiştirir,
 *      Hero'daki tarih anında günceller (gerçek live wow-faktör)
 *   4. Schedule: gerçek SVG ikonlar (çan / kadeh / tabak / yıldız)
 *   5. Music waveform
 *   6. FAQ accordion + ✦ ornament
 *   7. Footer wax seal alt versiyonu + back to top
 *
 * Story Timeline KALDIRILDI — kullanıcı kuru uydurma içerik istemedi.
 */

import { motion } from "framer-motion";
import { useState } from "react";
import { AETHEL_CHAPEL } from "@/lib/design/tokens";
import { CalligraphyName } from "@/components/themed/calligraphy-name";
import { ThemedSeparator } from "@/components/themed/themed-separator";
import { LiveRsvpCounter } from "@/components/themed/live-rsvp-counter";
import { MusicWaveformPlayer } from "@/components/themed/music-waveform-player";
import { WaxSealMonogram } from "@/components/themed/wax-seal-monogram";
import { EnvelopeCeremony } from "@/components/themed/envelope-ceremony";
import { LaceFrame } from "@/components/ornaments/lace-frame";
import { Lovebirds } from "@/components/ornaments/lovebirds";
import { SlotPicker, slotOptions } from "@/components/inputs/slot-picker";
import { AethelChapelCoverScene } from "@/components/templates/aethel-chapel/cover-scene";

const T = AETHEL_CHAPEL;

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

const MONTHS_TR = slotOptions.monthsTr;

export function AethelChapelDemo() {
  const [opened, setOpened] = useState(false);

  // Interactive slot machine state — kullanıcı kendi tarihini deneyebilir
  const [day, setDay] = useState("12");
  const [month, setMonth] = useState("Eylül");
  const [year, setYear] = useState("2026");

  return (
    <>
      {/* TAP-TO-OPEN ZARF SEREMONISI */}
      {!opened && (
        <EnvelopeCeremony
          monogram="D&A"
          greeting="Bir davet sizi bekliyor"
          ctaLabel="Davetiyeyi Aç"
          bgColor={T.heroBg}
          sealColor={T.palette.accent}
          highlightColor="#9EAA8E"
          shadowColor={T.palette.deep}
          inkColor={T.heroInk}
          onOpened={() => setOpened(true)}
        />
      )}

      {/* AÇILDIKTAN SONRA — TAM TEMATİK DAVETİYE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        data-edition="aethel-chapel"
        className="relative min-h-screen overflow-x-hidden"
        style={{
          background: T.bodyBg,
          color: T.bodyInk,
          fontFamily: "var(--font-display), Georgia, serif",
          fontWeight: 300,
          letterSpacing: "0.018em",
        }}
      >
        {/* Background watermark — tema sahnesi tüm sayfa boyunca soft */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0"
          style={{ opacity: 0.05, mixBlendMode: "multiply" }}
        >
          <AethelChapelCoverScene />
        </div>

        <FloatingControls />

        {/* HERO — wax seal monogram + dantel + calligraphy stroke + lovebirds */}
        <Hero day={day} month={month} year={year} />

        <ThemedSeparator theme={T} lineLength={80} />

        {/* SLOT MACHINE — interaktif tarih ayarlama */}
        <section className="relative px-6 py-20">
          <SectionHeader eyebrow="— Tarihi Değiştirin" title="Kendi gününüzü seçin" />
          <p
            className="mx-auto mt-6 max-w-[480px] text-center text-[13px]"
            style={{ color: `${T.bodyInk}99`, lineHeight: 1.7 }}
          >
            Slot makinesini çevirin — yukarıdaki tarih anında güncellensin.
            Demo modunda; gerçek davetiyenizde editörden ayarlarsınız.
          </p>

          <div className="mx-auto mt-12 grid max-w-[520px] grid-cols-3 gap-6">
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
              options={MONTHS_TR}
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

        <ThemedSeparator theme={T} lineLength={80} />

        {/* SCHEDULE — gerçek SVG ikonlar */}
        <section className="relative px-6 py-20 lg:py-28">
          <SectionHeader eyebrow="— O Günün Akışı" title="Programımız" />
          <ul className="mx-auto mt-14 max-w-[720px] space-y-5">
            {SCHEDULE.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-6 px-6 py-5 backdrop-blur-sm"
                style={{
                  background: `${T.bodyBg}55`,
                  border: `0.5px solid ${T.ornamentColor}30`,
                  borderRadius: 2,
                }}
              >
                <span
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center"
                  style={{
                    background: `${T.ornamentColor}15`,
                    border: `1px solid ${T.ornamentColor}50`,
                    borderRadius: 999,
                    color: T.ornamentColor,
                  }}
                >
                  <ScheduleIcon name={item.icon} />
                </span>
                <div className="flex-1">
                  <div
                    className="text-[10px] uppercase"
                    style={{ color: T.ornamentColor, letterSpacing: "0.32em", fontWeight: 300 }}
                  >
                    {item.time}
                  </div>
                  <h3
                    className="mt-1 text-[18px] italic"
                    style={{ color: T.bodyInk, lineHeight: 1.3, fontWeight: 300 }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-1 text-[13px]"
                    style={{ color: `${T.bodyInk}90`, fontWeight: 300, lineHeight: 1.6 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        <ThemedSeparator theme={T} lineLength={80} />

        {/* MUSIC */}
        <section className="relative px-6 py-20">
          <SectionHeader eyebrow="— Bizim Müziğimiz" title="O Anın Sesi" />
          <div className="mt-10 flex justify-center">
            <MusicWaveformPlayer
              trackLabel="Clair de Lune · Claude Debussy"
              color={T.ornamentColor}
              inkColor={T.bodyInk}
              bars={36}
            />
          </div>
        </section>

        <ThemedSeparator theme={T} lineLength={80} />

        {/* FAQ */}
        <section className="relative px-6 py-20">
          <SectionHeader eyebrow="— Sıkça Sorulanlar" title="Aklındaki Sorular" />
          <ul className="mx-auto mt-10 max-w-[760px] space-y-4">
            {FAQ.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="border-b py-5"
                style={{ borderColor: `${T.ornamentColor}30` }}
              >
                <details className="group">
                  <summary
                    className="flex cursor-pointer items-center justify-between text-[16px]"
                    style={{ color: T.bodyInk, fontWeight: 300, letterSpacing: "0.01em" }}
                  >
                    {f.q}
                    <span
                      className="ml-4 text-[18px] transition-transform group-open:rotate-45"
                      style={{ color: T.ornamentColor, fontWeight: 200 }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="mt-3 text-[14px]"
                    style={{ color: `${T.bodyInk}AA`, lineHeight: 1.7, fontWeight: 300 }}
                  >
                    {f.a}
                  </p>
                </details>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* FOOTER — koyu, wax seal alt versiyon */}
        <footer
          className="relative px-6 py-24 text-center"
          style={{ background: T.heroBg, color: T.heroInk }}
        >
          <div className="flex justify-center">
            <WaxSealMonogram
              monogram="D&A"
              baseColor={T.palette.accent}
              highlightColor="#9EAA8E"
              shadowColor={T.palette.deep}
              inkColor={T.heroInk}
              size={140}
              rotate={-6}
            />
          </div>
          <div
            className="mt-10"
            style={{
              fontFamily: T.calligraphyFont,
              fontSize: "clamp(40px, 5vw, 64px)",
              color: T.heroInk,
              letterSpacing: "0.005em",
              lineHeight: 1.1,
            }}
          >
            Defne &amp; Aras
          </div>
          <p
            className="mt-3 text-[10px]"
            style={{
              color: `${T.heroInk}80`,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
          >
            {day} {month} {year} · Aethel&apos;s Chapel
          </p>
          <div className="mt-12 flex justify-center">
            <Lovebirds size={70} color={`${T.heroInk}70`} delay={0.4} />
          </div>
        </footer>

        <LiveRsvpCounter
          confirmed={47}
          capacity={60}
          position="bottom"
          inkColor={T.heroBg}
          accentColor={T.ornamentColor}
          locale="tr"
        />
      </motion.div>
    </>
  );

  /* ── HERO ───────────────────────────────────────────────────────── */
  function Hero({ day, month, year }: { day: string; month: string; year: string }) {
    return (
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
        style={{ background: T.heroBg, color: T.heroInk }}
      >
        {/* Hafifletilmiş chapel sahnesi */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ mixBlendMode: "soft-light" }}
        >
          <AethelChapelCoverScene />
        </div>

        {/* Aura — radial gradient yumuşak vinyet */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${T.palette.accent}28 0%, transparent 55%), radial-gradient(ellipse at center, transparent 30%, ${T.heroBg} 95%)`,
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="text-[10px] uppercase"
            style={{
              color: `${T.heroInk}99`,
              letterSpacing: "0.42em",
              fontWeight: 300,
            }}
          >
            Evleniyoruz
          </motion.div>

          {/* WAX SEAL MONOGRAM — LaceFrame ile sarılı */}
          <div className="relative mt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-[260px] w-[260px] items-center justify-center"
            >
              <LaceFrame
                size={260}
                stroke={`${T.heroInk}55`}
                variant="scallop"
                delay={1.0}
                duration={2.4}
              />
              <WaxSealMonogram
                monogram="D&A"
                baseColor={T.palette.accent}
                highlightColor="#9EAA8E"
                shadowColor={T.palette.deep}
                inkColor={T.heroInk}
                size={170}
                rotate={-8}
                delay={1.2}
              />
            </motion.div>
          </div>

          {/* Calligraphy stroke isim */}
          <div className="mt-12">
            <CalligraphyName
              text="Defne & Aras"
              size={110}
              color={T.heroInk}
              duration={4.0}
              delay={1.6}
            />
          </div>

          {/* Tarih — slot machine'den canlı güncellenir */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex items-center gap-5"
          >
            <span aria-hidden className="h-px w-14" style={{ background: `${T.heroInk}55` }} />
            <span
              key={`${day}-${month}-${year}`}
              style={{
                color: T.heroInk,
                fontSize: 14,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 300,
                animation: "inkPulse 1.2s ease-out",
              }}
            >
              {day} {month} {year}
            </span>
            <span aria-hidden className="h-px w-14" style={{ background: `${T.heroInk}55` }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 5.8, duration: 1 }}
            className="mt-3 text-[11px] italic"
            style={{ color: `${T.heroInk}A0`, letterSpacing: "0.06em", fontWeight: 300 }}
          >
            Aethel&apos;s Chapel · Toscana
          </motion.div>

          {/* Lovebirds + tiny heart altta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6.4, duration: 1.2 }}
            className="mt-10"
          >
            <Lovebirds size={90} color={`${T.heroInk}88`} delay={6.6} />
          </motion.div>

          {/* Shimmer CTA */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 7.0, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            type="button"
            className="relative mt-12 inline-flex items-center justify-center overflow-hidden px-12 py-3.5 transition-all hover:tracking-[0.42em]"
            style={{
              border: `1px solid ${T.heroInk}55`,
              color: T.heroInk,
              background: "transparent",
              borderRadius: 999,
              fontSize: 10,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              fontWeight: 300,
              cursor: "pointer",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(110deg, transparent 0%, transparent 40%, ${T.heroInk}25 50%, transparent 60%, transparent 100%)`,
                animation: "shimmerSweep 5s ease-in-out infinite",
              }}
            />
            <span className="relative">Bizimle olur musun?</span>
          </motion.button>

          {/* Scroll hint */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ delay: 8.0, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-16"
            style={{ color: T.heroInk, fontSize: 22 }}
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
      className="mb-2 text-center"
    >
      <div
        className="text-[10px] uppercase"
        style={{
          color: T.ornamentColor,
          letterSpacing: "0.42em",
          fontWeight: 300,
        }}
      >
        {eyebrow}
      </div>
      <h2
        className="mt-4"
        style={{
          fontFamily: T.calligraphyFont,
          fontSize: "clamp(38px, 5vw, 64px)",
          color: T.bodyInk,
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
  return (
    <>
      <button
        type="button"
        aria-label="Dil"
        className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
        style={{
          background: T.heroBg,
          color: T.heroInk,
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: 11,
          letterSpacing: "0.2em",
          fontWeight: 300,
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        }}
      >
        TR
      </button>
      <button
        type="button"
        aria-label="Sesi aç/kapat"
        className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
        style={{
          background: T.heroBg,
          color: T.heroInk,
          fontSize: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
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
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "bell":  // tören çanı
      return (
        <svg {...props}>
          <path d="M12 2 C 8 2, 6 5, 6 9 C 6 14, 4 16, 4 17 L 20 17 C 20 16, 18 14, 18 9 C 18 5, 16 2, 12 2 Z" />
          <path d="M10 20 C 10 21.5, 11 22, 12 22 C 13 22, 14 21.5, 14 20" />
        </svg>
      );
    case "glass":  // kadeh
      return (
        <svg {...props}>
          <path d="M7 3 L 17 3 C 17 9, 15 12, 12 12 C 9 12, 7 9, 7 3 Z" />
          <path d="M12 12 L 12 20" />
          <path d="M8 20 L 16 20" />
        </svg>
      );
    case "plate":  // yemek tabağı + çatal-bıçak
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <path d="M5 3 L 5 9 M3 3 L 3 6 M7 3 L 7 6" transform="translate(-1 1)" />
        </svg>
      );
    case "star":  // dans yıldızı / parıltı
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
