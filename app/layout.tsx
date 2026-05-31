import type { Metadata, Viewport } from "next";
import {
  Inter_Tight,
  Cormorant_Garamond,
  Pinyon_Script,
} from "next/font/google";
import "./globals.css";
import { CursorRing } from "@/components/effects/cursor-ring";
import { LocaleProvider } from "@/lib/i18n/provider";
import { CurrencyProvider } from "@/lib/currency/provider";
import { LenisProvider } from "@/lib/motion/lenis-provider";
import { AudioProvider } from "@/lib/audio/audio-context";
import { MotionConfig } from "framer-motion";
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
  productSchema,
} from "@/components/seo/json-ld";

/**
 * Body: Inter Tight — modern grotesk, default body across NUVE.
 */
const inter = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Default editorial display — Cormorant Garamond.
 * Drives the brand chrome (nav, hero, landing). Editions can override
 * via their own --font-edition variable in [data-edition="..."] scope.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Calligraphy script for couple names (Pinyon Script).
 * Stroke-by-stroke SVG isim animasyonunda kullanılır — romantik, resmî
 * düğün kaligrafisi. (Legacy edition fontları FAZ legacy-retirement'ta
 * kaldırıldı; themes-v2 yalnızca --font-display + --font-calligraphy kullanır.)
 */
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-calligraphy",
  weight: ["400"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.co";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "NUVE · Dijital Davetiye Stüdyosu",
    template: "%s · NUVE",
  },
  description:
    "Niyetle yazılmış dijital düğün davetiyeleri. Elde yapılır, 48 saatte teslim edilir. RSVP, çok dilli, kendi alan adın — hepsi dahil.",
  keywords: [
    "düğün davetiyesi",
    "dijital davetiye",
    "wedding invitation",
    "save the date",
    "RSVP",
    "premium wedding",
  ],
  authors: [{ name: "NUVE Studio" }],
  creator: "NUVE Studio",
  publisher: "NUVE Studio",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US", "sr_RS"],
    title: "NUVE — Premium Dijital Davetiye, €39.99 (Hepsi Dahil)",
    description:
      "Düğün, doğum günü, baby shower… her etkinlik için premium dijital davetiye. AI özel kapak, RSVP, harita, müzik, çoklu dil — tek paket €39.99.",
    siteName: "NUVE",
    url: BASE_URL,
    // og:image — app/opengraph-image.tsx (file convention) sağlar.
  },
  twitter: {
    card: "summary_large_image",
    title: "NUVE — Premium Dijital Davetiye",
    description: "€39.99 · Her etkinlik dahil · AI özel kapak + RSVP + harita + müzik.",
    // twitter:image — opengraph-image.tsx'e düşer (file convention).
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "tr-TR": BASE_URL,
      "en-US": `${BASE_URL}/en`,
    },
  },
};

/* FAZ A.1 — viewport-fit=cover so iOS extends content behind the
   home indicator / notch; safe-area-inset-* vars then drive padding
   on bottom-sticky UI (FloatingControls, LiveRsvpCounter). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F6F1EA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={[
        inter.variable,
        cormorant.variable,
        pinyon.variable,
      ].join(" ")}
    >
      <body>
        {/* JSON-LD structured data — Organization + WebSite + Product.
            Tüm sayfalarda mevcut, Google/ChatGPT/Perplexity için
            yapısal arama görünürlüğü. */}
        <JsonLd
          data={[organizationSchema(), websiteSchema(), productSchema()]}
        />

        {/* FAZ C.8 — skip link for keyboard users. Hidden until focused. */}
        <a href="#main" className="skip-link">
          Ana içeriğe atla
        </a>
        <MotionConfig reducedMotion="user">
          <LenisProvider>
            <AudioProvider>
              <LocaleProvider>
                <CurrencyProvider>
                  <CursorRing />
                  {children}
                </CurrencyProvider>
              </LocaleProvider>
            </AudioProvider>
          </LenisProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
