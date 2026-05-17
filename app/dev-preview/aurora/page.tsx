import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { AURORA_THEME } from "@/lib/design/luxe-themes";

export const metadata: Metadata = {
  title: "Aurora — Killer Demo · NUVE",
  description: "Modernist minimalist + rose gold + geometri. Premium davetiye.",
  robots: { index: false, follow: false },
};

export default function AuroraPage() {
  return <LuxeEditionDemo theme={AURORA_THEME} />;
}
