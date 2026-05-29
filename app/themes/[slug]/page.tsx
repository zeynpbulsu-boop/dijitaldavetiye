import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getThemeV2, SAMPLE_DATA, listThemesV2 } from "@/lib/themes-v2/registry";
import type { ThemeV2Slug } from "@/lib/themes-v2/types";
import { ThemeRenderer } from "@/components/themes-v2/theme-renderer";

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
  if (!meta) return { title: "Tasarım bulunamadı" };
  return {
    title: `${meta.name} — Önizleme`,
    description: meta.tagline,
    robots: { index: false, follow: false },
  };
}

export default function ThemePreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const meta = getThemeV2(params.slug as ThemeV2Slug);
  if (!meta) notFound();
  return <ThemeRenderer meta={meta} data={SAMPLE_DATA} showBuyBadge />;
}
