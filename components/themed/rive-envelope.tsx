"use client";

/**
 * RiveEnvelope — interactive wax seal envelope via Rive state machine.
 *
 * Rive editor'de (https://rive.app) tasarlanan `.riv` asset'i runtime'da
 * stateful animasyon olarak çalıştırır. Lottie alternatifi: 10× küçük
 * dosya, interactive state inputs, GPU-accelerated.
 *
 * Beklenen Rive yapısı:
 *   - File: public/rive/envelope.riv (henüz yok — Faz 3 asset)
 *   - Artboard: "Envelope"
 *   - State machine: "EnvelopeFlow"
 *   - States: Sealed → Unsealing → Opening → Opened
 *   - Input: "open" (bool, fired on tap)
 *   - Input: "tint" (color, optional — couple-customized wax seal)
 *
 * Asset yoksa hata fırlatmaz; onLoadError prop'u ile fallback DOM
 * (EnvelopeCeremony classic mode) açılır.
 *
 * Kullanım:
 *   <RiveEnvelope
 *     src="/rive/envelope.riv"
 *     onOpened={() => setStage("opened")}
 *     waxSealTint="#7A8A6E"
 *     onLoadError={() => setFallbackDom(true)}
 *   />
 */

import { useEffect, useRef } from "react";
import {
  useRive,
  useStateMachineInput,
  Fit,
  Alignment,
  Layout,
  EventType,
  type RiveState,
} from "@rive-app/react-canvas";

interface Props {
  /** Rive asset path. */
  src: string;
  /** Tap callback — state machine "Opened" state'e ulaşınca veya open input fire'lanınca tetiklenir. */
  onOpened: () => void;
  /** Couple-customized wax seal color (hex). */
  waxSealTint?: string | null;
  /** Asset yüklenemezse → caller DOM fallback'e geç. */
  onLoadError?: () => void;
  /** Container className. */
  className?: string;
}

const STATE_MACHINE = "EnvelopeFlow";
const OPEN_INPUT = "open";
const TINT_INPUT = "tint";

export function RiveEnvelope({ src, onOpened, waxSealTint, onLoadError, className }: Props) {
  const onOpenedRef = useRef(onOpened);
  onOpenedRef.current = onOpened;

  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => {
      onLoadError?.();
    },
  });

  const openInput = useStateMachineInput(rive, STATE_MACHINE, OPEN_INPUT);
  const tintInput = useStateMachineInput(rive, STATE_MACHINE, TINT_INPUT);

  // Apply couple-customized tint when machine ready
  useEffect(() => {
    if (!tintInput || !waxSealTint) return;
    try {
      const hex = waxSealTint.replace("#", "");
      const value = parseInt(hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex, 16);
      if (!Number.isNaN(value)) {
        tintInput.value = value;
      }
    } catch (e) {
      // Ignore tint parse errors
    }
  }, [tintInput, waxSealTint]);

  // Listen for state-machine "Opened" state via Rive events (if author emits)
  useEffect(() => {
    if (!rive) return;
    const handler = (event: { data?: unknown }) => {
      const data = event.data as { name?: string } | undefined;
      if (data?.name === "Opened") {
        onOpenedRef.current();
      }
    };
    rive.on(EventType.RiveEvent, handler as (event: unknown) => void);
    return () => {
      rive.off(EventType.RiveEvent, handler as (event: unknown) => void);
    };
  }, [rive]);

  const handleTap = () => {
    if (!openInput) {
      // No input wired — fallback to direct callback
      onOpenedRef.current();
      return;
    }
    // Bool input fire
    openInput.value = true;
    // Safety: trigger callback after 1.8s if Rive doesn't emit Opened event
    window.setTimeout(() => onOpenedRef.current(), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleTap}
      data-cursor="magnetic"
      data-cursor-label="Aç"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Davetiyeyi aç"
    >
      <RiveComponent style={{ width: "min(82vw, 540px)", height: "min(82vw, 540px)" }} />
    </button>
  );
}
