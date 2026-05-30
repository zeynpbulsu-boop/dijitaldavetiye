/**
 * Root marka OG — homepage + kendi OG'si olmayan tüm sayfalar için.
 *
 * Önceden layout metadata `/aethel/cover.jpg` (legacy edisyon) gösteriyordu.
 * Artık generated, themes-v2 flagship "Geceyarısı" paletiyle (lacivert +
 * altın) markaya uygun bir banner. Statik (veri çekmez) → hızlı + güvenilir,
 * sosyal crawler'lar paralel vururken bile.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "NUVE — Premium Dijital Davetiye";

// Geceyarısı (amiral tema) paleti
const C = {
  bg: "#0E1730",
  paper: "#1A2240",
  ink: "#F0E2BF",
  inkSoft: "#A8B0C8",
  accent: "#D4A852",
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `radial-gradient(120% 120% at 50% 20%, ${C.paper} 0%, ${C.bg} 60%)`,
          color: C.ink,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
          fontFamily: "Georgia, serif",
        }}
      >
        {/* İnce altın çerçeve */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: `1px solid ${C.accent}`,
            opacity: 0.4,
          }}
        />

        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: C.accent,
          }}
        >
          NUVE
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 82,
            lineHeight: 1.04,
            letterSpacing: "-0.01em",
            textAlign: "center",
            maxWidth: 1000,
          }}
        >
          Dijital Düğün Davetiyesi
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            letterSpacing: "0.14em",
            color: C.inkSoft,
            textAlign: "center",
          }}
        >
          Sinematik açılış · RSVP · Harita · Müzik · Çoklu dil
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 52,
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 20,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: C.accent,
          }}
        >
          <span>€39.99</span>
          <span
            style={{
              display: "block",
              width: 6,
              height: 6,
              borderRadius: 999,
              background: C.accent,
            }}
          />
          <span>Hepsi dahil</span>
          <span
            style={{
              display: "block",
              width: 6,
              height: 6,
              borderRadius: 999,
              background: C.accent,
            }}
          />
          <span>Aboneliksiz</span>
        </div>
      </div>
    ),
    size,
  );
}
