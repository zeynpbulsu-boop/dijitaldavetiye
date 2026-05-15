import type { TemplateComponentProps } from "@/lib/templates/types";
import { EditorialBase } from "../_shared/editorial-base";
import type { EditorialTheme } from "../_shared/theme";

const theme: EditorialTheme = {
  editionName: "Elegant Ivory",

  bg: "#FBF8F2",
  ink: "#1F1B17",
  inkSoft: "#5C544B",
  muted: "#A8A096",
  accent: "#1F1B17", // only ink — extreme minimal, accent matches ink
  hairline: "rgba(31, 27, 23, 0.12)",
  coverOverlay:
    "linear-gradient(180deg, rgba(31,27,23,0.1) 0%, transparent 40%, rgba(31,27,23,0.45) 100%)",

  ampersand: "italic",
  decorative: "hairline",
  showPortrait: false, // minimal edition — no parallax photo middle
  showLetter: false,

  arrivalLabel: "Invitation",
  prologueLabel: "—",
  prologue: (d) =>
    `${d.partnerOne} and ${d.partnerTwo}, on ${new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}, in ${d.location}. Your presence would mean a great deal.`,
  programmeLabel: "—",
  programmeTitle: { line1: "Details,", accent: "below." },
  closeLabel: "—",
  closeTitle: "Reply.",
  closeCta: "Send a reply",
};

export function ElegantIvory(props: TemplateComponentProps) {
  return <EditorialBase {...props} theme={theme} />;
}
