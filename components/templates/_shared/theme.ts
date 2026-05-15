import type { InvitationData } from "@/lib/templates/types";

/**
 * Editorial template theme — each invitation edition (Blush Reverie,
 * Bordeaux, etc.) configures the base template through one of these.
 *
 * Keep tokens flat and explicit; the base component reads them and
 * applies them as inline styles for full control per edition.
 */
export interface EditorialTheme {
  /** Edition name shown in the URL bar at the close (e.g. "Blush Reverie") */
  editionName: string;

  /* ── Colour ── */
  bg: string;
  ink: string;
  inkSoft: string;
  muted: string;
  accent: string;
  hairline: string;
  /** CSS gradient string for cover photo overlay */
  coverOverlay: string;

  /* ── Ampersand & decoration ── */
  ampersand: "italic" | "and" | "et" | "&";
  decorative?: "floral" | "geometric" | "hairline" | "none";

  /* ── Section toggles ── */
  showPortrait: boolean;
  showLetter: boolean;

  /* ── Copy ── */
  arrivalLabel: string;
  prologueLabel: string;
  prologue: (data: InvitationData) => string;
  programmeLabel: string;
  programmeTitle: { line1: string; accent: string };
  portraitLabel?: string;
  letterLabel?: string;
  letterParagraphs?: (data: InvitationData) => string[];
  closeLabel: string;
  closeTitle: string;
  closeCta: string;
}

/** Render the ampersand based on theme preference */
export function renderAmp(theme: EditorialTheme, className?: string): string {
  switch (theme.ampersand) {
    case "and": return "and";
    case "et":  return "et";
    case "&":   return "&";
    case "italic":
    default:    return "&";
  }
}
