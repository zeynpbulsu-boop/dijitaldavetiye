"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta } from "@/lib/themes-v2/types";
import type { MusicEmbed } from "@/lib/themes-v2/music-embed";

const ALLOW: Record<MusicEmbed["platform"], string> = {
  spotify: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
  youtube:
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  apple: "autoplay *; encrypted-media *;",
};

const PLATFORM_LABEL: Record<MusicEmbed["platform"], string> = {
  spotify: "Spotify",
  youtube: "YouTube",
  apple: "Apple Music",
};

/**
 * "Bizim Şarkımız" — çiftin kendi şarkısı, platformun RESMİ lisanslı
 * oynatıcısıyla. Telifli kayıt bizde barınmaz; Spotify/YouTube/Apple çalar.
 */
export function MusicEmbedSection({
  meta,
  embed,
}: {
  meta: ThemeV2Meta;
  embed: MusicEmbed;
}) {
  const { palette } = meta;
  const reduced = useReducedMotion();

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      className="relative px-6 py-24 sm:py-28 lg:py-36"
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      <div className="mx-auto max-w-[560px] text-center">
        <motion.p
          {...reveal(0)}
          className="text-[10px] uppercase sm:text-[10.5px]"
          style={{ color: palette.accent, letterSpacing: "0.5em", fontWeight: 500 }}
        >
          Bizim Şarkımız
        </motion.p>

        <motion.h2
          {...reveal(0.05)}
          className="mt-6 font-display"
          style={{
            fontWeight: 300,
            fontSize: "clamp(28px, 4.6vw, 46px)",
            color: palette.ink,
            lineHeight: 1.12,
          }}
        >
          İlk dansımıza eşlik edin
        </motion.h2>

        <motion.div
          {...reveal(0.12)}
          className="mx-auto my-7 flex items-center justify-center gap-3"
        >
          <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.6 }} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={palette.accent} strokeWidth="1.4">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.6 }} />
        </motion.div>

        <motion.div
          {...reveal(0.2)}
          className="mx-auto overflow-hidden rounded-2xl"
          style={{
            backgroundColor: palette.paper,
            border: `1px solid ${palette.accent}29`,
            boxShadow: "0 20px 54px -30px rgba(0,0,0,0.45)",
          }}
        >
          <iframe
            title="Bizim Şarkımız"
            src={embed.embedUrl}
            width="100%"
            height={embed.height}
            loading="lazy"
            allow={ALLOW[embed.platform]}
            style={{ border: 0, display: "block", borderRadius: 16 }}
          />
        </motion.div>

        <motion.p
          {...reveal(0.28)}
          className="mt-4 text-[10px] uppercase"
          style={{ color: palette.inkSoft, letterSpacing: "0.32em" }}
        >
          {PLATFORM_LABEL[embed.platform]} &middot; çalmak için dokunun
        </motion.p>
      </div>
    </section>
  );
}
