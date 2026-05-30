import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation } from "@/lib/db/types";
import { ThemeRenderer } from "@/components/themes-v2/theme-renderer";
import { invitationToThemeV2 } from "@/lib/themes-v2/bridge";

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

async function loadLive(
  slug: string,
  previewToken?: string,
): Promise<Invitation | null> {
  try {
    const supabase = adminDb();
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("slug", slug)
      .single<Invitation>();
    if (error || !data) return null;
    // Önizleme: geçerli admin_token ile (panelden) draft/paid davetiye de görünür.
    if (previewToken && previewToken === data.admin_token) return data;
    if (data.status !== "live") return null;
    // 1 yıl dolunca (live_until geçmiş) yayından kalkmış say → 404.
    if (data.live_until && new Date(data.live_until).getTime() < Date.now()) {
      return null;
    }
    return data;
  } catch (err) {
    console.warn("[i] loadLive failed:", err);
    return null;
  }
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
  searchParams,
}: {
  params: { slug: string };
  searchParams: { token?: string };
}) {
  const inv = await loadLive(params.slug, searchParams?.token);
  if (!inv) notFound();

  // Production render via the new themes-v2 cinematic system. The bridge maps
  // the invitation row → { meta, data } and resolves any legacy edition slug to
  // the nearest themes-v2 theme, so every live invitation uses the new system.
  const { meta, data } = invitationToThemeV2(inv);

  return (
    <ThemeRenderer
      meta={meta}
      data={data}
      rsvpSlug={inv.slug}
      musicSrc={inv.music_url}
    />
  );
}
