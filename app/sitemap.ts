import type { MetadataRoute } from "next";
import { templateMeta } from "@/lib/templates/registry";

/**
 * Sitemap — only real routes. The home page anchors (#themes, #pricing,
 * #faq) are not separate routes, so we don't list them.
 */
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.app"
).replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const templateUrls: MetadataRoute.Sitemap = templateMeta.map((t) => ({
    url: `${BASE_URL}/templates/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* FAZ D.8 — legal pages must be crawlable so the KVKK footer link
     gets indexed instead of orphaned. */
  const legalUrls: MetadataRoute.Sitemap = ["kvkk", "gizlilik"].map((slug) => ({
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
    ...templateUrls,
    ...legalUrls,
  ];
}
