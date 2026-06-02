"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Props } from "@/lib/themes-v2/types";
import { invitationStrings, eventHeading } from "@/lib/themes-v2/i18n";
import { InvitationI18nProvider } from "./i18n-context";
import { CountdownBand } from "./primitives/countdown-band";
import { PolaroidGallery } from "./primitives/polaroid-gallery";
import { ProgramList } from "./primitives/program-list";
import { VenueMap } from "./primitives/venue-map";
import { GiftInfo } from "./primitives/gift-info";
import { HotelsInfo } from "./primitives/hotels-info";
import { ExtraInfo } from "./primitives/extra-info";
import { RsvpForm } from "./primitives/rsvp-form";
import { AtmosphereDefs } from "./primitives/atmosphere";
import { Reveal } from "./primitives/reveal";
import {
  OpeningCeremony,
  AmbientToggle,
  useAmbientAudio,
} from "./primitives/opening-ceremony";
import { THEME_MUSIC } from "@/lib/themes-v2/assets";
import { MusicEmbedSection } from "./primitives/music-embed";
import { YouTubeMusic } from "./primitives/youtube-music";
import { parseMusicEmbed } from "@/lib/themes-v2/music-embed";

interface Props extends ThemeV2Props {
  hero: ReactNode;
  showBuyBadge?: boolean;
  rsvpSlug?: string;
  /** Per-invitation music override; falls back to the theme's default track. */
  musicSrc?: string | null;
}

export function ThemeShell({
  meta,
  data,
  hero,
  showBuyBadge = false,
  rsvpSlug,
  musicSrc,
}: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  // Çiftin müziği: music_url bir Spotify/YouTube linkiyse RESMİ embed oynatıcı
  // (telif platformda kalır); aksi halde ambient mp3 (override veya tema default).
  const embed = parseMusicEmbed(musicSrc);
  const audio = useAmbientAudio(embed ? undefined : musicSrc || THEME_MUSIC[meta.slug]);

  // Section visibility — a live invitation only shows sections it has data for
  // (no placeholder/empty blocks). The /themes/[slug] preview uses full
  // SAMPLE_DATA so every section appears there.
  const showCountdown = Boolean(data.date.year);
  const showGallery = Boolean(data.story.body) || data.photos.length > 0;
  const showProgram = data.schedule.length > 0;
  const showVenue = Boolean(
    data.venue.name || (typeof data.venue.lat === "number" && typeof data.venue.lng === "number"),
  );
  const showGift = Boolean(data.gift?.iban);
  const showHotels = data.hotels.length > 0;
  const showExtra = Boolean(data.extraInfo && data.extraInfo.trim());
  const t = invitationStrings(data.locale);

  // Mount-gate: framer-motion enter animations (initial → animate) only fire
  // on a fresh client mount, not on Next.js hydration of server markup — so a
  // cleanly-hydrated page would freeze every element at its hidden `initial`
  // state. Rendering the animated tree only after mount guarantees those
  // entrances play. The themed background is server-rendered, so there is no
  // flash — the night sky is already there when the content fades in.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // YouTube müziğini mühre-basma JESTİNİN İÇİNDE doğrudan başlatmak için.
  // (Effect gecikmesi yerine senkron çağrı → iOS dahil sesli autoplay en güvenilir.)
  const musicPlayRef = useRef<(() => void) | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const handleOpen = () => {
    setOpened(true);
    audio.start();
    musicPlayRef.current?.();
    // A11y: perde açılınca odağı davetiye başlığına taşı → klavye/ekran-okuyucu
    // kullanıcısı kapanan perdede sıkışmadan içeriğe geçer (modal-açılış deseni).
    window.setTimeout(() => headingRef.current?.focus(), 350);
  };

  return (
    <InvitationI18nProvider value={t}>
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      {/* A11y: her davetiyede tek anlamsal başlık. Görsel isim dekoratif
          calligraphy olduğundan ekran-okuyucu + heading yapısı için
          görünmez (sr-only) h1. Inline stil → Tailwind'e bağımlı değil. */}
      <h1
        ref={headingRef}
        tabIndex={-1}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
          outline: "none",
        }}
      >
        {data.coupleName
          ? `${data.coupleName} — ${eventHeading(data.locale, data.eventType)}`
          : eventHeading(data.locale, data.eventType)}
      </h1>
      <AtmosphereDefs />
      {showBuyBadge && <BuyBadge meta={meta} />}

      {hydrated && (
        <>
          {hero}

          {showCountdown && (
            <Reveal>
              <CountdownBand meta={meta} date={data.date} />
            </Reveal>
          )}
          {showGallery && (
            <Reveal>
              <PolaroidGallery
                meta={meta}
                photos={data.photos}
                title={data.story.title}
                intro={data.story.body}
              />
            </Reveal>
          )}
          {embed && embed.platform !== "youtube" && (
            <Reveal>
              <MusicEmbedSection meta={meta} embed={embed} />
            </Reveal>
          )}
          {showProgram && (
            <Reveal>
              <ProgramList meta={meta} items={data.schedule} />
            </Reveal>
          )}
          {showVenue && (
            <Reveal>
              <VenueMap meta={meta} data={data} />
            </Reveal>
          )}
          {showGift && data.gift && (
            <Reveal>
              <GiftInfo meta={meta} gift={data.gift} />
            </Reveal>
          )}
          {showHotels && (
            <Reveal>
              <HotelsInfo meta={meta} hotels={data.hotels} />
            </Reveal>
          )}
          {showExtra && (
            <Reveal>
              <ExtraInfo meta={meta} text={data.extraInfo} />
            </Reveal>
          )}
          <Reveal>
            <RsvpForm meta={meta} slug={rsvpSlug} />
          </Reveal>

          <ThemeFooter meta={meta} data={data} reduced={!!reduced} />

          <OpeningCeremony meta={meta} data={data} opened={opened} onOpen={handleOpen} />
          {!embed && audio.available && (
            <AmbientToggle muted={audio.muted} onToggle={audio.toggle} palette={palette} />
          )}
          {embed?.platform === "youtube" && embed.videoId && (
            <YouTubeMusic
              videoId={embed.videoId}
              meta={meta}
              opened={opened}
              start={embed.start}
              playRef={musicPlayRef}
            />
          )}
        </>
      )}
    </div>
    </InvitationI18nProvider>
  );
}

function ThemeFooter({
  meta,
  data,
  reduced,
}: {
  meta: ThemeV2Props["meta"];
  data: ThemeV2Props["data"];
  reduced: boolean;
}) {
  const { palette } = meta;
  return (
    <footer
      className="relative overflow-hidden px-6 py-20"
      style={{ backgroundColor: palette.paper, color: palette.inkSoft }}
    >
      {/* Watermark monogram */}
      <p
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
          fontSize: "clamp(180px, 22vw, 280px)",
          color: palette.ink,
          opacity: 0.04,
          lineHeight: 0.8,
          whiteSpace: "nowrap",
        }}
      >
        {data.monogram}
      </p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9 }}
        className="relative mx-auto max-w-[680px] text-center"
      >
        {/* Botanical doodle */}
        <svg width="80" height="22" viewBox="0 0 80 22" className="mx-auto mb-6">
          <g stroke={palette.accent} strokeWidth="0.9" fill="none" strokeLinecap="round">
            <path d="M 8 14 Q 22 4 40 8 Q 58 4 72 14" />
            <ellipse cx="22" cy="10" rx="3" ry="1.4" fill={palette.accent} fillOpacity="0.5" transform="rotate(-30 22 10)" />
            <ellipse cx="58" cy="10" rx="3" ry="1.4" fill={palette.accent} fillOpacity="0.5" transform="rotate(30 58 10)" />
            <circle cx="40" cy="8" r="2.2" fill={palette.accent} fillOpacity="0.7" />
          </g>
        </svg>

        <p
          className="font-display italic"
          style={{
            fontSize: "clamp(20px, 2.4vw, 26px)",
            color: palette.ink,
            lineHeight: 1.55,
            letterSpacing: "0.005em",
            filter: "url(#ink-bleed)",
          }}
        >
          {data.footerNote}
        </p>

        <div
          className="mx-auto my-7 h-px w-12 opacity-40"
          style={{ background: palette.ink }}
        />

        <p
          style={{
            fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
            fontSize: "clamp(30px, 4vw, 44px)",
            color: palette.ink,
            lineHeight: 0.95,
          }}
        >
          {data.partnerOne} & {data.partnerTwo}
        </p>
        <p
          className="mt-3 text-[10px] uppercase opacity-65"
          style={{ letterSpacing: "0.42em" }}
        >
          {data.date.day} {data.date.month} {data.date.year} · {data.venue.name}
        </p>

        <p
          className="mt-10 text-[9.5px] uppercase opacity-60"
          style={{ letterSpacing: "0.46em" }}
        >
          NUVE · {meta.name} edisyonu
        </p>
      </motion.div>
    </footer>
  );
}

function BuyBadge({ meta }: { meta: ThemeV2Props["meta"] }) {
  return (
    <a
      href="/#fiyat"
      className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-[11px] backdrop-blur transition hover:scale-[1.02]"
      style={{
        backgroundColor: "rgba(255,255,255,0.82)",
        border: `1px solid ${meta.palette.ink}1a`,
        color: meta.palette.ink,
        letterSpacing: "0.04em",
        boxShadow: "0 4px 16px -6px rgba(0,0,0,0.18)",
      }}
    >
      <span style={{ color: meta.palette.accent }}>♥</span>
      <span>
        <span className="font-display italic">{meta.name}</span>
        <span
          className="ml-2 text-[9px] uppercase opacity-70"
          style={{ letterSpacing: "0.32em" }}
        >
          Satın Al
        </span>
      </span>
    </a>
  );
}
