import type { TemplateComponentProps } from "@/lib/templates/types";
import { EditorialBase } from "../_shared/editorial-base";
import type { EditorialTheme } from "../_shared/theme";

const theme: EditorialTheme = {
  editionName: "Olive Grove",

  bg: "#EFEEDD",
  ink: "#2E3324",
  inkSoft: "#5E6346",
  muted: "#8B8068",
  accent: "#7A8B72",
  hairline: "rgba(46, 51, 36, 0.16)",
  coverOverlay:
    "linear-gradient(180deg, rgba(46,51,36,0.2) 0%, transparent 35%, rgba(46,51,36,0.6) 100%)",

  ampersand: "italic",
  decorative: "none",
  showPortrait: true,
  showLetter: true,

  arrivalLabel: "An informal invitation",
  prologueLabel: "— Notes",
  prologue: (d) =>
    `${d.partnerOne} ${"&"} ${d.partnerTwo}, on a small terrace, with olive trees on three sides and a slow Sunday lunch that will end whenever the sun does. You are invited, without much ceremony, to be there.`,
  programmeLabel: "— A simple programme",
  programmeTitle: { line1: "A long lunch,", accent: "and then dancing." },
  portraitLabel: "— A photograph from the land",
  letterLabel: "— A few words",
  letterParagraphs: () => [
    "We chose this place because it is the place we drive to when nothing has gone right that week.",
    "We hope it will be that for you too, the day after the wedding.",
  ],
  closeLabel: "— Tell us, kindly",
  closeTitle: "Coming?",
  closeCta: "Let us know",
};

export function OliveGrove(props: TemplateComponentProps) {
  return <EditorialBase {...props} theme={theme} />;
}
