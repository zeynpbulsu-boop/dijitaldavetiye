import type { Metadata } from "next";
import { LuxeEditionDemo } from "@/components/themed/luxe-edition-demo";
import { AETHEL_THEME } from "@/lib/design/luxe-themes";

/**
 * /dev-preview/aethel — Aethel Chapel demo.
 *
 * PR #27: Eski bespoke AethelChapelDemo bileşeni kaldırıldı; artık
 * Aethel da diğer 5 edition gibi LuxeEditionDemo + AETHEL_THEME
 * pattern'ini kullanıyor. Bu sayede PR #20+ tüm özellikler
 * (full-bleed cover scene, journey timeline, per-edition schedule/
 * FAQ/hotels, micro-animations, envelope flap) Aethel demo'sunda da
 * çalışıyor.
 *
 * Bespoke implementasyon _aethel-demo.tsx içinde duruyor ama artık
 * import edilmiyor — bir sonraki temizlemede silinecek.
 */

export const metadata: Metadata = {
  title: "Aethel's Chapel — Killer Demo · NUVE",
  description: "Tematik bütünsel dijital davetiye — Toskana antik şapel.",
  robots: { index: false, follow: false },
};

export default function AethelDemoPage() {
  return <LuxeEditionDemo theme={AETHEL_THEME} />;
}
