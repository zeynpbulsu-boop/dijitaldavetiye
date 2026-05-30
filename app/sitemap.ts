import type { MetadataRoute } from "next";
import { templateMeta } from "@/lib/templates/registry";
import { editionCards } from "@/lib/templates/edition-cards";
import { listThemesV2 } from "@/lib/themes-v2/registry";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.co"
).replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /* Legacy template detail pages */
  const templateUrls: MetadataRoute.Sitemap = templateMeta.map((t) => ({
    url: `${BASE_URL}/templates/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* Dev-preview pages are intentionally noindex; we surface editions
     via /templates/<slug> and /tasarimlar catalog. editionCards used
     above for reference if surfacing new public URLs in the future. */
  void editionCards;
  const editionUrls: MetadataRoute.Sitemap = [];

  /* themes-v2 demo pages — asıl ürün showcase (sinematik canlı demolar).
     Legacy /templates/<slug>'dan yüksek öncelikli; ana indeksleme hedefi. */
  const themeUrls: MetadataRoute.Sitemap = listThemesV2().map((t) => ({
    url: `${BASE_URL}/themes/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  /* Catalog index */
  const catalogUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/tasarimlar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  /* Legal pages — KVKK link footer'da olduğu için indexable. */
  const legalSlugs = [
    "kvkk",
    "gizlilik",
    "legal/terms",
    "legal/privacy",
    "legal/cookies",
    "legal/distance-sales",
    "legal/refunds",
  ];
  const legalUrls: MetadataRoute.Sitemap = legalSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...themeUrls,
    ...catalogUrls,
    ...editionUrls,
    ...templateUrls,
    ...legalUrls,
  ];
}
