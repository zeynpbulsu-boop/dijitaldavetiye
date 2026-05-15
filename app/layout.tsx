import type { Metadata } from "next";
import { Inter_Tight, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CursorRing } from "@/components/effects/cursor-ring";
import { LocaleProvider } from "@/lib/i18n/provider";

/**
 * Body: Inter Tight — modern grotesk with tighter optical sizing than regular Inter.
 * More designed, less "system default".
 */
const inter = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Display: Cormorant Garamond — traditional, decorative, romantic.
 * Picked over Fraunces for the bizevleniyoruz.net editorial feel — slower,
 * more ornate, with the airy italic that the brand wants for accents.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <LocaleProvider>
          <CursorRing />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
