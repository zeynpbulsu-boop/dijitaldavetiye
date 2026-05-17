import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { MANSION_LIGHTS_THEME } from "@/lib/design/luxe-themes";

export const metadata: Metadata = {
  title: "Mansion Lights — Killer Demo · NUVE",
  description: "Boğaziçi yalısı + akşam ışıkları + bordo. Premium davetiye.",
  robots: { index: false, follow: false },
};

export default function MansionLightsPage() {
  return <LuxeEditionDemo theme={MANSION_LIGHTS_THEME} />;
}
