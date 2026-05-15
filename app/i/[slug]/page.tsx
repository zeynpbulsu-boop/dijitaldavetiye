import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation } from "@/lib/db/types";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { themeForSlug } from "@/lib/templates/themes";
import { InvitationView } from "./_invitation-view";

/**
 * /i/[slug] — public invitation page.
 *
 * Server component:
 *   - loads the live invitation by slug
 *   - resolves the theme by template_slug
 *   - hands data + theme to <InvitationView /> (client) for the
 *     actual rendering with framer-motion animations.
 *
 * Only invitations with `status = 'live'` are rendered; everything
 * else 404s. The visitor never sees draft or archived rows here.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadLive(slug: string): Promise<Invitation | null> {
  const supabase = adminDb();
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .single<Invitation>();
  if (error || !data) return null;
  if (data.status !== "live") return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const inv = await loadLive(params.slug);
  if (!inv) return { title: "NUVE" };
  const couple =
    inv.partner_one_name && inv.partner_two_name
      ? `${inv.partner_one_name} & ${inv.partner_two_name}`
      : "Bir Davet";
  return {
    title: `${couple} — NUVE`,
    description: `${couple} · NUVE digital wedding invitation.`,
    robots: { index: false, follow: false },
  };
}

export default async function PublicInvitationPage({
  params,
}: {
  params: { slug: string };
}) {
  const inv = await loadLive(params.slug);
  if (!inv) notFound();

  const t = dictionaries[inv.locale];
  const theme = themeForSlug(inv.template_slug);

  const localeTag =
    inv.locale === "tr" ? "tr-TR" : inv.locale === "sr" ? "sr-RS" : "en-US";
  const dateLine = inv.wedding_date
    ? new Date(inv.wedding_date).toLocaleDateString(localeTag, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const weekday = inv.wedding_date
    ? new Date(inv.wedding_date).toLocaleDateString(localeTag, {
        weekday: "long",
      })
    : null;

  const monogram =
    inv.monogram_initials ||
    (inv.partner_one_name && inv.partner_two_name
      ? `${inv.partner_one_name[0]}&${inv.partner_two_name[0]}`
      : "N");

  return (
    <InvitationView
      inv={inv}
      theme={theme}
      t={t}
      dateLine={dateLine}
      weekday={weekday}
      monogram={monogram}
    />
  );
}
