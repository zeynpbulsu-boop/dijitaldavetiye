import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation } from "@/lib/db/types";
import {
  isInvitationLive,
  isInvitationExpired,
} from "@/lib/db/lifecycle";
import { ThemeRenderer } from "@/components/themes-v2/theme-renderer";
import { invitationToThemeV2 } from "@/lib/themes-v2/bridge";
import { invitationStrings } from "@/lib/themes-v2/i18n";

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
): Promise<{ inv: Invitation | null; expired: boolean; locale?: string }> {
  try {
    const supabase = adminDb();
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("slug", slug)
      .single<Invitation>();
    if (error || !data) return { inv: null, expired: false };
    // Önizleme: geçerli admin_token ile (panelden) draft/paid davetiye de görünür.
    if (previewToken && previewToken === data.admin_token) {
      return { inv: data, expired: false };
    }
    const nowMs = Date.now();
    if (isInvitationLive(data.status, data.live_until, nowMs)) {
      return { inv: data, expired: false };
    }
    // 1 yıl dolmuş (live/archived + live_until geçmiş) → şık "süresi doldu" sayfası.
    return {
      inv: null,
      expired: isInvitationExpired(data.status, data.live_until, nowMs),
      locale: data.locale,
    };
  } catch (err) {
    console.warn("[i] loadLive failed:", err);
    return { inv: null, expired: false };
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { inv } = await loadLive(params.slug);
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
  const { inv, expired, locale } = await loadLive(params.slug, searchParams?.token);
  if (!inv) {
    if (expired) return <ExpiredInvitation locale={locale} />;
    notFound();
  }

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

/** 1 yılı dolmuş (arşivlenmiş) davetiye için şık, markalı sayfa — çıplak 404 yerine.
 *  Davetiyenin diline göre yerelleştirilir (TR/EN/SR). */
function ExpiredInvitation({ locale }: { locale?: string }) {
  const t = invitationStrings(locale).expired;
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.5em] text-brand-cognac">
        NUVE
      </p>
      <h1
        className="mt-8 font-display text-brand-ink"
        style={{
          fontSize: "clamp(30px, 6vw, 60px)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          fontWeight: 300,
        }}
      >
        {t.titleA}
        <br />
        <span className="italic text-brand-cognac">{t.titleB}</span>
      </h1>
      <p className="mt-7 max-w-[44ch] text-[15px] leading-[1.8] text-brand-mute">
        {t.body}
      </p>
      <a
        href="/"
        className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-full border border-brand-ink/30 px-7 text-[11px] uppercase tracking-[0.28em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
      >
        {t.cta}
      </a>
    </main>
  );
}
