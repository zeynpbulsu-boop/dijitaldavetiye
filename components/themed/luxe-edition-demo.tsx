"use client";

/**
 * LuxeEditionDemo — FAZ 5.12
 *
 * Tek bileşen, 6 edisyonun tümünü besler. Theme prop'u tüm renk +
 * asset path'lerini içerir. Aethel'ın değer kanıtı template'i
 * birebir aynı kalıpta her edisyona uygulanır.
 *
 * Yapı:
 *   1. EnvelopeCeremony gateway (cream/navy/burgundy zemin + wax seal)
 *   2. Hero (büyük wax seal + calligraphy isim + tarih + lovebirds + CTA)
 *   3. Interactive slot machine (gün/ay/yıl → Hero'da inkPulse update)
 *   4. Schedule (4 satır SVG ikon: bell/glass/plate/star)
 *   5. Music waveform
 *   6. FAQ accordion
 *   7. Footer (mini wax seal + calligraphy + lovebirds + alıntı)
 *
 * Watermark her sayfa boyunca subtle doku (fixed @4.5%, hero @9%,
 * footer @8%).
 */

import { motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { CalligraphyName } from "@/components/themed/calligraphy-name";
import { ThemedSeparator } from "@/components/themed/themed-separator";
import { LiveRsvpCounter } from "@/components/themed/live-rsvp-counter";
import { MusicWaveformPlayer } from "@/components/themed/music-waveform-player";
import { WaxSealLuxe } from "@/components/themed/wax-seal-luxe";
import { ChapelWatermark } from "@/components/themed/chapel-watermark";
import {
  EditionAmbient,
  type EditionAmbientKind,
} from "@/components/themed/edition-ambient";
import {
  JourneyTimeline,
  type StoryEntry,
  type StoryGlyph,
} from "@/components/themed/journey-timeline";
import { EnvelopeCeremony } from "@/components/themed/envelope-ceremony";
import { Lovebirds } from "@/components/ornaments/lovebirds";
import { SlotPicker, slotOptions } from "@/components/inputs/slot-picker";
import { CountdownLuxe } from "@/components/themed/countdown-luxe";
import { MapEmbed } from "@/components/themed/map-embed";
import { ScratchReveal } from "@/components/themed/scratch-reveal";
import { RsvpForm } from "@/app/i/[slug]/_rsvp-form";
import {
  luxeStrings,
  type LuxeLocale,
  type ScheduleItem,
  type FaqItem,
} from "@/lib/i18n/luxe-strings";
import type { EditionMeta } from "@/lib/design/tokens";
import type { EventType, HotelItem, PhotoItem } from "@/lib/db/types";
import Image from "next/image";

export interface LuxeEditionTheme {
  /** EditionMeta türü — sadece calligraphyFont ve separator için gerekli. */
  meta: EditionMeta;
  /** Ana sayfa zemini. */
  bg: string;
  /** Footer zemini (genelde bg'den hafif koyu). */
  footerBg: string;
  /** Birincil mürekkep rengi. */
  ink: string;
  /** İkincil mürekkep — paragraflar. */
  inkSoft: string;
  /** En açık mürekkep — eyebrow, divider. */
  inkMuted: string;
  /** Tema aksanı — pill icon, halo, ornament. */
  accent: string;
  /** Wax seal aura halo (genelde accent). */
  haloColor: string;
  /** Wax seal PNG path. */
  waxSealSrc: string;
  /** Watermark PNG path. */
  watermarkSrc: string;
  /** Çiftin isimleri. */
  coupleName: string;
  /** Çiftin monogram (envelope için, opsiyonel). */
  monogram?: string;
  /** Düğün lokasyonu. */
  venue: string;
  /** Karşılama satırı. */
  greeting?: string;
  /** Eyebrow (Hero'da küçük üst yazı). */
  heroEyebrow?: string;
  /** Hero CTA. */
  heroCta?: string;
  /** Açılış CTA. */
  envelopeCta?: string;
  /** Müzik etiketi. */
  musicTrack?: string;
  /** Footer alt-metin. */
  footerNote?: string;
  /** Varsayılan tarih (hero + slot makinesi gösterimi için). */
  defaultDate?: { day: string; month: string; year: string };
  /** Geri sayım için ISO tarih (YYYY-MM-DD). Yoksa countdown gizlenir. */
  weddingDateISO?: string;
  /** Takvime ekle linkleri (FAZ B.7). Yoksa buton gizlenir. */
  addToCalendar?: { ics: string; google: string };
  /**
   * Yayındaki davetiyenin slug'ı (FAZ B.1). Set edildiğinde FAQ'tan
   * önce inline RSVP formu render edilir. Demo modunda boş.
   */
  rsvpSlug?: string;
  /**
   * Demo + RSVP form yerel dili — 'tr' | 'en' | 'sr'. Default 'tr'.
   * Tüm section başlıkları, SCHEDULE, FAQ, countdown etiketleri ve
   * RSVP formu bu dilden besleniyor.
   */
  locale?: LuxeLocale;
  /** Geriye uyumluluk alias'ı — kaldırılacak; locale tercih edilir. */
  rsvpLocale?: LuxeLocale;
  /**
   * Etkinlik tipi (migration 004). 'wedding' default; 'engagement',
   * 'henna', 'save_the_date' için section başlıkları override edilir.
   */
  eventType?: EventType;
  /**
   * Migration 005 — couple'ın seçtiği wax seal tint rengi (hex).
   * Yoksa preset PNG rengi.
   */
  waxSealColor?: string | null;
  /**
   * Couple'ın yüklediği hero görseli (Supabase Storage public URL).
   * Verildiğinde envelope sonrası Hero üstüne kapak fotosu olarak
   * render edilir.
   */
  heroMediaUrl?: string | null;
  /** Galeri item listesi. Boş array veya undefined ise galeri gizlenir. */
  photos?: PhotoItem[];
  /**
   * Migration 006 — hediye bloğu (IBAN + banka). undefined ise
   * section render edilmez. iban set edilirse bloğun tamamı görünür.
   */
  gift?: {
    iban: string;
    bank?: string | null;
    accountHolder?: string | null;
    note?: string | null;
  };
  /** Otel önerisi listesi (Pressed Love paritesi). */
  hotels?: HotelItem[];
  /**
   * Migration 007 — venue koordinatları. İkisi de set ise harita
   * section render edilir; biri null ise gizlenir.
   */
  venueLat?: number | null;
  venueLng?: number | null;
  /**
   * Migration 008 — true ise Hero'daki tarih satırı canvas overlay ile
   * gizlenir; misafir kazıyarak ortaya çıkarır (Pressed Love paritesi).
   */
  enableScratch?: boolean;
  /**
   * PR #19 — Per-edition hero ambient animation kind. TDI Heritage
   * "elegant animation" paritesi. Verilmezse animasyon render edilmez.
   */
  ambient?: EditionAmbientKind;
  /**
   * PR #20 — "Bizim Hikayemiz" timeline kayıtları. TDI Heritage
   * paritesi. Verilmezse timeline section render edilmez.
   */
  story?: StoryEntry[];
  /** PR #20 — Story timeline'da kullanılacak edition-spesifik glyph. */
  storyGlyph?: StoryGlyph;
  /**
   * PR #21 — Per-edition schedule override (Pressed Love Big Entrance
   * paritesi). Verilmezse global i18n.schedule kullanılır. Her edisyon
   * kendi venue'sine yakışan 5 satırlık narrative program.
   */
  schedule?: ScheduleItem[];
  /**
   * PR #21 — Per-edition FAQ override. Verilmezse global i18n.faq.
   * Her edisyon kendi venue'sine özel cevaplar (otopark, ulaşım, dress
   * code, çocuk).
   */
  faq?: FaqItem[];
}

/* Event-type label overrides. Wedding base'inden farklı olanları
   sadece üzerine bin; eşleşmeyenler base'i kullanır. */
const EVENT_OVERRIDES_TR: Record<
  Exclude<EventType, "wedding">,
  { rsvp?: { title: string }; countdown?: { title: string }; pastLabel?: string }
> = {
  engagement: {
    rsvp: { title: "Nişanımızda yanımızda olur musun?" },
    countdown: { title: "Nişanımıza" },
    pastLabel: "Nişan günü geldi.",
  },
  henna: {
    rsvp: { title: "Kınamızda yanımızda olur musun?" },
    countdown: { title: "Kınamıza" },
    pastLabel: "Kına günü geldi.",
  },
  save_the_date: {
    rsvp: { title: "Tarihimizi not eder misin?" },
    countdown: { title: "Bizim günümüze" },
    pastLabel: "Gün geldi.",
  },
  birthday: {
    rsvp: { title: "Doğum günümüzde yanımda olur musun?" },
    countdown: { title: "Doğum günüme" },
    pastLabel: "Doğum günü geldi.",
  },
};

export function LuxeEditionDemo({ theme }: { theme: LuxeEditionTheme }) {
  const [opened, setOpened] = useState(false);
  const initDate = theme.defaultDate ?? { day: "12", month: "Eylül", year: "2026" };
  const [day, setDay] = useState(initDate.day);
  const [month, setMonth] = useState(initDate.month);
  const [year, setYear] = useState(initDate.year);

  /* Locale-aware string'ler (TR/EN/SR). rsvpLocale legacy alias. */
  const locale: LuxeLocale = theme.locale ?? theme.rsvpLocale ?? "tr";
  const i18n = luxeStrings(locale);

  /* Event type override'ları (engagement/henna/save_the_date). Sadece
     TR'de override seti var; en/sr için override yok → base i18n. */
  const ev = theme.eventType ?? "wedding";
  const evOverride =
    locale === "tr" && ev !== "wedding" ? EVENT_OVERRIDES_TR[ev] : undefined;
  const rsvpTitle = evOverride?.rsvp?.title ?? i18n.sections.rsvp.title;
  const countdownTitle =
    evOverride?.countdown?.title ?? i18n.sections.countdown.title;
  const countdownPastLabel =
    evOverride?.pastLabel ?? i18n.countdownPastLabel;

  const themeForSep = {
    ...theme.meta,
    ornamentColor: theme.inkMuted,
    bodyBg: theme.bg,
    bodyInk: theme.ink,
  };

  return (
    <>
      {/* ZARF SEREMONISI */}
      {!opened && (
        <EnvelopeCeremony
          greeting={theme.greeting ?? "Bir davet sizi bekliyor"}
          ctaLabel={theme.envelopeCta ?? "Davetiyeyi Aç"}
          skipLabel={i18n.sections.skip}
          bgColor={theme.bg}
          inkColor={theme.ink}
          haloColor={theme.haloColor}
          waxSealSrc={theme.waxSealSrc}
          waxSealTint={theme.waxSealColor}
          watermarkSrc={theme.watermarkSrc}
          onOpened={() => setOpened(true)}
        />
      )}

      <motion.div
        id="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        data-edition={theme.meta.slug}
        className="relative min-h-screen overflow-x-hidden scroll-smooth"
        style={{
          background: theme.bg,
          color: theme.ink,
          fontFamily: "var(--font-display), Georgia, serif",
          fontWeight: 300,
          letterSpacing: "0.018em",
        }}
      >
        <ChapelWatermark
          position="fixed"
          opacity={0.045}
          maxWidth={1200}
          bgColor={theme.bg}
          src={theme.watermarkSrc}
        />

        <FloatingControls bg={theme.bg} ink={theme.ink} />

        <Hero
          theme={theme}
          day={day}
          month={month}
          year={year}
          heroCtaFallback={rsvpTitle}
          scratchHint={i18n.sections.scratchHint}
        />

        <ThemedSeparator theme={themeForSep} lineLength={100} />

        {/* HERO MEDIA — Migration 005, couple yüklediğinde gösterilir */}
        {theme.heroMediaUrl && (
          <>
            <section className="relative w-full px-5 py-12 sm:px-6 sm:py-16 lg:py-20">
              <div className="mx-auto max-w-[1100px] overflow-hidden rounded-md shadow-ed-lg">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
                  <Image
                    src={theme.heroMediaUrl}
                    alt={`${theme.coupleName} — kapak fotoğrafı`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 92vw, 1100px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </section>
            <ThemedSeparator theme={themeForSep} lineLength={100} />
          </>
        )}

        {/* JOURNEY TIMELINE — PR #20 (TDI Heritage paritesi) */}
        {theme.story && theme.story.length > 0 && (
          <>
            <JourneyTimeline
              entries={theme.story}
              glyph={theme.storyGlyph}
              ink={theme.ink}
              inkSoft={theme.inkSoft}
              inkMuted={theme.inkMuted}
              accent={theme.accent}
              bg={theme.bg}
              eyebrow={i18n.sections.story?.eyebrow ?? "— Hikâyemiz"}
              title={i18n.sections.story?.title ?? "Yolumuzdan"}
            />
            <ThemedSeparator theme={themeForSep} lineLength={100} />
          </>
        )}

        {/* SLOT MACHINE */}
        <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-40">
          <SectionHeader
            theme={theme}
            eyebrow={i18n.sections.slotMachine.eyebrow}
            title={i18n.sections.slotMachine.title}
          />
          <p
            className="mx-auto mt-8 max-w-[480px] px-2 text-center text-[13px]"
            style={{ color: theme.inkSoft, lineHeight: 1.8, fontWeight: 300 }}
          >
            {i18n.sections.slotMachine.helper}
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

        {/* COUNTDOWN — FAZ B.2 — only when an ISO date is available */}
        {theme.weddingDateISO && (
          <>
            <section className="relative px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
              <SectionHeader
                theme={theme}
                eyebrow={i18n.sections.countdown.eyebrow}
                title={countdownTitle}
              />
              <div className="mt-10 sm:mt-12">
                <CountdownLuxe
                  to={theme.weddingDateISO}
                  accent={theme.accent}
                  ink={theme.ink}
                  inkSoft={theme.inkSoft}
                  labels={i18n.countdownLabels}
                  pastLabel={countdownPastLabel}
                />
              </div>
            </section>
            <ThemedSeparator theme={themeForSep} lineLength={100} />
          </>
        )}

        {/* SCHEDULE */}
        <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-40">
          <SectionHeader
            theme={theme}
            eyebrow={i18n.sections.schedule.eyebrow}
            title={i18n.sections.schedule.title}
          />
          <ul className="mx-auto mt-12 max-w-[760px] space-y-4 sm:mt-20 sm:space-y-6">
            {(theme.schedule ?? i18n.schedule).map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                /* FAZ D.5 — hover'da hafif scale + soft shadow */
                whileHover={{
                  scale: 1.01,
                  boxShadow: isDarkColor(theme.bg)
                    ? "0 8px 24px rgba(0, 0, 0, 0.28)"
                    : "0 8px 24px rgba(31, 27, 23, 0.10)",
                }}
                className="flex items-center gap-4 px-4 py-4 sm:gap-8 sm:px-8 sm:py-6"
                style={{
                  /* FAZ D.3 — dark themes get a softer wash + accent-tinted
                     hairline so cards actually read against the deep bg.
                     Light themes keep the existing 18% white wash. */
                  background: isDarkColor(theme.bg)
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.18)",
                  border: `0.5px solid ${
                    isDarkColor(theme.bg) ? `${theme.accent}55` : `${theme.inkMuted}40`
                  }`,
                  borderRadius: 2,
                  backdropFilter: "blur(2px)",
                }}
              >
                <span
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center sm:h-14 sm:w-14"
                  style={{
                    background: `${theme.accent}12`,
                    border: `0.5px solid ${theme.accent}55`,
                    borderRadius: 999,
                    color: theme.accent,
                  }}
                >
                  <ScheduleIcon name={item.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[10px] uppercase"
                    style={{ color: theme.accent, letterSpacing: "0.42em", fontWeight: 300 }}
                  >
                    {item.time}
                  </div>
                  <h3
                    className="mt-2 italic"
                    style={{
                      color: theme.ink,
                      lineHeight: 1.3,
                      fontWeight: 300,
                      fontSize: "clamp(16px, 4.4vw, 19px)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-2 text-[13px]"
                    style={{ color: theme.inkSoft, fontWeight: 300, lineHeight: 1.7 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          {theme.addToCalendar && (
            <div className="mx-auto mt-10 flex max-w-[760px] flex-wrap items-center justify-center gap-3 sm:mt-12 sm:gap-5">
              <a
                href={theme.addToCalendar.google}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2 text-[10px] uppercase transition-all hover:tracking-[0.32em]"
                style={{
                  border: `0.5px solid ${theme.ink}55`,
                  color: theme.ink,
                  letterSpacing: "0.28em",
                  fontWeight: 300,
                }}
              >
                {i18n.sections.calendarGoogle}
              </a>
              <a
                href={theme.addToCalendar.ics}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2 text-[10px] uppercase transition-all hover:tracking-[0.32em]"
                style={{
                  border: `0.5px solid ${theme.ink}55`,
                  color: theme.ink,
                  letterSpacing: "0.28em",
                  fontWeight: 300,
                }}
              >
                {i18n.sections.calendarIcs}
              </a>
            </div>
          )}
        </section>

        <ThemedSeparator theme={themeForSep} lineLength={100} />

        {/* MAP — Migration 007, B.3. İki koordinat da set ise. */}
        {typeof theme.venueLat === "number" && typeof theme.venueLng === "number" && (
          <>
            <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
              <SectionHeader
                theme={theme}
                eyebrow={i18n.sections.map.eyebrow}
                title={i18n.sections.map.title}
              />
              <div className="mt-10 sm:mt-14">
                <MapEmbed
                  lat={theme.venueLat}
                  lng={theme.venueLng}
                  label={theme.venue}
                  directionsLabel={i18n.sections.map.directions}
                  ink={theme.ink}
                  accent={theme.accent}
                />
              </div>
            </section>
            <ThemedSeparator theme={themeForSep} lineLength={100} />
          </>
        )}

        {/* PHOTO GALLERY — Migration 005, couple yüklediğinde */}
        {theme.photos && theme.photos.length > 0 && (
          <>
            <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
              <SectionHeader
                theme={theme}
                eyebrow={i18n.sections.gallery?.eyebrow ?? "— Anılarımız"}
                title={i18n.sections.gallery?.title ?? "Bir bakış"}
              />
              <div className="mx-auto mt-10 grid max-w-[1100px] grid-cols-2 gap-2 sm:mt-14 sm:grid-cols-3 sm:gap-3 lg:gap-4">
                {theme.photos.map((p, i) => (
                  <motion.div
                    key={p.url}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-square overflow-hidden rounded-sm"
                    style={{ border: `0.5px solid ${theme.inkMuted}30` }}
                  >
                    <Image
                      src={p.url}
                      alt={p.alt ?? `${theme.coupleName} — galeri ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
            <ThemedSeparator theme={themeForSep} lineLength={100} />
          </>
        )}

        {/* MUSIC */}
        <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-40">
          <SectionHeader
            theme={theme}
            eyebrow={i18n.sections.music.eyebrow}
            title={i18n.sections.music.title}
          />
          <div className="mt-10 flex justify-center sm:mt-14">
            <MusicWaveformPlayer
              trackLabel={theme.musicTrack ?? "Clair de Lune · Claude Debussy"}
              color={theme.accent}
              inkColor={theme.ink}
              bars={36}
            />
          </div>
        </section>

        <ThemedSeparator theme={themeForSep} lineLength={100} />

        {/* HOTELS — Pressed Love paritesi, theme.hotels varsa */}
        {theme.hotels && theme.hotels.length > 0 && (
          <>
            <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
              <SectionHeader
                theme={theme}
                eyebrow={i18n.sections.hotels.eyebrow}
                title={i18n.sections.hotels.title}
              />
              <p
                className="mx-auto mt-6 max-w-[560px] px-2 text-center text-[13px]"
                style={{ color: theme.inkSoft, lineHeight: 1.8, fontWeight: 300 }}
              >
                {i18n.sections.hotels.intro}
              </p>
              <ul className="mx-auto mt-10 grid max-w-[900px] gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {theme.hotels.map((h, i) => (
                  <motion.li
                    key={`${h.name}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-2 px-5 py-5"
                    style={{
                      background: isDarkColor(theme.bg)
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.20)",
                      border: `0.5px solid ${
                        isDarkColor(theme.bg) ? `${theme.accent}55` : `${theme.inkMuted}40`
                      }`,
                      borderRadius: 2,
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    <div
                      className="text-[10px] uppercase"
                      style={{ color: theme.accent, letterSpacing: "0.32em", fontWeight: 300 }}
                    >
                      {h.price ?? "Otel"}
                    </div>
                    <h3
                      className="italic"
                      style={{
                        color: theme.ink,
                        lineHeight: 1.3,
                        fontWeight: 300,
                        fontSize: "clamp(17px, 4vw, 20px)",
                      }}
                    >
                      {h.name}
                    </h3>
                    {h.address && (
                      <p
                        className="text-[12px]"
                        style={{ color: theme.inkSoft, fontWeight: 300, lineHeight: 1.6 }}
                      >
                        {h.address}
                      </p>
                    )}
                    {h.note && (
                      <p
                        className="text-[12px] italic"
                        style={{ color: theme.inkSoft, fontWeight: 300, lineHeight: 1.6 }}
                      >
                        {h.note}
                      </p>
                    )}
                    {h.url && (
                      <a
                        href={h.url}
                        target="_blank"
                        rel="noopener"
                        className="mt-2 inline-flex w-fit min-h-[36px] items-center text-[10px] uppercase transition-all hover:tracking-[0.34em]"
                        style={{
                          color: theme.accent,
                          letterSpacing: "0.3em",
                          fontWeight: 300,
                          textDecoration: "underline",
                          textUnderlineOffset: 4,
                        }}
                      >
                        Detay →
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </section>
            <ThemedSeparator theme={themeForSep} lineLength={100} />
          </>
        )}

        {/* RSVP — FAZ B.1 — only on the live invitation, not in demos */}
        {theme.rsvpSlug && (
          <>
            <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
              <SectionHeader
                theme={theme}
                eyebrow={i18n.sections.rsvp.eyebrow}
                title={rsvpTitle}
              />
              <div className="mx-auto mt-10 max-w-[680px] sm:mt-14">
                <RsvpForm slug={theme.rsvpSlug} locale={locale} />
              </div>
            </section>
            <ThemedSeparator theme={themeForSep} lineLength={100} />
          </>
        )}

        {/* FAQ */}
        <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-40">
          <SectionHeader
            theme={theme}
            eyebrow={i18n.sections.faq.eyebrow}
            title={i18n.sections.faq.title}
          />
          <ul className="mx-auto mt-10 max-w-[760px] space-y-2 sm:mt-16">
            {(theme.faq ?? i18n.faq).map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="border-b py-5 sm:py-7"
                style={{ borderColor: `${theme.inkMuted}40` }}
              >
                <details className="group">
                  <summary
                    /* FAZ D.5 — hover'da yumuşak bir vurgu (accent ile underline) */
                    className="flex cursor-pointer items-center justify-between gap-3 transition-colors hover:text-[--faq-hover-ink]"
                    style={{
                      color: theme.ink,
                      fontWeight: 300,
                      letterSpacing: "0.01em",
                      fontSize: "clamp(15px, 4vw, 17px)",
                      minHeight: 44,
                      // CSS var: hover'da accent rengine yumuşak geç
                      ["--faq-hover-ink" as unknown as string]: theme.accent,
                    } as CSSProperties}
                  >
                    <span className="flex-1">{f.q}</span>
                    <span
                      className="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center text-[20px] transition-transform group-open:rotate-45"
                      style={{ color: theme.accent, fontWeight: 200 }}
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="mt-4 max-w-[640px] text-[14px]"
                    style={{ color: theme.inkSoft, lineHeight: 1.8, fontWeight: 300 }}
                  >
                    {f.a}
                  </p>
                </details>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* GIFTS — Pressed Love paritesi, theme.gift varsa */}
        {theme.gift && (
          <>
            <ThemedSeparator theme={themeForSep} lineLength={100} />
            <section className="relative px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
              <SectionHeader
                theme={theme}
                eyebrow={i18n.sections.gifts.eyebrow}
                title={i18n.sections.gifts.title}
              />
              <p
                className="mx-auto mt-6 max-w-[560px] px-2 text-center text-[13px]"
                style={{ color: theme.inkSoft, lineHeight: 1.8, fontWeight: 300 }}
              >
                {i18n.sections.gifts.intro}
              </p>
              <div
                className="mx-auto mt-10 max-w-[560px] px-5 py-7 sm:mt-12 sm:px-8 sm:py-8"
                style={{
                  background: isDarkColor(theme.bg)
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.22)",
                  border: `0.5px solid ${theme.accent}55`,
                  borderRadius: 2,
                  backdropFilter: "blur(2px)",
                }}
              >
                {theme.gift.bank && (
                  <GiftRow
                    label={i18n.sections.gifts.bank}
                    value={theme.gift.bank}
                    theme={theme}
                  />
                )}
                {theme.gift.accountHolder && (
                  <GiftRow
                    label={i18n.sections.gifts.accountHolder}
                    value={theme.gift.accountHolder}
                    theme={theme}
                  />
                )}
                <GiftRow
                  label="IBAN"
                  value={theme.gift.iban}
                  theme={theme}
                  copyable
                  copyLabel={i18n.sections.gifts.copyLabel}
                  copyDone={i18n.sections.gifts.copyDone}
                />
                {theme.gift.note && (
                  <p
                    className="mt-5 text-[12px] italic"
                    style={{ color: theme.inkSoft, fontWeight: 300, lineHeight: 1.7 }}
                  >
                    {theme.gift.note}
                  </p>
                )}
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer
          className="relative px-5 py-20 text-center sm:px-6 sm:py-28 lg:py-32"
          style={{ background: theme.footerBg, color: theme.ink }}
        >
          <ChapelWatermark
            position="absolute"
            opacity={0.08}
            maxWidth={1100}
            alignment="bottom"
            bgColor={theme.footerBg}
            src={theme.watermarkSrc}
          />

          <div className="relative z-10 flex justify-center">
            <WaxSealLuxe
              src={theme.waxSealSrc}
              size={170}
              minSize={120}
              haloColor={theme.haloColor}
              tintColor={theme.waxSealColor}
              rotate={-4}
              bgColor={theme.footerBg}
            />
          </div>
          <div
            className="relative z-10 mt-10 sm:mt-14"
            style={{
              fontFamily: theme.meta.calligraphyFont,
              fontSize: "clamp(38px, 7.2vw, 72px)",
              color: theme.ink,
              letterSpacing: "0.005em",
              lineHeight: 1.1,
            }}
          >
            {theme.coupleName}
          </div>
          <p
            className="relative z-10 mt-5 px-2 text-[10px]"
            style={{
              color: theme.inkSoft,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
          >
            {day} {month} {year} · {theme.venue}
          </p>
          <div className="relative z-10 mt-12 flex justify-center sm:mt-16">
            {/* FAZ D.7 — accent rengine geç ki ornament tema kimliğini taşısın */}
            <Lovebirds size={84} color={`${theme.accent}AA`} delay={0.4} />
          </div>
          <p
            className="relative z-10 mt-10 px-2 text-[10px] sm:mt-12"
            style={{
              color: theme.inkMuted,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
          >
            {theme.footerNote ?? i18n.footerFallback}
          </p>

          {/* Back to Top — Pressed Love paritesi */}
          <div className="relative z-10 mt-10">
            <a
              href="#main"
              className="inline-flex min-h-[40px] items-center text-[10px] uppercase transition-all hover:tracking-[0.36em]"
              style={{
                color: theme.inkSoft,
                letterSpacing: "0.28em",
                fontWeight: 300,
                borderBottom: `0.5px solid ${theme.inkMuted}55`,
                paddingBottom: 4,
              }}
            >
              ↑ {i18n.sections.backToTop}
            </a>
          </div>

          {/* FAZ D.8 — thin legal line under the editorial close */}
          <div
            className="relative z-10 mt-12 border-t pt-6 text-[9px]"
            style={{
              borderColor: `${theme.inkMuted}30`,
              color: `${theme.inkMuted}DD`,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
          >
            © {new Date().getFullYear()} NUVE ·{" "}
            <a href="/kvkk" className="hover:underline">
              KVKK
            </a>{" "}
            ·{" "}
            <a href="/gizlilik" className="hover:underline">
              Gizlilik
            </a>
          </div>
        </footer>

        <LiveRsvpCounter
          confirmed={47}
          capacity={60}
          position="bottom"
          inkColor={theme.ink}
          accentColor={theme.accent}
          locale="tr"
        />
      </motion.div>
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────── */

function Hero({
  theme,
  day,
  month,
  year,
  heroCtaFallback,
  scratchHint,
}: {
  theme: LuxeEditionTheme;
  day: string;
  month: string;
  year: string;
  heroCtaFallback: string;
  scratchHint: string;
}) {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-6 lg:py-32"
      style={{ background: theme.bg, color: theme.ink }}
    >
      <ChapelWatermark
        position="absolute"
        opacity={0.09}
        maxWidth={1000}
        bgColor={theme.bg}
        src={theme.watermarkSrc}
      />

      {/* PR #19 — Per-edition micro-animation (doves/stars/waves/...).
          z-[1] watermark üstünde, content (z-10) altında. */}
      {theme.ambient && (
        <EditionAmbient
          kind={theme.ambient}
          accentColor={theme.accent}
          bgColor={theme.bg}
        />
      )}

      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          className="text-[10px] uppercase"
          style={{
            color: theme.inkMuted,
            letterSpacing: "0.5em",
            fontWeight: 300,
          }}
        >
          {theme.heroEyebrow ?? "Evleniyoruz"}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-14"
        >
          <WaxSealLuxe
            src={theme.waxSealSrc}
            size={210}
            minSize={140}
            priority
            haloColor={theme.haloColor}
            tintColor={theme.waxSealColor}
            rotate={-6}
            delay={1.0}
            bgColor={theme.bg}
          />
        </motion.div>

        <div className="mt-12 sm:mt-16">
          <CalligraphyName
            text={theme.coupleName}
            size={130}
            color={theme.ink}
            duration={4.2}
            delay={1.8}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex items-center gap-3 sm:mt-16 sm:gap-6"
        >
          {theme.enableScratch ? (
            /* Pressed Love paritesi — date satırını kazıyarak ortaya çıkar.
               Inline-flex span'lar arasında ScratchReveal block olarak
               davranır; padding ile minimum bir kazıma yüzeyi sağlanır. */
            <ScratchReveal
              hint={scratchHint}
              surfaceColor={`${theme.accent}E0`}
              hintColor={isDarkColor(theme.bg) ? "#FFFFFF" : theme.bg}
              brushSize={32}
              threshold={0.35}
              className="px-6 py-3"
            >
              <span
                key={`${day}-${month}-${year}`}
                style={{
                  color: theme.ink,
                  fontSize: "clamp(12px, 3.2vw, 14px)",
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  fontWeight: 300,
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
              >
                {day} {month} {year}
              </span>
            </ScratchReveal>
          ) : (
            <>
              <span aria-hidden className="h-px w-10 sm:w-20" style={{ background: `${theme.ink}40` }} />
              <span
                key={`${day}-${month}-${year}`}
                style={{
                  color: theme.ink,
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
              <span aria-hidden className="h-px w-10 sm:w-20" style={{ background: `${theme.ink}40` }} />
            </>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 6.0, duration: 1 }}
          className="mt-4 px-4 text-[11px] italic"
          style={{ color: theme.inkSoft, letterSpacing: "0.08em", fontWeight: 300 }}
        >
          {theme.venue}
        </motion.div>

        {/* SAVE THE DATE pill — Pressed Love paritesi.
            theme.addToCalendar.google varsa Google Calendar deep
            link açar; yoksa #pricing'e sevk. */}
        <motion.a
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 6.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          href={theme.addToCalendar?.google ?? "#pricing"}
          target={theme.addToCalendar ? "_blank" : undefined}
          rel={theme.addToCalendar ? "noopener" : undefined}
          className="mt-10 inline-flex min-h-[48px] items-center justify-center px-9 py-3 transition-all hover:tracking-[0.44em] sm:mt-12"
          style={{
            border: `0.5px solid ${theme.ink}66`,
            color: theme.ink,
            background: "transparent",
            borderRadius: 999,
            fontSize: 11,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            fontWeight: 400,
            fontFamily: "var(--font-display), Georgia, serif",
          }}
        >
          Save the Date
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6.8, duration: 1.2 }}
          className="mt-10 sm:mt-14"
        >
          {/* FAZ D.7 — hero lovebirds da accent renginde */}
          <Lovebirds size={94} color={`${theme.accent}AA`} delay={7.0} />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 7.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          type="button"
          className="relative mt-12 inline-flex min-h-[44px] items-center justify-center overflow-hidden px-10 py-3.5 transition-all hover:tracking-[0.48em] sm:mt-16 sm:px-16 sm:py-4"
          style={{
            border: `0.5px solid ${theme.ink}55`,
            color: theme.ink,
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
              background: `linear-gradient(110deg, transparent 0%, transparent 42%, ${theme.accent}40 50%, transparent 58%, transparent 100%)`,
              animation: "shimmerSweep 5s ease-in-out infinite",
            }}
          />
          <span className="relative">{theme.heroCta ?? heroCtaFallback}</span>
        </motion.button>

        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ delay: 8.0, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-20"
          style={{ color: theme.ink, fontSize: 22 }}
        >
          ⌄
        </motion.div>
      </div>
    </section>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function SectionHeader({
  theme,
  eyebrow,
  title,
}: {
  theme: LuxeEditionTheme;
  eyebrow: string;
  title: string;
}) {
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
          color: theme.inkMuted,
          letterSpacing: "0.5em",
          fontWeight: 300,
        }}
      >
        {eyebrow}
      </div>
      <h2
        className="mt-6"
        style={{
          fontFamily: theme.meta.calligraphyFont,
          fontSize: "clamp(42px, 5.5vw, 72px)",
          color: theme.ink,
          letterSpacing: "0.005em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
    </motion.div>
  );
}

function FloatingControls({ bg, ink }: { bg: string; ink: string }) {
  // Floating buttons need contrast — beyaz pill if dark bg, dark pill if light bg.
  const isDark = isDarkColor(bg);
  const pillBg = isDark ? "#FFFFFF" : "#FFFFFF";
  const pillInk = isDark ? "#1F1B17" : ink;
  /* FAZ A.1 — bottom respects iOS home-indicator safe-area. Floor at
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
          background: pillBg,
          color: pillInk,
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: 11,
          letterSpacing: "0.2em",
          fontWeight: 300,
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
          border: "0.5px solid rgba(0, 0, 0, 0.10)",
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
          background: pillBg,
          color: pillInk,
          fontSize: 16,
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
          border: "0.5px solid rgba(0, 0, 0, 0.10)",
        }}
      >
        ♪
      </button>
    </>
  );
}

/* Gift section row — etiket + değer + opsiyonel "Kopyala" butonu.
   IBAN için copyable=true geçer; clipboard API'siyle yazar ve 2s
   "Kopyalandı" feedback'i. Tek satırda render edilir; uzun IBAN'lar
   mobil'de wrap olur. */
function GiftRow({
  label,
  value,
  theme,
  copyable = false,
  copyLabel,
  copyDone,
}: {
  label: string;
  value: string;
  theme: LuxeEditionTheme;
  copyable?: boolean;
  copyLabel?: string;
  copyDone?: string;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard izni yoksa sessizce yut */
    }
  }
  return (
    <div className="flex flex-col gap-1 border-b py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 last:border-b-0"
      style={{ borderColor: `${theme.inkMuted}30` }}
    >
      <div className="flex-1">
        <div
          className="text-[10px] uppercase"
          style={{ color: theme.inkMuted, letterSpacing: "0.28em", fontWeight: 300 }}
        >
          {label}
        </div>
        <div
          className="mt-1 text-[14px] sm:text-[15px]"
          style={{ color: theme.ink, fontWeight: 300, wordBreak: "break-all" }}
        >
          {value}
        </div>
      </div>
      {copyable && (
        <button
          type="button"
          onClick={copy}
          className="self-start text-[10px] uppercase transition-all hover:tracking-[0.34em] sm:self-center"
          style={{
            color: copied ? theme.accent : theme.ink,
            letterSpacing: "0.28em",
            fontWeight: 300,
            border: `0.5px solid ${theme.ink}40`,
            borderRadius: 999,
            padding: "8px 16px",
            minHeight: 36,
          }}
        >
          {copied ? copyDone ?? "Kopyalandı" : copyLabel ?? "Kopyala"}
        </button>
      )}
    </div>
  );
}

// Basit luminance kontrolü — hex string'i RGB'ye çevir, parlaklığı hesapla.
function isDarkColor(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

function ScheduleIcon({ name }: { name: import("@/lib/i18n/luxe-strings").ScheduleIconName }) {
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
    case "arrival":
      /* Open door + arrow — guests entering */
      return (
        <svg {...props}>
          <path d="M9 21 L 9 3 L 15 4 L 15 20 L 9 21 Z" />
          <circle cx="13.2" cy="12" r="0.5" fill="currentColor" />
          <path d="M3 12 L 8 12 M5.5 9.5 L 8 12 L 5.5 14.5" />
        </svg>
      );
    case "vows":
      /* Two hearts joined */
      return (
        <svg {...props}>
          <path d="M8 13 C 5 11, 5 8, 7 7 C 8.5 6.5, 9.5 7.5, 10 8.5 C 10.5 7.5, 11.5 6.5, 13 7 C 15 8, 15 11, 12 13 L 10 14.5 Z" />
          <path d="M14 17 C 12 15.5, 12 13.5, 13.5 13 C 14.5 12.5, 15 13.5, 15.5 14 C 16 13.5, 16.5 12.5, 17.5 13 C 19 13.5, 19 15.5, 17 17 L 15.5 18.2 Z" />
        </svg>
      );
    case "music":
      /* Music note */
      return (
        <svg {...props}>
          <path d="M9 18 C 9 19.5, 7.5 20, 6.5 20 C 5.5 20, 5 19, 5 18 C 5 17, 6 16, 7 16 C 8 16, 9 16.5, 9 17 L 9 5 L 17 3 L 17 16" />
          <ellipse cx="14.5" cy="17" rx="2.5" ry="2" />
        </svg>
      );
    case "dance":
      /* Two figures dancing */
      return (
        <svg {...props}>
          <circle cx="8" cy="5" r="1.5" />
          <path d="M8 7 L 8 14 M5 17 L 8 14 L 11 17 M6 11 L 14 9" />
          <circle cx="16" cy="6" r="1.5" />
          <path d="M16 8 L 16 14 M13 17 L 16 14 L 19 17" />
        </svg>
      );
    case "cake":
      /* Layered cake with candle */
      return (
        <svg {...props}>
          <path d="M12 2 L 12 4" />
          <circle cx="12" cy="2" r="0.5" fill="currentColor" />
          <rect x="4" y="14" width="16" height="6" rx="0.5" />
          <rect x="6" y="10" width="12" height="4" rx="0.5" />
          <rect x="9" y="6" width="6" height="4" rx="0.5" />
        </svg>
      );
    case "ring":
      /* Wedding rings interlocked */
      return (
        <svg {...props}>
          <circle cx="9" cy="14" r="5" />
          <circle cx="15" cy="14" r="5" />
          <path d="M7.5 5 L 10.5 5 L 9 8 Z" fill="currentColor" />
          <path d="M13.5 5 L 16.5 5 L 15 8 Z" fill="currentColor" />
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
