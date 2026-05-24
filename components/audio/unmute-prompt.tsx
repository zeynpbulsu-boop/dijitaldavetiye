"use client";

/**
 * UnmutePrompt — envelope opened olduktan sonra ambient OTOMATIK başlar.
 *
 * Browser autoplay policy: ses sadece user gesture'dan sonra çalabilir.
 * Envelope tap → unmute + unlock + autoplay ambient.
 *
 * UI: küçük "♪ Müzik çalıyor" pill sağ-alt köşeden slide-in,
 * 4sn sonra fade-out. Kullanıcı isterse tıklayıp ses kapatabilir.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAudio } from "@/lib/audio/audio-context";
import type { EditionSlug } from "@/lib/design/tokens";

interface Props {
  show: boolean;
  edition: EditionSlug | "aethel";
  /** Auto-hide after N ms. Default: 4000. 0 = never. */
  autoHideMs?: number;
}

export function UnmutePrompt({ show, edition, autoHideMs = 4000 }: Props) {
  const { unlocked, muted, setMuted, unlock, playAmbient } = useAudio();
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);

  // OTOMATIK BAŞLAT: envelope opened olur olmaz ambient çal
  useEffect(() => {
    if (!show || started) return;
    let cancelled = false;
    (async () => {
      try {
        await unlock();
        if (cancelled) return;
        setMuted(false);
        // Küçük gecikme: AudioContext'in unlock'u settle olsun
        window.setTimeout(() => {
          if (!cancelled) playAmbient(edition);
        }, 200);
        setStarted(true);
      } catch (e) {
        // Sessiz fallback — kullanıcı manuel pill ile açabilir
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [show, started, edition, unlock, setMuted, playAmbient]);

  // Visible mini-pill — "müzik çalıyor" feedback
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(t);
  }, [show]);

  useEffect(() => {
    if (!visible || autoHideMs === 0) return;
    const t = window.setTimeout(() => setVisible(false), autoHideMs);
    return () => window.clearTimeout(t);
  }, [visible, autoHideMs]);

  const handleClick = () => {
    if (muted) {
      setMuted(false);
      playAmbient(edition);
    } else {
      setMuted(true);
    }
    setVisible(false);
  };

  const label = muted ? "Sesi Aç" : "Müzik çalıyor";

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          data-cursor="audio"
          data-cursor-label={muted ? "Aç" : "Kapat"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-label={label}
          style={{
            position: "fixed",
            right: "calc(env(safe-area-inset-right, 0px) + 18px)",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)",
            zIndex: 60,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 20px",
            borderRadius: 9999,
            background: "rgba(20, 16, 12, 0.78)",
            color: "rgba(245, 239, 227, 0.96)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(245, 239, 227, 0.18)",
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontWeight: 400,
            cursor: "pointer",
            boxShadow: "0 12px 36px -12px rgba(0,0,0,0.45)",
          }}
        >
          <motion.span
            style={{ fontSize: 16, lineHeight: 1 }}
            animate={muted ? {} : { scale: [1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {muted ? "♪" : "♬"}
          </motion.span>
          <span>{label}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
