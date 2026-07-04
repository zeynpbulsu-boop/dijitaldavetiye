"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta } from "@/lib/themes-v2/types";
import { tint, shade } from "@/lib/themes-v2/contrast";
import { makeRng, r3 } from "./atmosphere";
import { useInvitationT } from "../i18n-context";

/**
 * ScratchDate — "Tarihi Kazı" (save-the-date etkileşimi).
 *
 * Tarih, accent'in açık tonunda hafif dokulu bir kaplamanın altında durur;
 * misafir parmağıyla/fareyle kazır (canvas destination-out fırça). Kazınan
 * alan %42'yi geçince kaplama kendini nazikçe siler, tarih tam görünür,
 * 18 parçacık mini konfeti kutlar (K10 jest-ödül protokolü).
 *
 * - devicePixelRatio-duyarlı canvas; alfa örneklemesi her 64. byte'ta
 *   (performans), pointerup + her ~10 fırça vuruşunda ölçülür.
 * - SSR-güvenli: sunucu HTML'inde tarih düz bir örtü DIV'inin altındadır
 *   (yavaş JS'te spoiler yok); canvas layout-effect'te boyanır, hazır
 *   olunca DIV çekilir.
 * - Reduced-motion / canvas yoksa: tarih doğrudan görünür.
 */

const BRUSH_R = 28;
const REVEAL_AT = 0.42;

export function ScratchDate({
  meta,
  children,
}: {
  meta: ThemeV2Meta;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const str = useInvitationT();
  const { palette } = meta;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef(0);
  const scratchingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const coverColor = tint(palette.accent, 0.55);
  const coverEdge = tint(palette.accent, 0.35);

  // Kaplamayı boya — layout effect: tarayıcı ilk kareyi çizmeden önce.
  useLayoutEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const rect = wrap.getBoundingClientRect();
    if (rect.width === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    // Zemin: açık accent + köşelere hafif koyulaşma
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, coverColor);
    g.addColorStop(1, coverEdge);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);
    // Hafif noise — kazınacak "kart" dokusu (seeded, SSR ile ilgisi yok;
    // canvas zaten yalnız client'ta)
    const rnd = makeRng(4242);
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < rect.width * rect.height * 0.02; i++) {
      ctx.fillStyle = rnd() > 0.5 ? "#FFFFFF" : "#000000";
      ctx.fillRect(rnd() * rect.width, rnd() * rect.height, 1, 1);
    }
    ctx.globalAlpha = 1;
    setReady(true);
  }, [reduced, coverColor, coverEdge]);

  const measureCleared = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] === 0) clear++;
    }
    return total ? clear / total : 0;
  }, []);

  const scratch = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || revealed) return;
      const rect = canvas.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(clientX - rect.left, clientY - rect.top, BRUSH_R, 0, Math.PI * 2);
      ctx.fill();
      strokesRef.current++;
      if (strokesRef.current % 10 === 0 && measureCleared() >= REVEAL_AT) {
        setRevealed(true);
      }
    },
    [revealed, measureCleared],
  );

  const onUp = useCallback(() => {
    scratchingRef.current = false;
    if (!revealed && measureCleared() >= REVEAL_AT) setRevealed(true);
  }, [revealed, measureCleared]);

  useEffect(() => {
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [onUp]);

  // Reduced-motion → oyun yok, tarih düz görünür
  if (reduced) return <>{children}</>;

  return (
    <div ref={wrapRef} className="relative select-none" style={{ touchAction: "none" }}>
      {children}

      {/* SSR örtüsü — canvas boyanana kadar tarihi gizler (spoiler yok) */}
      {!ready && !revealed && (
        <div
          aria-hidden
          className="absolute inset-0 rounded-[10px]"
          style={{ background: `linear-gradient(135deg, ${coverColor}, ${coverEdge})` }}
        />
      )}

      {/* Kazıma kaplaması */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full rounded-[10px]"
        style={{ cursor: revealed ? "default" : "pointer" }}
        initial={false}
        animate={{ opacity: revealed ? 0 : 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          if (revealed && canvasRef.current) canvasRef.current.style.pointerEvents = "none";
        }}
        onPointerDown={(e) => {
          scratchingRef.current = true;
          scratch(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (scratchingRef.current) scratch(e.clientX, e.clientY);
        }}
        aria-label={str.scratch.hint}
        role="button"
      />

      {/* İpucu — kaplama üstünde 2s pulse; kazımaya başlayınca söner */}
      {!revealed && (
        <motion.span
          className="pointer-events-none absolute inset-x-0 top-full mt-3 block text-center text-[9.5px] uppercase"
          style={{ color: palette.countdownInk, letterSpacing: "0.4em", opacity: 0.8 }}
          animate={{ opacity: [0.5, 0.95, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {str.scratch.hint}
        </motion.span>
      )}

      {/* Ödül: açılımda mini konfeti (18 parçacık, tema paleti) */}
      {revealed && <MiniConfetti accent={palette.accent} ink={palette.countdownInk} />}
    </div>
  );
}

/* rsvp-form ConfettiBurst deseninin küçük kardeşi — tarih bloğu merkezli */
function MiniConfetti({ accent, ink }: { accent: string; ink: string }) {
  const pieces = useMemo(() => {
    const rnd = makeRng(31337);
    const colors = [accent, ink, tint(accent, 0.4), shade(accent, 0.25)];
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2 + rnd() * 0.4;
      const dist = 50 + rnd() * 90;
      return {
        style: {
          left: "50%",
          top: "50%",
          width: r3(4 + rnd() * 4),
          height: r3(6 + rnd() * 5),
          backgroundColor: colors[i % colors.length],
          borderRadius: rnd() > 0.5 ? "50%" : 1,
        } as CSSProperties,
        x: r3(Math.cos(angle) * dist),
        y: r3(Math.sin(angle) * dist - 40),
        rotate: r3(260 + rnd() * 420),
        duration: r3(0.8 + rnd() * 0.6),
        delay: r3(rnd() * 0.12),
      };
    });
  }, [accent, ink]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={p.style}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.rotate, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.2, 0.6, 0.4, 1] }}
        />
      ))}
    </div>
  );
}
