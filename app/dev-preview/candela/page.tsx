import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { CANDELA_THEME } from "@/lib/design/luxe-themes";

export const metadata: Metadata = {
  title: "Candéla — Killer Demo · NUVE",
  description: "Boğaziçi yalısı + akşam ışıkları + bordo. Premium davetiye.",
  robots: { index: false, follow: false },
};

export default function MansionLightsPage() {
  return <LuxeEditionDemo theme={CANDELA_THEME} />;
}
