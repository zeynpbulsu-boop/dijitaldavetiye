import type { Metadata } from "next";
import { Nav } from "../_sections/nav";
import { Footer } from "../_sections/footer";
import { ScrollProgress } from "../_sections/scroll-progress";
import { StickyCta } from "../_sections/sticky-cta";
import { ShowcaseGrid } from "@/components/themes-v2/showcase-grid";

/**
 * /tasarimlar — 7 v2 tasarım koleksiyonu.
 *
 * SVG-tabanlı, sıfırdan yazılmış 7 imza şablonu:
 * Çelenk, Polaroid, Kurdele, Fener, Defter, Geceyarısı, Postakart.
 * Her birinin kendi imza animasyonu, dokusu ve hikâyesi var.
 */

export const metadata: Metadata = {
  title: "Tasarımlar — 7 imza şablonu",
  description:
    "NUVE'nin yedi imza şablonu — Çelenk, Polaroid, Kurdele, Fener, Defter, Geceyarısı, Postakart. Her birinin kendi animasyonu ve karakteri var.",
  openGraph: {
    title: "NUVE — 7 imza şablonu, 7 anı",
    description: "SVG ile çizilmiş, doğal dokulu premium dijital davetiyeler.",
  },
};

export default function TasarimlarPage() {
  return (
    <>
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
