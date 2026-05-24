"use client";

/**
 * SignatureWaves — Mistral "Tide That Knows You" signature minimal.
 *
 * Hero alt yarısında subtle horizontal wave shimmer — Aegean su yüzeyi
 * hissi. Pure CSS, GPU compositor.
 *
 * Subagent Faz 2 önerisinin (PixiJS displacement filter + Three.js
 * caustic + View Transitions) CSS-only ucuz versiyonu.
 */

import { useId } from "react";

export function SignatureWaves() {
  const id = useId().replace(/:/g, "_");
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[40%] overflow-hidden"
    >
      <style>{`
        @keyframes waveShimmer1_${id} {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-12px) translateY(-3px); }
        }
        @keyframes waveShimmer2_${id} {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(8px) translateY(-2px); }
        }
        @keyframes waveShimmer3_${id} {
          0%, 100% { transform: translateX(0); opacity: 0.4; }
          50% { transform: translateX(-6px); opacity: 0.6; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "-5%",
          right: "-5%",
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 30%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.55) 70%, transparent 100%)",
          mixBlendMode: "overlay",
          filter: "blur(1.5px)",
          animation: `waveShimmer1_${id} 7s ease-in-out infinite`,
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "-5%",
          right: "-5%",
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.40) 35%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.40) 65%, transparent 100%)",
          mixBlendMode: "overlay",
          filter: "blur(1.2px)",
          animation: `waveShimmer2_${id} 9s ease-in-out infinite 1.5s`,
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "-5%",
          right: "-5%",
          height: 3,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(122,168,189,0.35) 40%, rgba(122,168,189,0.45) 50%, rgba(122,168,189,0.35) 60%, transparent 100%)",
          mixBlendMode: "screen",
          filter: "blur(2px)",
          animation: `waveShimmer3_${id} 11s ease-in-out infinite 3s`,
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
