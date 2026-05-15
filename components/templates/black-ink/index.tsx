import type { TemplateComponentProps } from "@/lib/templates/types";
import { EditorialBase } from "../_shared/editorial-base";
import type { EditorialTheme } from "../_shared/theme";

const theme: EditorialTheme = {
  editionName: "Black Ink",

  bg: "#0E0D0B",
  ink: "#F4F0E8",
  inkSoft: "#A8A39A",
  muted: "#6B675F",
  accent: "#D4B270",
  hairline: "rgba(244, 240, 232, 0.12)",
  coverOverlay:
    "linear-gradient(180deg, rgba(14,13,11,0.5) 0%, rgba(14,13,11,0.15) 35%, rgba(14,13,11,0.9) 100%)",

  ampersand: "&",
  decorative: "geometric",
  showPortrait: false, // pure typography edition — no portrait section
  showLetter: false,

  arrivalLabel: "Invitation",
  prologueLabel: "— Notice",
  prologue: (d) =>
    `${d.partnerOne}. ${d.partnerTwo}. ${new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. ${d.location}. You are invited.`,
  programmeLabel: "— Details",
  programmeTitle: { line1: "Everything you need", accent: "in one line." },
  closeLabel: "— Reply",
  closeTitle: "Yes or no.",
  closeCta: "Send reply",
};

export function BlackInk(props: TemplateComponentProps) {
  return <EditorialBase {...props} theme={theme} />;
}
