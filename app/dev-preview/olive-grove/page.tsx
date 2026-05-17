import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { OLIVE_GROVE_THEME } from "@/lib/design/luxe-themes";

export const metadata: Metadata = {
  title: "Olive Grove — Killer Demo · NUVE",
  description: "Alaçatı zeytin bahçesi + limon + sage. Premium davetiye.",
  robots: { index: false, follow: false },
};

export default function OliveGrovePage() {
  return <LuxeEditionDemo theme={OLIVE_GROVE_THEME} />;
}
