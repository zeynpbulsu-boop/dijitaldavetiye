import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation } from "@/lib/db/types";
import { isLuxeSlug } from "@/lib/templates/luxe-bridge";
import { EditorForm } from "./_form";
import { GuestList } from "./_guest-list";

/**
 * /editor/[token] — couple-facing editor — FAZ A.4.
 *
 * Same access model as /admin/[token]: the unique admin_token in the
 * URL is the only credential. We deliberately do NOT go through
 * Supabase Auth + RLS for v1 — the email-link pattern keeps the
 * onboarding flow to "open this link, edit your invitation, save."
 *
 * For luxe slugs (aethel, atelier-indigo, ...) the editor shows the
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
  const supabase = adminDb();
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("admin_token", token)
    .single<Invitation>();
  if (error || !data) return null;
  return data;
}

export default async function EditorPage({
  params,
}: {
  params: { token: string };
}) {
  const token = decodeURIComponent(params.token);
  const inv = await loadByToken(token);
  if (!inv) notFound();

  const showLuxeFields = isLuxeSlug(inv.template_slug);

  return (
    <main className="min-h-[80vh] bg-bg py-12 lg:py-20">
      <div className="container-wide max-w-[920px]">
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
              className="link-line text-brand-ink"
            >
              Yayındaki sayfayı önizle ↗
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

        <EditorForm
          token={token}
          invitation={inv}
          showLuxeFields={showLuxeFields}
        />

        <hr className="my-14 border-brand-ink/12" />

        <GuestList token={token} />
      </div>
    </main>
  );
}
