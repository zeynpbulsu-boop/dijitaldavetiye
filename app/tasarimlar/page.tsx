import type { Metadata } from "next";
import { Nav } from "../_sections/nav";
import { Footer } from "../_sections/footer";
import { ScrollProgress } from "../_sections/scroll-progress";
import { StickyCta } from "../_sections/sticky-cta";
import { ShowcaseGrid } from "@/components/themes-v2/showcase-grid";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";

/**
 * /tasarimlar — 7 v2 tasarım koleksiyonu.
 *
 * SVG-tabanlı, sıfırdan yazılmış 7 imza şablonu:
 * Çelenk, Polaroid, Kurdele, Fener, Defter, Geceyarısı, Postakart.
 * Her birinin kendi imza animasyonu, dokusu ve hikâyesi var.
 */

export const metadata: Metadata = {
  title: "Düğün Davetiyesi Şablonları — 7 imza tasarım",
  description:
    "NUVE'nin yedi imza dijital düğün davetiyesi şablonu — Çelenk, Polaroid, Kurdele, Fener, Defter, Geceyarısı, Postakart. RSVP, harita, müzik ve çoklu dil dahil. Canlı önizle.",
  keywords: [
    "düğün davetiyesi şablonları",
    "dijital düğün davetiyesi",
    "online davetiye",
    "e-davetiye örnekleri",
    "düğün davetiyesi tasarımları",
  ],
  alternates: { canonical: "/tasarimlar" },
  openGraph: {
    title: "NUVE — 7 imza düğün davetiyesi şablonu",
    description: "SVG ile çizilmiş, doğal dokulu premium dijital davetiyeler.",
    url: "/tasarimlar",
    type: "website",
  },
};

export default function TasarimlarPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", path: "/" },
          { name: "Tasarımlar", path: "/tasarimlar" },
        ])}
      />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <ShowcaseGrid />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
