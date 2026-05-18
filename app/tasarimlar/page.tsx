import type { Metadata } from "next";
import { Nav } from "../_sections/nav";
import { Footer } from "../_sections/footer";
import { ScrollProgress } from "../_sections/scroll-progress";
import { StickyCta } from "../_sections/sticky-cta";
import { TasarimlarCatalog } from "./_catalog";

/**
 * /tasarimlar — Dedicated edition catalog.
 *
 * bizevleniyoruz.net/tasarimlar paritesi: 10 template (NUVE'de 6 + 1
 * coming soon), kategori chip filtreleri (Tümü / Düğün / Save the
 * Date / Doğum Günü / Nişan), grid layout. Server component meta
 * burada, client interaktif catalog _catalog.tsx'te.
 */

export const metadata: Metadata = {
  title: "Tasarımlar · Tüm Edisyonlar",
  description:
    "NUVE'nin altı luxe edisyonu — Aethel's Chapel, Atelier Indigo, Mansion Lights, Bodrum Blue, Olive Grove, Aurora. Her edisyon kendi mührü, sahnesi ve fontuyla.",
  openGraph: {
    title: "NUVE — Altı edisyon, altı hikâye",
    description: "Premium dijital davetiye edisyonları. Her birinin kendi sahnesi var.",
  },
};

export default function TasarimlarPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <TasarimlarCatalog />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
