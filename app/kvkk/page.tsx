import type { Metadata } from "next";

/**
 * /kvkk — FAZ D.8 placeholder.
 *
 * Minimal Turkish KVKK notice. The footer of every luxe invitation
 * links here; if the footer mentions KVKK, the page MUST exist or we
 * eat a 404 the first time anyone Tab-navigates the legal block.
 *
 * Real legal copy belongs to legal, not engineering — this is the
 * structural shell with a contact line, ready for them to swap in.
 */

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "NUVE platformunun 6698 sayılı KVKK kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
};

export default function KvkkPage() {
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
            KVKK Aydınlatma Metni
          </h1>
        </header>

        <section className="space-y-5 text-[15px] leading-[1.8] text-brand-ink/85">
          <p>
            NUVE platformu, 6698 sayılı Kişisel Verilerin Korunması Kanunu
            (&ldquo;KVKK&rdquo;) kapsamında veri sorumlusu sıfatıyla, sunulan
            hizmetin gerektirdiği kişisel verileri yalnızca davetiyenin
            hazırlanması, paylaşılması ve RSVP yanıtlarının toplanması
            amacıyla işler.
          </p>
          <p>
            <strong>İşlenen veriler:</strong> çiftin adları, düğün tarihi ve
            yeri, monogram, müzik tercihi, davetli adı, e-posta, katılım
            tercihi (evet / hayır / belki), eşlikçi adı, menü ve alerji
            notları, özel mesaj.
          </p>
          <p>
            <strong>İşleme amacı ve hukuki sebep:</strong> KVKK madde 5/2(c)
            uyarınca sözleşmenin kurulması ve ifası için zorunlu olan ölçüde,
            ve madde 5/2(f) uyarınca meşru menfaatler kapsamında.
          </p>
          <p>
            <strong>Aktarım:</strong> Veriler Avrupa Birliği üyesi bir ülkede
            (Supabase, eu-north-1) saklanır. Üçüncü kişilerle ticari amaçla
            paylaşılmaz.
          </p>
          <p>
            <strong>Saklama süresi:</strong> Davetiye yayında olduğu süre
            boyunca + 12 ay; sonrasında anonimleştirilir veya silinir.
          </p>
          <p>
            <strong>Haklarınız:</strong> KVKK madde 11 kapsamında verilerinize
            erişme, düzeltme, silme veya işlemeye itiraz etme haklarına
            sahipsiniz. Talepleriniz için{" "}
            <a href="mailto:hello@nuve.co" className="link-line text-brand-ink">
              hello@nuve.co
            </a>{" "}
            adresine yazabilirsiniz.
          </p>
        </section>
      </article>
    </main>
  );
}
