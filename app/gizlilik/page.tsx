import type { Metadata } from "next";

/**
 * /gizlilik — FAZ D.8 placeholder.
 *
 * Plain-language Turkish privacy summary that complements the formal
 * KVKK page. Same caveat: legal copy is owned by legal — this is the
 * shell so the footer link doesn't 404.
 */

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "NUVE'nin kişisel verilerinizi nasıl topladığı, sakladığı ve kullandığına dair sade bir özet.",
};

export default function PrivacyPage() {
  return (
    <main id="main" className="min-h-[80vh] bg-bg py-16 lg:py-24">
      <article className="container-narrow prose prose-stone max-w-[760px]">
        <header className="mb-10 border-b border-brand-ink/12 pb-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
            — Yasal
          </span>
          <h1
            className="mt-3 font-display text-brand-ink"
            style={{
              fontSize: "clamp(32px, 4.5vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Gizlilik
          </h1>
          <p className="mt-3 text-[14px] text-brand-mute">
            Resmi KVKK metni{" "}
            <a href="/kvkk" className="link-line text-brand-ink">
              burada
            </a>
            .
          </p>
        </header>

        <section className="space-y-5 text-[15px] leading-[1.8] text-brand-ink/85">
          <h2 className="!mt-8 !font-display text-[22px] text-brand-ink">
            Ne saklarız
          </h2>
          <p>
            Sadece davetiyenizin çalışması için gerekli olanları: çiftin
            adları, tarih, mekan, RSVP yanıtları. Daha azını kaydedemeyiz —
            daha fazlasını da istemeyiz.
          </p>

          <h2 className="!mt-8 !font-display text-[22px] text-brand-ink">
            Nerede saklanır
          </h2>
          <p>
            Avrupa Birliği üyesi bir ülkede (Supabase, Stockholm bölgesi).
            Üçüncü kişilere satılmaz, paylaşılmaz.
          </p>

          <h2 className="!mt-8 !font-display text-[22px] text-brand-ink">
            Çerezler
          </h2>
          <p>
            Yalnızca temel oturum çerezleri kullanılır. Reklam veya analitik
            izleme çerezi yoktur.
          </p>

          <h2 className="!mt-8 !font-display text-[22px] text-brand-ink">
            Verinizi silmek isterseniz
          </h2>
          <p>
            <a href="mailto:hello@nuve.co" className="link-line text-brand-ink">
              hello@nuve.co
            </a>{" "}
            adresine yazın; en geç 30 gün içinde silinir.
          </p>
        </section>
      </article>
    </main>
  );
}
