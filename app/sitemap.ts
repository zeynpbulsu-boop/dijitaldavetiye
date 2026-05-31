import type { MetadataRoute } from "next";
import { listThemesV2 } from "@/lib/themes-v2/registry";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.co"
).replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // themes-v2 demo sayfaları — asıl ürün showcase (sinematik canlı demolar).
  const themeUrls: MetadataRoute.Sitemap = listThemesV2().map((t) => ({
    url: `${BASE_URL}/themes/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Legal sayfalar — KVKK/footer linkli olduğu için indexable.
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
    {
      url: `${BASE_URL}/tasarimlar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...legalUrls,
  ];
}
