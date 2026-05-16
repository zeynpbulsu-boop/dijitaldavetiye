"use client";

/**
 * Elegant Ivory — Thanks Slot (FAZ 2C)
 * Lifted from monolith _invitation-view.tsx L1063-1088 (footer).
 */

import type { SlotProps } from "../../_shared/slots";

export function ElegantIvoryThanksSlot({ theme, messages }: SlotProps) {
  if (!theme || !messages) return null;

  return (
    <footer
      data-slot="thanks"
      data-edition-slug="elegant-ivory"
      className="relative z-10 border-t px-6 py-14 text-center"
      style={{ borderColor: theme.storyBorder }}
    >
      <span
        className="font-display italic"
        style={{
          color: theme.inkSoft,
          fontSize: "20px",
          letterSpacing: "0.03em",
        }}
      >
        nuve
        <span style={{ color: theme.footerDot }}>.</span>
      </span>
      <p
        className="mt-3 text-[9.5px]"
        style={{
          color: theme.inkSoft,
          letterSpacing: "0.36em",
          textTransform: "uppercase",
        }}
      >
        {messages.footer.rights}
      </p>
    </footer>
  );
}
