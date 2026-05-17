import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { BODRUM_BLUE_THEME } from "@/lib/design/luxe-themes";

export const metadata: Metadata = {
  title: "Bodrum Blue — Killer Demo · NUVE",
  description: "Ege esintisi + bougainvillea + mozaik. Premium davetiye.",
  robots: { index: false, follow: false },
};

export default function BodrumBluePage() {
  return <LuxeEditionDemo theme={BODRUM_BLUE_THEME} />;
}
