import { Nav } from "./_sections/nav";
import { ScrollProgress } from "./_sections/scroll-progress";
import { FloatingMotifs } from "@/components/ornaments/floating-motifs";
import { JsonLd, faqSchema } from "@/components/seo/json-ld";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { Hero } from "./_sections/hero";
import { TemplateCarousel } from "./_sections/template-carousel";
import { HowItWorks } from "./_sections/how-it-works";
import { PrivateDashboard } from "./_sections/private-dashboard";
import { Pricing } from "./_sections/pricing";
import { ReviewsSection } from "./_sections/reviews";
import { ForProfessionals } from "./_sections/for-professionals";
import { Faq } from "./_sections/faq";
import { ClosingCta } from "./_sections/closing-cta";
import { Footer } from "./_sections/footer";
import { StickyCta } from "./_sections/sticky-cta";

/**
 * NUVE home page — conversion-focused landing.
 *
 * Akış:
 *   1. Hero              — H1 + trust + 2 CTA
 *   2. TemplateCarousel  — Edition cards
 *   3. HowItWorks        — 3 adım
 *   4. PrivateDashboard  — admin panel + faydalar
 *   5. Pricing           — Tek paket €39.99
 *   6. ReviewsSection    — Doğrulanmış yorumlar
 *   7. ForProfessionals  — B2B white-label
 *   8. Faq               — Sıkça sorulanlar
 *   9. ClosingCta        — Büyük çağrı
 *  10. Footer            — KVKK + iletişim
 *
 * PaperVsDigital section'ı kaldırıldı — kâğıt-davetiye karşılaştırması
 * conversion noise yaratıyordu, tek paket modeline geçişle gereksiz.
 */
export default function HomePage() {
  /* FAQ JSON-LD — Turkish (default locale) FAQ items injected for GEO
     (Google + ChatGPT + Perplexity yapısal yanıtlar için). */
  const faqItems = dictionaries.tr.faq.items.map((it) => ({
    question: it.q,
    answer: it.a,
  }));

  return (
    <>
      <JsonLd data={faqSchema(faqItems)} />
      <ScrollProgress />
      <FloatingMotifs />
      <Nav />
      <main id="main">
        <Hero />
        <TemplateCarousel />
        <HowItWorks />
        <PrivateDashboard />
        <Pricing />
        <ReviewsSection />
        <ForProfessionals />
        <Faq />
        <ClosingCta />
        <Footer />
      </main>
      <StickyCta />
    </>
  );
}
