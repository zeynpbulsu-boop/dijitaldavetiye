"use client";

/**
 * Default Gift Slot — FAZ 2B
 *
 * Renders the hediye / IBAN card. Reads edition CSS variables so it
 * adopts whichever edition wraps it. Editions that want a more
 * bespoke gift block (e.g. Mansion Lights' gilded card with letterpress
 * IBAN) override this slot entirely.
 *
 * If no `giftIban` is provided in the invitation data, the slot
 * silently renders nothing — couples opting out of a gift section
 * shouldn't see an empty block.
 */

import { useState } from "react";
import type { SlotProps } from "../slots";

/** Insert a space every 4 characters for legibility. */
function formatIban(iban: string) {
  const compact = iban.replace(/\s+/g, "").toUpperCase();
  return compact.match(/.{1,4}/g)?.join(" ") ?? compact;
}

export function GiftSlot({ data, editionSlug }: SlotProps) {
  // Hooks must run unconditionally — declare them before any early
  // return so the order is stable across renders.
  const [copied, setCopied] = useState(false);

  const iban = data.giftIban?.trim();
  if (!iban) return null;

  async function copyIban() {
    try {
      await navigator.clipboard.writeText(iban!.replace(/\s+/g, "").toUpperCase());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard rejected (no permission, http context, etc.) — leave
      // visual state unchanged. Manual selection still works.
    }
  }

  return (
    <section
      data-slot="gift"
      data-edition-slug={editionSlug}
      className="border-t py-16 lg:py-24"
      style={{
        background: "var(--edition-bg-alt)",
        borderColor: "var(--edition-hairline)",
        color: "var(--edition-ink)",
      }}
    >
      <div className="container-tight mx-auto max-w-[640px] px-5">
        <div className="mb-8 text-center">
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "var(--edition-accent)" }}
          >
            — Hediye
          </div>
          <h2
            className="mt-4"
            style={{
              fontFamily: "var(--edition-display)",
              fontSize: "clamp(26px, 3.2vw, 40px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Varlığınız en büyük hediye
          </h2>
          {data.giftMessage && (
            <p
              className="mx-auto mt-4 max-w-[460px] text-[14px] leading-[1.65]"
              style={{ color: "var(--edition-ink-soft)" }}
            >
              {data.giftMessage}
            </p>
          )}
        </div>

        <div
          className="px-6 py-7 sm:px-10"
          style={{
            background: "var(--edition-bg)",
            border: `1px solid var(--edition-hairline)`,
            borderRadius: 8,
          }}
        >
          {data.giftAccountHolder && (
            <Row label="Hesap sahibi" value={data.giftAccountHolder} />
          )}
          {data.giftBank && <Row label="Banka" value={data.giftBank} />}

          <div className="mt-5">
            <div
              className="text-[10px] uppercase tracking-[0.24em]"
              style={{ color: "var(--edition-ink-soft)" }}
            >
              IBAN
            </div>
            <div
              className="mt-2 break-all font-mono text-[15px] tabular-nums leading-[1.5]"
              style={{ color: "var(--edition-ink)" }}
            >
              {formatIban(iban)}
            </div>
          </div>

          <button
            type="button"
            onClick={copyIban}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors"
            style={{
              border: `1px solid var(--edition-hairline)`,
              color: "var(--edition-ink)",
              background: "transparent",
              borderRadius: 999,
            }}
          >
            <span aria-hidden>{copied ? "✓" : "❏"}</span>
            <span>{copied ? "Kopyalandı" : "IBAN'ı kopyala"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-1 flex flex-col gap-1 border-b py-3 first:mt-0 first:border-t-0 last:border-b-0"
      style={{ borderColor: "var(--edition-hairline)" }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.24em]"
        style={{ color: "var(--edition-ink-soft)" }}
      >
        {label}
      </span>
      <span className="text-[15px]" style={{ color: "var(--edition-ink)" }}>
        {value}
      </span>
    </div>
  );
}
