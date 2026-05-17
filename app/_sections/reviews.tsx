/**
 * Reviews — landing'de sosyal kanıt section'ı.
 *
 * The Digital Invite + Pressed Love modeli: avatar (initials) + isim
 * + "verified" rozeti + tarih + içerik + ülke pin'i (emoji flag).
 *
 * Server component. fetchPublishedReviews()'i çağırır; veri yoksa
 * section komple gizlenir (landing'de boşluk bırakmamak için).
 *
 * Yeni yorum yazma akışı buraya bağlı değil — moderation gerektiği
 * için admin Supabase Studio'dan elle published=true yapacak. Public
 * "Write a review" formu ileride opsiyonel.
 */

import { fetchPublishedReviews, flagFromCountryCode } from "@/lib/reviews";

function initialsOf(name: string): string {
  return name
    .split(/\s|&/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function ReviewsSection() {
  const reviews = await fetchPublishedReviews(6);
  if (reviews.length === 0) return null;

  /* Ortalama puan + toplam */
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = (sum / reviews.length).toFixed(2);

  return (
    <section
      id="yorumlar"
      className="relative bg-bg-alt px-5 py-20 sm:px-6 sm:py-28 lg:py-36"
    >
      <div className="container-wide max-w-[1200px]">
        <header className="mb-12 text-center sm:mb-16">
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-cognac">
            — Çiftlerimiz Anlatıyor
          </span>
          <h2
            className="mt-3 font-display text-brand-ink"
            style={{
              fontSize: "clamp(28px, 4.2vw, 48px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Dünyadan çiftler tarafından sevildi
          </h2>
          <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-brand-ink/15 bg-paper px-5 py-2 text-[12px] text-brand-mute">
            <span className="font-display text-[18px] text-brand-cognac">
              {avg}
            </span>
            <span aria-hidden>★★★★★</span>
            <span className="uppercase tracking-[0.18em]">
              {reviews.length} doğrulanmış yorum
            </span>
          </div>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => {
            const flag = flagFromCountryCode(r.country_code);
            return (
              <li
                key={r.id}
                className="flex flex-col gap-3 rounded-md border border-brand-ink/10 bg-paper p-5 shadow-ed-sm"
              >
                <header className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-cognac/10 text-[12px] font-medium text-brand-cognac"
                    >
                      {initialsOf(r.name)}
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-brand-ink">
                        {r.name}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-brand-mute">
                        {formatDate(r.created_at)}
                        {r.verified && (
                          <>
                            {" · "}
                            <span className="text-brand-cognac">
                              Doğrulandı
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <span
                    aria-label={`${r.rating} yıldız`}
                    className="text-[12px] text-brand-cognac"
                  >
                    {"★".repeat(r.rating)}
                  </span>
                </header>
                <p className="text-[14px] leading-[1.7] text-brand-ink/85">
                  {r.content}
                </p>
                {r.country && (
                  <p className="text-[11px] uppercase tracking-[0.18em] text-brand-mute">
                    {flag ? `${flag}  ` : "📍 "}
                    {r.country}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
