import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.co";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* FAZ C.7 — token-gated routes (/admin, /editor) and personal
           invitations (/i) must not be indexed. /api and /order are
           server endpoints that don't serve crawlable HTML. */
        disallow: ["/admin/", "/editor/", "/i/", "/api/", "/order/", "/checkout/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
