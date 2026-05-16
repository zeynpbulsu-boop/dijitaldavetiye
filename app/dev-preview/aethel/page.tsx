import type { Metadata } from "next";
import { AethelChapelDemo } from "./_aethel-demo";

/**
 * /dev-preview/aethel — FAZ 5.7 KILLER DEMO
 *
 * Aethel's Chapel ediziyonu tam tematik bütünsel davetiye olarak.
 * Pressed Love'u ezme planının kanıt sayfası.
 *
 * İçindeki yeni elementler:
 *   - Hero: solid yosun yeşili + CalligraphyName stroke-by-stroke
 *   - LiveRsvpCounter sticky bar
 *   - ThemedSeparator (✦ vintage diamond, mor salkım accent rengi)
 *   - StoryTimeline (Tanışma → İlk Randevu → Teklif → Düğün)
 *   - MusicWaveformPlayer (couple şarkısı + 36 ince çubuk visualizer)
 *   - Schedule timeline (Ceremony 16:00 · Aperitivo 17:30 · ...)
 *   - Sticky floating dil + ses + CTA (Pressed Love kalıbı)
 *
 * Aynı tema (Aethel Chapel) tüm site'ye tutarlı şekilde yedirilmiş:
 *   - Hero arka planı: koyu yosun yeşili
 *   - Body içerik: fildişi krem
 *   - Section ayraç: ✦ mor salkım accent
 *   - Background pattern: ivy SVG watermark
 *   - Font: Pinyon Script calligraphy + Cormorant body
 */

export const metadata: Metadata = {
  title: "Aethel's Chapel — Killer Demo · NUVE",
  description: "FAZ 5 killer demo. Tematik bütünsel davetiye deneyimi.",
  robots: { index: false, follow: false },
};

export default function AethelDemoPage() {
  return <AethelChapelDemo />;
}
