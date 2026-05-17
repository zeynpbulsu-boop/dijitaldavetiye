import { Nav } from "./_sections/nav";
import { ScrollProgress } from "./_sections/scroll-progress";
import { FloatingMotifs } from "@/components/ornaments/floating-motifs";
import { Hero } from "./_sections/hero";
import { TemplateCarousel } from "./_sections/template-carousel";
import { HowItWorks } from "./_sections/how-it-works";
import { PrivateDashboard } from "./_sections/private-dashboard";
import { PaperVsDigital } from "./_sections/paper-vs-digital";
import { Pricing } from "./_sections/pricing";
import { ReviewsSection } from "./_sections/reviews";
import { ForProfessionals } from "./_sections/for-professionals";
import { Faq } from "./_sections/faq";
import { ClosingCta } from "./_sections/closing-cta";
import { Footer } from "./_sections/footer";

/**
 * NUVE home page — B2C clean (Pressed Love + TDI paritesi).
 *
 * Önceki yapı: lirik markaya özel akış (Hero → Manifesto → Seal →
 * Ceremonies → Testimonials → vs.). Kullanıcı geri bildirimi:
 * rakiplerin landing'i daha B2C clean — direkt fayda + güven +
 * tanıtım + fiyat + sosyal kanıt + B2B + FAQ.
 *
 * Yeni akış (rakip paritesi):
 *   1. Hero               — H1 + trust + 2 CTA + 16 dil
 *   2. TemplateCarousel   — 6 luxe edition (id=themes)
 *   3. HowItWorks         — 3 adım (id=how-it-works)
 *   4. PrivateDashboard   — mock admin panel + 4 fayda
 *   5. PaperVsDigital     — comparison
 *   6. Pricing            — 4 tier (id=pricing)
 *   7. ReviewsSection     — 6 doğrulanmış yorum (id=yorumlar)
 *   8. ForProfessionals   — B2B white-label
 *   9. Faq                — (id=faq)
 *  10. ClosingCta         — büyük çağrı
 *  11. Footer             — KVKK + iletişim (id=footer)
 *
 * Lirik section'lar (Manifesto, Seal, Ceremonies, MusicBlock,
 * CollectionNote, Testimonials) bilinçli olarak kaldırıldı — landing
 * artık conversion odaklı.
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
        <PrivateDashboard />
        <PaperVsDigital />
        <Pricing />
        <ReviewsSection />
        <ForProfessionals />
        <Faq />
        <ClosingCta />
        <Footer />
      </main>
    </>
  );
}
