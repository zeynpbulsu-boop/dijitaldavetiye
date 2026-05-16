"use client";

import type { TemplateComponentProps } from "@/lib/templates/types";
import { EditorialBase } from "../_shared/editorial-base";
import type { EditorialTheme } from "../_shared/theme";

/**
 * Aethel's Chapel — FAZ 3.5
 *
 * 6. premium edition. Sarmaşıklar, mor salkımlar ve antik yosun
 * yeşilleri arasına gizlenmiş, masalsı taş duvarlı şapel silüeti.
 * God-rays 4-5sn'de bir pulsing — sarmaşıkların arasından sızan
 * güneş ışınları. Havada toz zerresi.
 *
 * Palet: dezatüre yosun yeşili + fildişi + antik vizon.
 */

const theme: EditorialTheme = {
  editionName: "Aethel's Chapel",

  bg: "#EDE9DD",        // fildişi
  ink: "#2F3527",       // dezatüre yosun yeşili (koyu)
  inkSoft: "#5C6450",   // antik vizon yeşili (orta)
  muted: "#9CA088",     // toz yeşil
  accent: "#7A8A6E",    // yosun yeşili (orta-açık)
  hairline: "rgba(47, 53, 39, 0.16)",
  coverOverlay:
    "linear-gradient(180deg, rgba(47,53,39,0.08) 0%, transparent 35%, rgba(47,53,39,0.55) 100%)",

  ampersand: "italic",
  decorative: "hairline",
  showPortrait: false,
  showLetter: false,

  arrivalLabel: "An Invitation",
  prologueLabel: "—",
  prologue: (d) =>
    `${d.partnerOne} & ${d.partnerTwo} request the honour of your presence at the chapel on ${new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}, in ${d.location}.`,
  programmeLabel: "—",
  programmeTitle: { line1: "The day's", accent: "course." },
  closeLabel: "—",
  closeTitle: "Will you join us?",
  closeCta: "Send a reply",
};

export function AethelChapel(props: TemplateComponentProps) {
  return <EditorialBase {...props} theme={theme} />;
}
