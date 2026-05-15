"use client";

import type { TemplateComponentProps } from "@/lib/templates/types";
import { EditorialBase } from "../_shared/editorial-base";
import type { EditorialTheme } from "../_shared/theme";

const theme: EditorialTheme = {
  editionName: "Verde & Borgogna",

  bg: "#1A2A1F",
  ink: "#F0E5D2",
  inkSoft: "#C0B59A",
  muted: "#7A7060",
  accent: "#C24A3F",
  hairline: "rgba(240, 229, 210, 0.14)",
  coverOverlay:
    "linear-gradient(180deg, rgba(26,42,31,0.55) 0%, rgba(26,42,31,0.1) 35%, rgba(26,42,31,0.2) 60%, rgba(26,42,31,0.9) 100%)",

  ampersand: "&",
  decorative: "geometric",
  showPortrait: true,
  showLetter: true,

  arrivalLabel: "Un invito",
  prologueLabel: "— Prologo",
  prologue: (d) =>
    `Un autunno, una vigna, una decisione. ${d.partnerOne} e ${d.partnerTwo} si sposano e desiderano la vostra compagnia per un'unica, lunga sera.`,
  programmeLabel: "— Il programma",
  programmeTitle: { line1: "Una sera", accent: "lentissima." },
  portraitLabel: "— Ritratto",
  letterLabel: "— Una nota dagli sposi",
  letterParagraphs: () => [
    "Sceglieremo un menu lungo. Ci sarà un vino che racconta una collina.",
    "Vi chiediamo di non venire di fretta. Restate fino a quando le candele si esauriscono.",
  ],
  closeLabel: "— Per favore rispondi",
  closeTitle: "Vi vedremo?",
  closeCta: "Rispondi",
};

export function VerdeBorgogna(props: TemplateComponentProps) {
  return <EditorialBase {...props} theme={theme} />;
}
