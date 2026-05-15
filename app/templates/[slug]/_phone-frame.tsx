import type { ReactNode } from "react";

/**
 * iPhone-style frame that hosts the interactive template preview.
 * Renders at a fixed aspect ratio so the template inside has stable proportions.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative mx-auto aspect-[9/19.5] w-full max-w-[380px] overflow-hidden rounded-[44px] border-[8px] border-[#1a1410] bg-[#FBF5E6] shadow-[0_50px_120px_rgba(20,12,8,0.45),0_0_0_2px_#2a2018]"
    >
      {/* Notch */}
      <span className="absolute left-1/2 top-2.5 z-[60] h-[24px] w-[100px] -translate-x-1/2 rounded-[12px] bg-[#1a1410]" />

      {/* Template content fills the frame */}
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
