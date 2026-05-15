import type { TemplateComponentProps } from "@/lib/templates/types";
import { EditorialBase } from "../_shared/editorial-base";
import type { EditorialTheme } from "../_shared/theme";

const theme: EditorialTheme = {
  editionName: "Blush Reverie",

  bg: "#F5EDDB",
  ink: "#1F1B17",
  inkSoft: "#5C544B",
  muted: "#8A7F73",
  accent: "#A65B3E",
  hairline: "rgba(31, 27, 23, 0.15)",
  coverOverlay:
    "linear-gradient(180deg, rgba(31,27,23,0.25) 0%, transparent 30%, transparent 55%, rgba(31,27,23,0.7) 100%)",

  ampersand: "italic",
  decorative: "none",
  showPortrait: true,
  showLetter: true,

  arrivalLabel: "An invitation",
  prologueLabel: "— Prologue",
  prologue: (d) =>
    `On a quiet evening in ${d.location.split(",")[0]}, ${d.partnerOne} and ${d.partnerTwo} decided that the night they met would, eventually, become this one. You are warmly invited to be in the room.`,
  programmeLabel: "— Programme",
  programmeTitle: { line1: "The day,", accent: "to the minute." },
  portraitLabel: "— A portrait, in advance",
  letterLabel: "— A note from us",
  letterParagraphs: (d) =>
    d.storyParagraphs ?? [
      "Most people we love do not live in the same city anymore. We thought a long time about how to bring you all together.",
      "This page is what we came up with. Please come if you can. If you cannot, please write — we will read it twice.",
    ],
  closeLabel: "— Kindly reply",
  closeTitle: "Will you be there?",
  closeCta: "Reply now",
};

export function BlushReverie(props: TemplateComponentProps) {
  return <EditorialBase {...props} theme={theme} />;
}
