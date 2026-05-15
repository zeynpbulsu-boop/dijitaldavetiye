import { Nav } from "./_sections/nav";
import { ScrollProgress } from "./_sections/scroll-progress";
import { FloatingMotifs } from "@/components/ornaments/floating-motifs";
import { Hero } from "./_sections/hero";
import { TemplateCarousel } from "./_sections/template-carousel";
import { HowItWorks } from "./_sections/how-it-works";
import { MusicBlock } from "./_sections/music-block";
import { CollectionNote } from "./_sections/collection-note";
import { Seal } from "./_sections/seal";
import { Ceremonies } from "./_sections/ceremonies";
import { Manifesto } from "./_sections/manifesto";
import { Testimonials } from "./_sections/testimonials";
import { PaperVsDigital } from "./_sections/paper-vs-digital";
import { Pricing } from "./_sections/pricing";
import { Faq } from "./_sections/faq";
import { ClosingCta } from "./_sections/closing-cta";
import { Footer } from "./_sections/footer";

/**
 * NUVE home page — full narrative arc.
 *
 * Sticky chrome: Nav + thin scroll-progress bar (z-50 / z-60).
 * Flow: introduce → show → explain → emote → prove → price → answer → ask.
 *
 *   1. Hero               — niyet
 *   2. TemplateCarousel   — koleksiyon (id=themes)
 *   3. HowItWorks         — 4 adım   (id=how-it-works)
 *   4. MusicBlock         — bir detay
 *   5. CollectionNote     — anlat
 *   6. Seal               — monogram
 *   7. Ceremonies         — açılış jestleri
 *   8. Manifesto          — markanın ruhu (id=manifesto)
 *   9. Testimonials       — sosyal kanıt
 *  10. Pricing            — üç paket (id=pricing)
 *  11. Faq                — 6 soru   (id=faq)
 *  12. ClosingCta         — büyük çağrı
 *  13. Footer             — KVKK + iletişim (id=footer)
 */
export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <FloatingMotifs />
      <Nav />
      <main>
        <Hero />
        <TemplateCarousel />
        <HowItWorks />
        <MusicBlock />
        <CollectionNote />
        <Seal />
        <Ceremonies />
        <Manifesto />
        <Testimonials />
        <PaperVsDigital />
        <Pricing />
        <Faq />
        <ClosingCta />
        <Footer />
      </main>
    </>
  );
}
