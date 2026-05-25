import type { Metadata } from "next";
import { StdGoldenHeart } from "@/components/std/std-golden-heart";

export const metadata: Metadata = {
  title: "Save the Date · Golden Heart — NUVE",
  description:
    "Altın kalbi kazı, tarihi ortaya çıkar. NUVE'nin interaktif Save the Date ürünü.",
  robots: { index: false, follow: false },
};

export default function StdGoldenHeartPage() {
  return (
    <StdGoldenHeart
      coupleName="Defne & Aras"
      monogram="D&A"
      date="12 Eylül 2026"
      venue="Aethel's Chapel · Toscana"
      hint="Kalbi kazı"
      saveTheDateLabel="Save the Date"
    />
  );
}
