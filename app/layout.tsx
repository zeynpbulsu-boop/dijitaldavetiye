import type { Metadata, Viewport } from "next";
import {
  Inter_Tight,
  Cormorant_Garamond,
  Playfair_Display,
  DM_Serif_Display,
  Tenor_Sans,
  Fraunces,
  Caveat,
  DM_Sans,
  Pinyon_Script,
  Great_Vibes,
} from "next/font/google";
import "./globals.css";
import { CursorRing } from "@/components/effects/cursor-ring";
import { LocaleProvider } from "@/lib/i18n/provider";

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

/* ─── Edition-specific display fonts ───────────────────────────────
 * Each loads its own CSS variable so editions opt in via globals.css
 * [data-edition="..."] scope. Subset hint stays at latin+latin-ext for
 * Turkish coverage. font-display: swap so layout never blocks.
 */

// Atelier Indigo — traditional luxury serif, art-deco letterpress
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-atelier",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Mansion Lights — Didot stand-in, high-contrast neo-classical
const dmSerif = DM_Serif_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mansion",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

// Bodrum Blue — Aegean clean serif (Ogg stand-in)
const tenor = Tenor_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bodrum",
  weight: ["400"],
  display: "swap",
});

// Aurora display — Fraunces variable, soft optical scaling
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-aurora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Aurora body — DM Sans, modern grotesk
const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-aurora-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

// Olive Grove — signature handwriting (used sparingly for couple names)
const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-signature",
  weight: ["400", "500", "600"],
  display: "swap",
});

// FAZ 5 — Calligraphy script for couple names (Pinyon Script + Great Vibes)
// Used in stroke-by-stroke SVG name animation. Romantic, formal wedding
// calligraphy — completely different from signature handwriting (Caveat).
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-calligraphy",
  weight: ["400"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-calligraphy-alt",
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
    alternateLocale: ["en_US"],
    title: "NUVE — An invitation, made with intention",
    description: "Editorial digital wedding invitations. Made by hand. 48-hour delivery.",
    siteName: "NUVE",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "NUVE",
    description: "An invitation, made with intention.",
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
        playfair.variable,
        dmSerif.variable,
        tenor.variable,
        fraunces.variable,
        dmSans.variable,
        caveat.variable,
        pinyon.variable,
        greatVibes.variable,
      ].join(" ")}
    >
      <body>
        <LocaleProvider>
          <CursorRing />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
