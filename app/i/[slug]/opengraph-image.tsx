/**
 * /i/[slug] OG image — themes-v2 aware.
 *
 * Per-invitation share preview (WhatsApp, iMessage, Telegram, X, FB,
 * Slack). Düğün davetiyeleri sürekli paylaşılır — link önizlemesi
 * davetiyenin KENDİ temasına benzemeli, generic banner değil.
 *
 * Tema çözümü `/i/[slug]` sayfasıyla AYNI yoldan gider
 * (resolveThemeV2Slug): yani önizleme, açılan davetiyeyle birebir
 * aynı paleti kullanır. Legacy slug'lar da bridge üzerinden v2'ye
 * eşlenir, böylece eski davetiyeler bile doğru renkte görünür.
 *
 * `ImageResponse` PNG döndürür; 1200×630 kanonik Open Graph ölçüsü
 * (Twitter `summary_large_image` ile de uyumlu). Supabase'e
 * service-role ile gider; herhangi bir hata olursa nötr krem çipe
 * düşer — boş link önizlemesinden iyidir.
 */

import { ImageResponse } from "next/og";
import { adminDb } from "@/lib/db/supabase";
import { THEMES_V2 } from "@/lib/themes-v2/registry";
import { resolveThemeV2Slug } from "@/lib/themes-v2/bridge";
import type { Invitation } from "@/lib/db/types";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "NUVE — Davetiye";

async function loadLive(slug: string): Promise<Invitation | null> {
  try {
    const supabase = adminDb();
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("slug", slug)
      .single<Invitation>();
    if (error || !data || data.status !== "live") return null;
    return data;
  } catch {
    return null;
  }
}

/** "YYYY-MM-DD" → "DD.MM.YYYY" (locale'den bağımsız, kıramaz). */
function formatDate(raw?: string | null): string {
  if (!raw) return "";
  const [y, m, d] = raw.split("-");
  if (!y || !m || !d) return "";
  return `${d}.${m}.${y}`;
}

const FALLBACK = {
  bg: "#F6F1EA",
  ink: "#1F1B17",
  inkSoft: "#6B5847",
  accent: "#B8895A",
  couple: "NUVE",
};

export default async function Image({ params }: { params: { slug: string } }) {
  const inv = await loadLive(params.slug);
  const theme = inv ? THEMES_V2[resolveThemeV2Slug(inv.template_slug)] : null;
  const pal = theme?.palette;

  const bg = pal?.bg ?? FALLBACK.bg;
  const ink = pal?.ink ?? FALLBACK.ink;
  const inkSoft = pal?.inkSoft ?? FALLBACK.inkSoft;
  const accent = pal?.accent ?? FALLBACK.accent;
  const couple =
    inv?.partner_one_name && inv?.partner_two_name
      ? `${inv.partner_one_name} & ${inv.partner_two_name}`
      : FALLBACK.couple;
  const dateLine = formatDate(inv?.wedding_date);
  const venue = inv?.venue_name ?? "";

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
        {/* İnce accent çerçeve — premium dokunuş */}
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
            marginTop: 52,
            fontSize: 96,
            lineHeight: 1.05,
            letterSpacing: "-0.005em",
            textAlign: "center",
            maxWidth: 980,
          }}
        >
          {couple}
        </div>

        {(dateLine || venue) && (
          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: 24,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: inkSoft,
            }}
          >
            {dateLine && <span>{dateLine}</span>}
            {dateLine && venue && (
              <span
                style={{
                  display: "block",
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: accent,
                }}
              />
            )}
            {venue && <span>{venue}</span>}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 52,
            fontSize: 18,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: accent,
            opacity: 0.7,
          }}
        >
          Dijital Davetiye
        </div>
      </div>
    ),
    size,
  );
}
