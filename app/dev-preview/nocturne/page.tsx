import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { NOCTURNE_THEME } from "@/lib/design/luxe-themes";

export const metadata: Metadata = {
  title: "Nocturne — Killer Demo · NUVE",
  description: "Gece mavisi + altın varak + ebru. Premium davetiye deneyimi.",
  robots: { index: false, follow: false },
};

export default function AtelierIndigoPage() {
  return <LuxeEditionDemo theme={NOCTURNE_THEME} />;
}
