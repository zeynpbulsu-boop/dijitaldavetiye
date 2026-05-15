"use client";

import type { TemplateComponentProps } from "@/lib/templates/types";
import { EditorialBase } from "../_shared/editorial-base";
import type { EditorialTheme } from "../_shared/theme";

const theme: EditorialTheme = {
  editionName: "Égée Blue",

  bg: "#ECEEF2",
  ink: "#2D3946",
  inkSoft: "#5F6B78",
  muted: "#90969E",
  accent: "#4F6276",
  hairline: "rgba(45, 57, 70, 0.14)",
  coverOverlay:
    "linear-gradient(180deg, rgba(45,57,70,0.18) 0%, transparent 40%, rgba(45,57,70,0.55) 100%)",

  ampersand: "and",
  decorative: "hairline",
  showPortrait: true,
  showLetter: false, // coastal edition lets the photo speak

  arrivalLabel: "By the sea",
  prologueLabel: "— Coordinates",
  prologue: (d) =>
    `${d.partnerOne} and ${d.partnerTwo} will marry under a wide sky in ${d.location.split(",")[0]}. Bring linen. Bring time. The ceremony is short; the view, less so.`,
  programmeLabel: "— Programme",
  programmeTitle: { line1: "From sunset", accent: "to first light." },
  portraitLabel: "— Looking west",
  closeLabel: "— Kindly send word",
  closeTitle: "Will you sail in?",
  closeCta: "Reply",
};

export function EgeeBlue(props: TemplateComponentProps) {
  return <EditorialBase {...props} theme={theme} />;
}
