import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * /legal/[slug] — KVKK, gizlilik, mesafeli satış, iade vb. metinleri
 * tek dinamik route'tan serve eder. Footer linkleri buradan beslenir.
 *
 * İçerikler genel-amaçlı stub; resmi metinler hukuki danışmandan
 * geçtikten sonra burada update edilir.
 */

interface PageProps {
  params: { slug: string };
}

interface LegalDoc {
  title: string;
  subtitle: string;
  body: Array<{ heading?: string; paragraphs: string[] }>;
}

const DOCS: Record<string, LegalDoc> = {
  terms: {
    title: "Kullanım Şartları",
    subtitle: "Son güncelleme: Mayıs 2026",
    body: [
      {
        heading: "1. Hizmet",
        paragraphs: [
          "NUVE, kullanıcılarına dijital davetiye tasarlama, yayınlama ve RSVP yönetimi imkânı sunan bir platformdur. Tek seferlik €39.99 ödeme ile davetiye 12 ay boyunca yayında kalır.",
          "Hizmet 'olduğu gibi' sunulur. Teknik kesinti durumunda iletişim kanallarımızdan en kısa sürede dönüş yapılır.",
        ],
      },
      {
        heading: "2. Hesap ve İçerik",
        paragraphs: [
          "Davetiye içeriğinin doğruluğundan ve yasalara uygunluğundan kullanıcı sorumludur. NUVE, üçüncü kişilerin haklarını ihlal ettiği tespit edilen içerikleri kaldırma hakkını saklı tutar.",
        ],
      },
      {
        heading: "3. Ödeme ve İade",
        paragraphs: [
          "Ödemeler Dodo Payments üzerinden alınır. 14 gün içinde sorunsuz iade hakkı geçerlidir; bkz. İade Koşulları.",
        ],
      },
      {
        heading: "4. Sözleşme Değişiklikleri",
        paragraphs: [
          "Şartlar zaman zaman güncellenebilir. Önemli değişiklikler e-posta ve site üzerinden duyurulur. Hizmeti kullanmaya devam etmek, güncel şartları kabul anlamına gelir.",
        ],
      },
      {
        paragraphs: [
          "İletişim: info@nuve.app",
        ],
      },
    ],
  },
  privacy: {
    title: "Gizlilik Sözleşmesi",
    subtitle: "Son güncelleme: Mayıs 2026",
    body: [
      {
        heading: "1. Topladığımız veriler",
        paragraphs: [
          "Davetiye oluşturmak için: çift isimleri, etkinlik tarihi, mekân bilgileri, fotoğraflar, RSVP yanıtları, iletişim e-posta/telefonu.",
          "Hizmet tarafında: çerez tabanlı oturum, IP adresi, kullanım analitikleri (anonim).",
        ],
      },
      {
        heading: "2. Kullanım Amacı",
        paragraphs: [
          "Toplanan veriler yalnızca davetiyenin hazırlanması, yayınlanması ve RSVP iletişimi için kullanılır. Üçüncü taraflarla pazarlama amaçlı paylaşılmaz.",
        ],
      },
      {
        heading: "3. Saklama",
        paragraphs: [
          "Davetiye yayında olduğu sürece (12 ay) + son 2 ay arşiv süresi boyunca veriler saklanır. Sonrasında kalıcı olarak silinebilir veya kullanıcı talebiyle erken silinir.",
        ],
      },
      {
        paragraphs: [
          "Veri sahibi hakları için: info@nuve.app",
        ],
      },
    ],
  },
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    subtitle: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında",
    body: [
      {
        heading: "Veri Sorumlusu",
        paragraphs: [
          "NUVE Studio, İstanbul. info@nuve.app",
        ],
      },
      {
        heading: "İşlenen Veriler",
        paragraphs: [
          "Kimlik (çift adları, tarih), iletişim (e-posta, telefon), pazarlama izinli iletişim bilgileri, görsel ve işlem (RSVP yanıtları, ödeme referansı).",
        ],
      },
      {
        heading: "İşleme Amacı",
        paragraphs: [
          "Hizmetin sunulması, sözleşmenin ifası, yasal yükümlülüklerin yerine getirilmesi (faturalama, mesafeli satış mevzuatı).",
        ],
      },
      {
        heading: "Haklarınız",
        paragraphs: [
          "KVKK 11. madde kapsamında verilerinizin işlenmesi, düzeltilmesi, silinmesi ve aktarımı hakkında bilgi alma hakkına sahipsiniz. Talepleriniz için info@nuve.app",
        ],
      },
    ],
  },
  cookies: {
    title: "Çerez Politikası",
    subtitle: "Son güncelleme: Mayıs 2026",
    body: [
      {
        heading: "Hangi çerezleri kullanıyoruz?",
        paragraphs: [
          "Zorunlu (oturum), İşlevsel (tema/dil tercihi, RSVP draft), Analitik (anonim sayfa görüntüleme).",
        ],
      },
      {
        heading: "Pazarlama / üçüncü taraf çerezler",
        paragraphs: [
          "Şu an için pazarlama amaçlı üçüncü taraf çerez kullanılmamaktadır.",
        ],
      },
      {
        heading: "Çerezleri yönetme",
        paragraphs: [
          "Tarayıcınızın ayarlarından çerezleri her zaman silebilir veya engelleyebilirsiniz.",
        ],
      },
    ],
  },
  "distance-sales": {
    title: "Mesafeli Satış Sözleşmesi",
    subtitle: "6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında",
    body: [
      {
        heading: "Satıcı bilgileri",
        paragraphs: ["NUVE Studio · İstanbul · info@nuve.app"],
      },
      {
        heading: "Ürün / Hizmet",
        paragraphs: [
          "Dijital wedding/etkinlik davetiyesi (yazılım servisi). Bedel: €39.99 (KDV dahil).",
        ],
      },
      {
        heading: "Teslim",
        paragraphs: [
          "Ödeme onaylandığı an admin paneli linki ve davetiye yayın linki kullanıcı e-postasına gönderilir.",
        ],
      },
      {
        heading: "Cayma hakkı",
        paragraphs: [
          "Dijital içerik tüketiciye ulaştığı an cayma hakkı sona erer (TKHK m.15/ğ). Yine de 14 gün içinde teknik problem nedeniyle iade talep edilebilir; bkz. İade Koşulları.",
        ],
      },
    ],
  },
  refunds: {
    title: "İade Koşulları",
    subtitle: "14 gün koşulsuz teknik iade garantisi",
    body: [
      {
        heading: "Ne zaman iade alınır?",
        paragraphs: [
          "Davetiyeniz teknik bir sorun nedeniyle yayına alınamadıysa, hizmette kesinti yaşandıysa veya beklenen özellikler çalışmıyorsa 14 gün içinde tam iade.",
        ],
      },
      {
        heading: "Ne zaman iade alınmaz?",
        paragraphs: [
          "Tercih değişikliği (tasarım beğenmedim), içerik hatası (yanlış tarih yazıldı) iade gerekçesi değildir; bu durumlar için sınırsız ücretsiz revizyon.",
        ],
      },
      {
        heading: "Süreç",
        paragraphs: [
          "info@nuve.app adresine iade talebinizi yazın. 1 iş günü içinde dönüş, onay sonrası 3-5 iş günü içinde aynı ödeme yöntemiyle iade.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const doc = DOCS[params.slug];
  if (!doc) return { title: "Bulunamadı" };
  return {
    title: doc.title,
    description: doc.subtitle,
    robots: { index: true, follow: true },
  };
}

export default function LegalPage({ params }: PageProps) {
  const doc = DOCS[params.slug];
  if (!doc) notFound();

  return (
    <main id="main" className="min-h-[80vh] bg-bg py-20 lg:py-28">
      <div className="container-narrow max-w-[760px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-brand-mute hover:text-brand-cognac"
        >
          ← Ana sayfa
        </Link>

        <header className="mt-8 border-b border-brand-ink/12 pb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-cognac">
            — Yasal
          </span>
          <h1
            className="mt-4 font-display text-brand-ink"
            style={{
              fontSize: "clamp(34px, 5vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
            }}
          >
            {doc.title}
          </h1>
          <p className="mt-3 text-[13px] uppercase tracking-[0.22em] text-brand-mute">
            {doc.subtitle}
          </p>
        </header>

        <article className="mt-10 space-y-10">
          {doc.body.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2
                  className="font-display text-brand-ink"
                  style={{
                    fontSize: "clamp(18px, 2vw, 22px)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.012em",
                  }}
                >
                  {section.heading}
                </h2>
              )}
              <div className="mt-3 space-y-3 text-[15px] leading-[1.7] text-brand-ink/80">
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <p className="mt-16 border-t border-brand-ink/10 pt-8 text-[12px] text-brand-mute">
          Bu metin genel-amaçlı bilgilendirme amaçlıdır ve hukuki tavsiye
          niteliği taşımaz. Spesifik durumunuz için lütfen hukuk danışmanınıza
          başvurun.
        </p>
      </div>
    </main>
  );
}
