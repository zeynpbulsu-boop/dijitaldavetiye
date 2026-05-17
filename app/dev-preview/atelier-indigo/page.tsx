import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { ATELIER_INDIGO_THEME } from "@/lib/design/luxe-themes";

export const metadata: Metadata = {
  title: "Atelier Indigo — Killer Demo · NUVE",
  description: "Gece mavisi + altın varak + ebru. Premium davetiye deneyimi.",
  robots: { index: false, follow: false },
};

export default function AtelierIndigoPage() {
  return <LuxeEditionDemo theme={ATELIER_INDIGO_THEME} />;
}
