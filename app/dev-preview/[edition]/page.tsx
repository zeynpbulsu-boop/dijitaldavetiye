import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Invitation } from "@/lib/db/types";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { themeForSlug } from "@/lib/templates/themes";
import { EditionRenderer } from "@/components/templates/_shared/edition-renderer";
import { elegantIvoryComposition } from "@/components/templates/elegant-ivory/composition";

/**
 * /dev-preview/[edition] — FAZ 2C visual A/B harness
 *
 * Renders an edition's slot composition against a hardcoded sample
 * Invitation row, so we can visually compare the new EditionRenderer
 * output against the live /i/[slug] monolith without needing a real
 * paid invitation in the database.
 *
 * Currently only `elegant-ivory` is wired — it's the pilot edition.
 * Other slugs 404 until they have a composition.
 *
 * Marked `noindex, nofollow` because this is a developer-facing
 * harness, not a customer-facing page.
 */

const COMPOSITIONS = {
  "elegant-ivory": elegantIvoryComposition,
} as const;

type EditionKey = keyof typeof COMPOSITIONS;

/** Pre-render every known edition at build time. Without this, the
 *  dynamic [edition] segment 404s under Next.js standalone mode
 *  (force-static + no generateStaticParams swallows the route). */
export function generateStaticParams() {
  return (Object.keys(COMPOSITIONS) as EditionKey[]).map((edition) => ({
    edition,
  }));
}

/** Hardcoded sample invitation that mirrors a typical /i/[slug] row.
 *  Locked to elegant-ivory's slug + Turkish locale so the composition
 *  renders against the same DB shape a real customer page would have. */
const SAMPLE_INVITATION: Invitation = {
  id: "preview-elegant-ivory",
  slug: "preview-elegant-ivory",
  template_slug: "elegant-ivory",
  tier: "standard",
  status: "live",

  partner_one_name: "Elif",
  partner_two_name: "Mert",
  wedding_date: "2026-09-12",
  venue_name: "Sait Halim Paşa Yalısı",
  venue_city: "İstanbul",
  venue_address: "Köybaşı Cd. No:117, Sarıyer",

  story_text:
    "Bir Cuma akşamı, küçük bir kahvede tanıştık. Aradan üç yıl geçti — yan yana hâlâ aynı yerdeyiz.",
  music_url: null,
  music_track_id: null,
  monogram_initials: "E&M",
  locale: "tr",

  /* FAZ A.3 luxe copy overrides — null so the bridge falls back to
     the preset in lib/design/luxe-themes.ts when this preview hits
     a luxe slug. */
  greeting: null,
  hero_eyebrow: null,
  hero_cta: null,
  envelope_cta: null,
  footer_note: null,
  music_track: null,
  /* Migration 004 — etkinlik tipi default wedding. */
  event_type: "wedding",
  /* Migration 005 — premium media + theming */
  wax_seal_color: null,
  hero_media_url: null,
  photos: [],
  /* Migration 006 — gift + hotels */
  gift_iban: null,
  gift_bank: null,
  gift_account_holder: null,
  gift_note: null,
  hotels: [],
  /* Migration 007 — venue coords */
  venue_lat: null,
  venue_lng: null,

  owner_email: null,
  owner_phone: null,
  admin_token: "preview",

  dodo_session_id: null,
  dodo_payment_id: null,

  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  paid_at: null,
  live_until: null,
};

export const metadata: Metadata = {
  title: "Edition Preview · NUVE Dev",
  robots: { index: false, follow: false },
};

export default function EditionPreviewPage({
  params,
}: {
  params: { edition: string };
}) {
  const key = params.edition as EditionKey;
  const composition = COMPOSITIONS[key];
  if (!composition) notFound();

  const inv = SAMPLE_INVITATION;
  const theme = themeForSlug(inv.template_slug);
  const messages = dictionaries[inv.locale];

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

  // Minimal InvitationData stand-in so SlotProps.data is satisfied.
  // Slots in pilot scope (cover) read from `invitation` enrichment;
  // future slots that support pure preview mode read from `data`.
  const data = {
    partnerOne: inv.partner_one_name ?? "—",
    partnerTwo: inv.partner_two_name ?? "—",
    date: inv.wedding_date ?? "",
    location: [inv.venue_city, inv.venue_name].filter(Boolean).join(", "),
    venue: inv.venue_name ?? undefined,
    monogram,
    slug: inv.slug,
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      lang={inv.locale}
      style={{ background: theme.bg, color: theme.ink }}
    >
      <div className="pointer-events-none fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
        FAZ 2C · slot preview · {composition.slug}
      </div>

      <EditionRenderer
        composition={composition}
        data={data}
        invitation={inv}
        theme={theme}
        messages={messages}
        locale={inv.locale}
        dateLine={dateLine}
        weekday={weekday}
        monogram={monogram}
      />
    </main>
  );
}
