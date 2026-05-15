"use client";

import type { TemplateComponentProps } from "@/lib/templates/types";
import { EditorialBase } from "../_shared/editorial-base";
import type { EditorialTheme } from "../_shared/theme";

const theme: EditorialTheme = {
  editionName: "Bordeaux",

  bg: "#1F0E0E",
  ink: "#F2E8D8",
  inkSoft: "#C8B8A0",
  muted: "#8A7868",
  accent: "#D4A158",
  hairline: "rgba(242, 232, 216, 0.15)",
  coverOverlay:
    "linear-gradient(180deg, rgba(31,14,14,0.5) 0%, rgba(31,14,14,0.1) 35%, rgba(31,14,14,0.2) 60%, rgba(31,14,14,0.85) 100%)",

  ampersand: "et",
  decorative: "geometric",
  showPortrait: true,
  showLetter: true,

  arrivalLabel: "A cordial invitation",
  prologueLabel: "— Préambule",
  prologue: (d) =>
    `After many seasons, in the warm rooms of a yalı, ${d.partnerOne} and ${d.partnerTwo} have decided. You are most kindly requested to share the evening of their marriage, with wine, with quiet music, and a longer dinner than is strictly necessary.`,
  programmeLabel: "— Le Programme",
  programmeTitle: { line1: "An evening,", accent: "deliberately slow." },
  portraitLabel: "— En portrait",
  letterLabel: "— Un mot des mariés",
  letterParagraphs: (d) =>
    d.storyParagraphs ?? [
      "We will be married in autumn. The light will be low, the wine will be red, and we hope you will not rush home.",
      "We have written every paragraph of this page twice. It is, in its small way, the first thing we have made together.",
    ],
  closeLabel: "— Veuillez répondre",
  closeTitle: "Will you join us?",
  closeCta: "Reply with care",
};

export function Bordeaux(props: TemplateComponentProps) {
  return <EditorialBase {...props} theme={theme} />;
}
