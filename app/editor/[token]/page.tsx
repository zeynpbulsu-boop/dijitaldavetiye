import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation } from "@/lib/db/types";
import { EditorForm } from "./_form";
import { GuestList } from "./_guest-list";
import { MediaSection } from "./_media";
import { HotelsSection } from "./_hotels";
import { EditorPreviewSticky } from "./_preview-iframe";

/**
 * /editor/[token] — couple-facing editor — FAZ A.4.
 *
 * Same access model as /admin/[token]: the unique admin_token in the
 * URL is the only credential. We deliberately do NOT go through
 * Supabase Auth + RLS for v1 — the email-link pattern keeps the
 * onboarding flow to "open this link, edit your invitation, save."
 *
 * For luxe slugs (aethel, nocturne, ...) the editor shows the
 * extra copy fields that LuxeEditionDemo consumes (greeting, eyebrow,
 * CTAs, footer note, music track). Non-luxe slugs hide those — they'd
 * just sit in the DB unused.
 *
 * Live preview is a "Preview" link to /i/[slug]. An inline iframe was
 * scoped out for v1 — the page already revalidates on save, so the
 * preview tab refreshes naturally.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Düzenle · NUVE",
  robots: { index: false, follow: false },
};

async function loadByToken(token: string): Promise<Invitation | null> {
  try {
    const supabase = adminDb();
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("admin_token", token)
      .single<Invitation>();
    if (error || !data) return null;
    return data;
  } catch (err) {
    /* Supabase env eksik / unreachable → 404 fallback, 500 leak yok. */
    console.warn("[editor] loadByToken failed:", err);
    return null;
  }
}

export default async function EditorPage({
  params,
}: {
  params: { token: string };
}) {
  const token = decodeURIComponent(params.token);
  const inv = await loadByToken(token);
  if (!inv) notFound();

  return (
    <main className="min-h-[80vh] bg-bg py-12 lg:py-20">
      <div className="container-wide max-w-[1400px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
          {/* LEFT — form chain */}
          <div>
            <header className="mb-10 border-b border-brand-ink/12 pb-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
                — Düzenleyici
              </span>
              <h1
                className="mt-3 font-display text-brand-ink"
                style={{
                  fontSize: "clamp(32px, 4.5vw, 48px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.022em",
                }}
              >
                Davetiyenizi düzenleyin
              </h1>
              <p className="mt-3 max-w-[640px] text-[14px] leading-[1.7] text-brand-mute">
                Değişiklikler kaydet butonuna bastığınızda yayına alınır.{" "}
                <a
                  href={`/i/${inv.slug}`}
                  target="_blank"
                  rel="noopener"
                  data-cursor="open"
                  data-cursor-label="Tam ekran"
                  className="link-line text-brand-ink"
                >
                  Yayındaki sayfayı tam ekran aç ↗
                </a>
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] uppercase tracking-[0.2em] text-brand-mute">
                <span>
                  Şablon:{" "}
                  <span className="text-brand-ink">{inv.template_slug}</span>
                </span>
                <span>
                  Slug: <span className="text-brand-ink">/i/{inv.slug}</span>
                </span>
              </div>
            </header>

            <EditorForm token={token} invitation={inv} />

            <hr className="my-14 border-brand-ink/12" />

            <MediaSection
              token={token}
              heroMediaUrl={inv.hero_media_url}
              photos={Array.isArray(inv.photos) ? inv.photos : []}
            />

            <hr className="my-14 border-brand-ink/12" />

            <HotelsSection
              token={token}
              hotels={Array.isArray(inv.hotels) ? inv.hotels : []}
            />

            <hr className="my-14 border-brand-ink/12" />

            <GuestList token={token} />
          </div>

          {/* RIGHT — sticky live preview iframe (desktop only) */}
          <EditorPreviewSticky slug={inv.slug} />
        </div>
      </div>
    </main>
  );
}
