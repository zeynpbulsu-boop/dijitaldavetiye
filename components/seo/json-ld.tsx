/**
 * JsonLd — server-rendered structured data injection.
 *
 * Schema.org markup helps Google understand the site as a
 * digital wedding invitation product. GEO (Generative Engine
 * Optimization) için de gerekli: ChatGPT/Perplexity/Gemini bu
 * structured data'yı okur ve summarization'ında kullanır.
 */

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.co").replace(
  /\/+$/,
  "",
);

/* Pre-built schemas — sayfa server component'lerinden çağrılır. */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NUVE",
    legalName: "NUVE Studio",
    alternateName: "NUVE Digital Invitations",
    url: BASE_URL,
    logo: `${BASE_URL}/icon`,
    description:
      "Premium dijital düğün ve etkinlik davetiyesi stüdyosu. Tek paket, €39.99 — her etkinlik dahil.",
    sameAs: [
      "https://www.instagram.com/nuvestudio",
      "https://www.tiktok.com/@nuvestudio",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NUVE",
    url: BASE_URL,
    inLanguage: ["tr-TR", "en-US", "sr-RS"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/tasarimlar?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "NUVE Dijital Davetiye",
    description:
      "Düğün, doğum günü, baby shower, nişan ve tüm etkinlikler için premium dijital davetiye. AI özel kapak, RSVP, harita, müzik, çoklu dil — hepsi dahil.",
    brand: { "@type": "Brand", name: "NUVE" },
    // Dinamik OG route'u (statik /og.jpg yoktu → 404'tü).
    image: `${BASE_URL}/opengraph-image`,
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/order/geceyarisi`,
      priceCurrency: "EUR",
      price: "39.99",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
      seller: { "@type": "Organization", name: "NUVE Studio" },
    },
    /* NOT: aggregateRating KASITLI yok. Gerçek yorum birikene kadar
       uydurma puan (FTC/AB sahte-yorum riski + Google rich-snippet) servis
       edilmez. Gerçek veriyle doldurulduğunda buraya eklenebilir. */
  };
}

export function faqSchema(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

/** BreadcrumbList — Google sonuçlarında breadcrumb rich result + gezinme sinyali. */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BASE_URL}${it.path}`,
    })),
  };
}
