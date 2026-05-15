import type { TemplateComponentProps } from "@/lib/templates/types";
import { EditorialBase } from "../_shared/editorial-base";
import type { EditorialTheme } from "../_shared/theme";

const theme: EditorialTheme = {
  editionName: "Blush Garden",

  bg: "#FAEFEC",
  ink: "#4A2A2A",
  inkSoft: "#7A5A5A",
  muted: "#A88A88",
  accent: "#B47A6C",
  hairline: "rgba(74, 42, 42, 0.14)",
  coverOverlay:
    "linear-gradient(180deg, rgba(74,42,42,0.18) 0%, transparent 35%, rgba(74,42,42,0.65) 100%)",

  ampersand: "italic",
  decorative: "floral",
  showPortrait: true,
  showLetter: true,

  arrivalLabel: "A garden invitation",
  prologueLabel: "— A small bouquet",
  prologue: (d) =>
    `In a garden in ${d.location.split(",")[0]}, with peonies, with low afternoon light, and with two people who finally decided. ${d.partnerOne} and ${d.partnerTwo} would love to be married while you watch.`,
  programmeLabel: "— The afternoon",
  programmeTitle: { line1: "An afternoon", accent: "of long stems." },
  portraitLabel: "— Among the roses",
  letterLabel: "— A blooming note",
  letterParagraphs: () => [
    "We had imagined a small wedding. It is still small in spirit; the guest list, less so.",
    "Bring a flat shoe — there is grass everywhere.",
  ],
  closeLabel: "— Please respond",
  closeTitle: "Coming to the garden?",
  closeCta: "Send the reply",
};

export function BlushGarden(props: TemplateComponentProps) {
  return <EditorialBase {...props} theme={theme} />;
}
