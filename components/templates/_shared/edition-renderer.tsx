"use client";

/**
 * Edition Renderer — FAZ 2B
 *
 * Reads an EditionComposition + an InvitationData payload and renders
 * each slot in `composition.order`. For every slot, it picks:
 *
 *   1. composition.slots[slot]  → edition's bespoke override
 *   2. DEFAULT_SLOTS[slot]      → shared default (countdown/map/gallery/gift)
 *
 * If neither exists the slot is skipped silently. The composition's
 * buildComposition() validator already prevents missing mandatory
 * overrides at module-load time, so a missing render-time component
 * here means an optional slot (e.g. `story`) the edition chose to
 * include without providing its own component — which we treat as
 * "skip" rather than throw.
 *
 * The outer wrapper sets `data-edition` so the CSS-variable scopes in
 * globals.css apply. Slots inside read those variables via
 * `var(--edition-*)` and adopt the edition's palette / typography
 * automatically.
 */

import type { InvitationData } from "@/lib/templates/types";
import type { Invitation, DbLocale } from "@/lib/db/types";
import type { InvitationTheme } from "@/lib/templates/themes";
import type { Messages } from "@/lib/i18n/types";
import type { EditionComposition } from "./composition";
import { DEFAULT_SLOTS } from "./default-slots";

export interface EditionRendererProps {
  composition: EditionComposition;
  data: InvitationData;
  /** Demo banner when previewing template without real invitation. */
  isPreview?: boolean;

  /* ── Optional live-invitation enrichment (FAZ 2C) ──────────────── *
   * When mounted from /i/[slug] (real invitation) these arrive
   * pre-resolved by the server component and get fanned out to every
   * slot. Preview/demo callers omit them; slots gracefully degrade.
   */
  invitation?: Invitation;
  theme?: InvitationTheme;
  locale?: DbLocale;
  messages?: Messages;
  dateLine?: string | null;
  weekday?: string | null;
  monogram?: string;
}

export function EditionRenderer({
  composition,
  data,
  isPreview,
  invitation,
  theme,
  locale,
  messages,
  dateLine,
  weekday,
  monogram,
}: EditionRendererProps) {
  return (
    <div
      data-edition={composition.slug}
      data-edition-name={composition.name}
      className="h-full w-full overflow-y-auto"
      style={{
        // Reset to a known baseline so editions can paint over via
        // their CSS-variable scope without inheriting Tailwind defaults.
        background: "var(--edition-bg)",
        color: "var(--edition-ink)",
        scrollBehavior: "smooth",
      }}
    >
      {composition.order.map((slotName) => {
        const Override = composition.slots[slotName];
        const Default = DEFAULT_SLOTS[slotName];
        const Component = Override ?? Default;

        if (!Component) {
          // Optional slot in `order` with no override and no default
          // (e.g. an edition declares `story` but hasn't written its
          // component yet). Skip silently — buildComposition() already
          // throws on mandatory misses at module-load time.
          return null;
        }

        return (
          <Component
            key={slotName}
            data={data}
            isPreview={isPreview}
            editionSlug={composition.slug}
            invitation={invitation}
            theme={theme}
            locale={locale}
            messages={messages}
            dateLine={dateLine}
            weekday={weekday}
            monogram={monogram}
          />
        );
      })}

      {isPreview && (
        <div className="pointer-events-none fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
          Demo
        </div>
      )}
    </div>
  );
}
