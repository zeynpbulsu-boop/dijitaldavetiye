"use client";

/**
 * AethelChapelDemo — FAZ 5.7 KILLER DEMO
 *
 * Aethel's Chapel ediziyonu tam tematik bütünsel davetiye.
 * Tüm yeni komponentler burada bir araya geliyor.
 */

import { motion } from "framer-motion";
import { AETHEL_CHAPEL } from "@/lib/design/tokens";
import { CalligraphyName } from "@/components/themed/calligraphy-name";
import { ThemedSeparator } from "@/components/themed/themed-separator";
import { LiveRsvpCounter } from "@/components/themed/live-rsvp-counter";
import { MusicWaveformPlayer } from "@/components/themed/music-waveform-player";
import { StoryTimeline, type StoryEvent } from "@/components/themed/story-timeline";
import { AethelChapelCoverScene } from "@/components/templates/aethel-chapel/cover-scene";

const T = AETHEL_CHAPEL;

const STORY: StoryEvent[] = [
  {
    date: "Eylül 2021",
    icon: "✦",
    title: "Tanışma",
    body:
      "Bir Cumartesi öğleden sonra, eski bir kitapçının arka rafında. Aynı kitabın son nüshasına uzandık — sonra üç saat orada oturup okuyup konuştuk.",
  },
  {
    date: "Aralık 2021",
    icon: "✦",
    title: "İlk Randevu",
    body:
      "Karlı bir gecede, Boğaz'a bakan küçük bir İtalyan lokantası. Şarap masada bekledi, biz sabaha kadar konuştuk. O gece sonsuza dek bitmemesini diledik.",
  },
  {
    date: "Haziran 2025",
    icon: "✦",
    title: "Evlilik Teklifi",
    body:
      "Bir Toscana köyünde, gün batımı bahçesinde — onun büyük büyükannesinin yüzüğüyle. Üç dilde 'evet' dedi: 'Sì', 'Yes', 'Evet'.",
  },
  {
    date: "12 Eylül 2026",
    icon: "✦",
    title: "O Gün",
    body:
      "Aethel's Chapel'da, sarmaşıklar ve mor salkımlar arasında. Sizin de bizimle olmanızı çok isteriz.",
  },
];

const SCHEDULE = [
  { time: "16:00", title: "Tören · Şapelde", desc: "Sevgiyi taş duvarların arasında mühürleyeceğiz" },
  { time: "17:30", title: "Aperitivo · Bahçede", desc: "Prosecco, mevsim çiçekleri arasında" },
  { time: "19:30", title: "Akşam Yemeği · Loggia'da", desc: "Mum ışığında, yıldızların altında" },
  { time: "22:00", title: "Dans · Sarmaşıkların Altında", desc: "Sabaha kadar bizimle kalın" },
];

const FAQ = [
  {
    q: "Şapele nasıl ulaşırız?",
    a: "Köy meydanından 5 dakikalık yürüyüş mesafesinde. Çift dilli yol tarifi için aşağıdaki haritayı kullanabilirsiniz.",
  },
  {
    q: "Ne giymeli?",
    a: "Bahçe-şık. Topuklu yerine alçak topuk veya zarif sandalet öneririz — taş zemin kaygan olabilir.",
  },
  {
    q: "Çocuklar gelebilir mi?",
    a: "Elbette — küçük misafirler için ayrı bir alan ve aktivite planımız var.",
  },
  {
    q: "Konaklama önerisi?",
    a: "Köy içinde 3 boutique otel ayırdık. RSVP formunda tercihinizi belirtebilirsiniz.",
  },
];

export function AethelChapelDemo() {
  return (
    <div
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
      {/* ── Background watermark — Aethel'in ivy SVG sahnesi, çok hafifletilmiş ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ opacity: 0.04, mixBlendMode: "multiply" }}
      >
        <AethelChapelCoverScene />
      </div>

      {/* ── Sticky floating controls — Pressed Love kalıbı ── */}
      <FloatingControls />

      {/* ── HERO — solid yosun yeşili + calligraphy stroke isim ── */}
      <Hero />

      <ThemedSeparator theme={T} lineLength={80} />

      {/* ── Story Timeline ── */}
      <section className="relative px-6 py-20 lg:py-32">
        <SectionHeader eyebrow="— Bizim Hikayemiz" title="Birlikte Yürüdüğümüz Yol" />
        <StoryTimeline
          events={STORY}
          lineColor={`${T.ornamentColor}50`}
          titleColor={T.bodyInk}
          bodyColor={`${T.bodyInk}AA`}
          cardBg={`${T.bodyBg}55`}
        />
      </section>

      <ThemedSeparator theme={T} lineLength={80} />

      {/* ── Schedule / Programme — tematik ikon + saat chip ── */}
      <section className="relative px-6 py-20 lg:py-32">
        <SectionHeader eyebrow="— O Günün Akışı" title="Programımız" />
        <ul className="mx-auto mt-12 max-w-[720px] space-y-6">
          {SCHEDULE.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-6 border-b py-5"
              style={{ borderColor: `${T.ornamentColor}30` }}
            >
              <span
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center"
                style={{
                  background: `${T.ornamentColor}18`,
                  borderRadius: 999,
                  border: `1px solid ${T.ornamentColor}50`,
                  color: T.ornamentColor,
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  fontWeight: 300,
                }}
              >
                {item.time}
              </span>
              <div className="flex-1">
                <h3
                  className="text-[18px] italic"
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

      {/* ── Music Waveform Player ── */}
      <section className="relative px-6 py-20 lg:py-28">
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

      {/* ── FAQ ── */}
      <section className="relative px-6 py-20 lg:py-28">
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

      <ThemedSeparator theme={T} lineLength={80} />

      {/* ── Footer ── */}
      <footer
        className="relative px-6 py-20 text-center"
        style={{
          background: T.heroBg,
          color: T.heroInk,
        }}
      >
        <ThemedSeparator theme={T} lineLength={40} size="sm" />
        <div
          className="mt-4"
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
          12 Eylül 2026 · Aethel&apos;s Chapel
        </p>
      </footer>

      {/* ── Live RSVP Counter — sticky alt orta ── */}
      <LiveRsvpCounter
        confirmed={47}
        capacity={60}
        position="bottom"
        inkColor={T.heroBg}
        accentColor={T.ornamentColor}
        locale="tr"
      />
    </div>
  );
}

/* ── Hero — solid yosun yeşili + calligraphy stroke + her şey hâle ── */

function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{
        background: T.heroBg,
        color: T.heroInk,
      }}
    >
      {/* Hero arka planına dokunulmuş ivy motif — çok hafif, scene zaten body bg'de */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, ${T.heroBg} 90%), linear-gradient(180deg, ${T.heroBg}DD 0%, ${T.heroBg} 100%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{ mixBlendMode: "soft-light" }}
      >
        <AethelChapelCoverScene />
      </div>

      <div className="relative z-10 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-[10px] uppercase"
          style={{
            color: `${T.heroInk}99`,
            letterSpacing: "0.42em",
            fontWeight: 300,
          }}
        >
          Evleniyoruz
        </motion.div>

        {/* Calligraphy isim — stroke-by-stroke animasyon, FAZ 5.2 */}
        <div className="mt-10 lg:mt-12">
          <CalligraphyName
            text="Defne & Aras"
            size={120}
            color={T.heroInk}
            duration={4.5}
            delay={0.6}
          />
        </div>

        {/* Tarih + venue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 space-y-2"
        >
          <div
            style={{
              color: T.heroInk,
              fontSize: 16,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
          >
            12 Eylül 2026
          </div>
          <div
            style={{
              color: `${T.heroInk}A0`,
              fontSize: 14,
              fontStyle: "italic",
              letterSpacing: "0.05em",
              fontWeight: 300,
            }}
          >
            Aethel&apos;s Chapel · Toscana
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.8, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          type="button"
          className="mt-14 inline-flex items-center justify-center px-10 py-3.5 transition-all"
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
          Bizimle olur musun?
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ delay: 6.5, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-20"
          style={{ color: T.heroInk }}
        >
          ⌄
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section Header — calligraphy + eyebrow ── */

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

/* ── Sticky floating controls — Pressed Love kalıbı ── */

function FloatingControls() {
  return (
    <>
      {/* Sol alt — dil */}
      <button
        type="button"
        aria-label="Dil"
        className="fixed bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
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

      {/* Sağ alt — ses */}
      <button
        type="button"
        aria-label="Sesi aç/kapat"
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
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
