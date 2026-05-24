import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { OLEA_THEME } from "@/lib/design/luxe-themes";

export const metadata: Metadata = {
  title: "Olea — Killer Demo · NUVE",
  description: "Alaçatı zeytin bahçesi + limon + sage. Premium davetiye.",
  robots: { index: false, follow: false },
};

export default function OliveGrovePage() {
  return <LuxeEditionDemo theme={OLEA_THEME} />;
}
