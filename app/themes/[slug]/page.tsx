import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getThemeV2, SAMPLE_DATA, listThemesV2 } from "@/lib/themes-v2/registry";
import type { ThemeV2Slug } from "@/lib/themes-v2/types";
import { ThemeRenderer } from "@/components/themes-v2/theme-renderer";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";

export const dynamic = "force-static";

export function generateStaticParams() {
  return listThemesV2().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const meta = getThemeV2(params.slug as ThemeV2Slug);
  if (!meta)
    return { title: "Tasarım bulunamadı", robots: { index: false, follow: false } };

  // Template showcase sayfaları = birincil SEO. Indexlenebilir + öz-canonical
  // + anahtar-kelime zengin başlık/açıklama. (Sitemap'te de priority 0.9.)
  const canonical = `/themes/${meta.slug}`;
  const ogTitle = `${meta.name} — Dijital Düğün Davetiyesi Şablonu`;
  const description = `${meta.tagline} — ${meta.name} temasını canlı önizle; RSVP, harita, müzik ve çoklu dil dahil premium dijital düğün davetiyeni dakikalar içinde oluştur.`;
  return {
    title: `${meta.name} — Dijital Düğün Davetiyesi Şablonu`,
    description,
    keywords: [
      `${meta.name} davetiye`,
      "dijital düğün davetiyesi",
      "düğün davetiyesi şablonu",
      "online davetiye",
      "e-davetiye",
    ],
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: meta.tagline,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: meta.tagline,
    },
  };
}

// Demo'da müziği göstermek için örnek — YouTube linki (mühre basınca ARKADA
// otomatik çalar, resmi oynatıcı = telif lisanslı). Gerçek davetiyede çift kendi
// şarkı linkini editörden ekler (music_url). YouTube → otomatik; Spotify/Apple → elle.
const SAMPLE_SONG = "https://www.youtube.com/watch?v=2Vv-BfVoq4g&t=60";

export default function ThemePreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const meta = getThemeV2(params.slug as ThemeV2Slug);
  if (!meta) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", path: "/" },
          { name: "Tasarımlar", path: "/tasarimlar" },
          { name: meta.name, path: `/themes/${meta.slug}` },
        ])}
      />
      <ThemeRenderer meta={meta} data={SAMPLE_DATA} musicSrc={SAMPLE_SONG} showBuyBadge />
    </>
  );
}
