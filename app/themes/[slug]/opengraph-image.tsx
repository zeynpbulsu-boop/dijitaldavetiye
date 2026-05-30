/**
 * /themes/[slug] per-tema OG — demo paylaşım önizlemesi.
 *
 * Kullanıcı bir demo tema linkini paylaştığında (WhatsApp, Instagram DM,
 * potansiyel müşteriye), önizleme o temanın KENDİ paletiyle + adı + örnek
 * çiftle görünür. Statik (7 slug build-time prerender) → hızlı + güvenilir.
 */

import { ImageResponse } from "next/og";
import { THEMES_V2 } from "@/lib/themes-v2/registry";
import { resolveThemeV2Slug } from "@/lib/themes-v2/bridge";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "NUVE — Davetiye teması";

export function generateStaticParams(): { slug: string }[] {
  return Object.keys(THEMES_V2).map((slug) => ({ slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const theme = THEMES_V2[resolveThemeV2Slug(params.slug)];
  const { bg, ink, inkSoft, accent } = theme.palette;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: bg,
          color: ink,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: `1px solid ${accent}`,
            opacity: 0.45,
          }}
        />

        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          NUVE
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 100,
            lineHeight: 1.04,
            letterSpacing: "-0.005em",
            textAlign: "center",
          }}
        >
          Elif &amp; Can
        </div>

        <div
          style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            gap: 22,
            fontSize: 24,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: inkSoft,
          }}
        >
          <span>15 Haziran 2026</span>
          <span
            style={{
              display: "block",
              width: 8,
              height: 8,
              borderRadius: 999,
              background: accent,
            }}
          />
          <span>Cunda Adası</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 50,
            fontSize: 19,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: accent,
            opacity: 0.85,
          }}
        >
          {theme.name} Teması · Demoyu Gör
        </div>
      </div>
    ),
    size,
  );
}
