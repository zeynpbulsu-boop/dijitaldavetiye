import type { Metadata } from "next";
import { StdSlotMachine } from "@/components/std/std-slot-machine";

export const metadata: Metadata = {
  title: "Save the Date · Slot Machine — NUVE",
  description:
    "Kolu çek, tarihi yakala. NUVE'nin interaktif Save the Date casino slot ürünü.",
  robots: { index: false, follow: false },
};

export default function StdSlotPage() {
  return (
    <StdSlotMachine
      coupleName="Selin & Mert"
      monogram="S&M"
      targetDate={{ day: "24", month: "Ekim", year: "2026" }}
      venue="Çırağan Sarayı · İstanbul"
      ctaLabel="Kolu Çek"
      saveTheDateLabel="Save the Date"
    />
  );
}
