import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { MISTRAL_THEME } from "@/lib/design/luxe-themes";

export const metadata: Metadata = {
  title: "Mistral — Killer Demo · NUVE",
  description: "Ege esintisi + bougainvillea + mozaik. Premium davetiye.",
  robots: { index: false, follow: false },
};

export default function BodrumBluePage() {
  return <LuxeEditionDemo theme={MISTRAL_THEME} />;
}
