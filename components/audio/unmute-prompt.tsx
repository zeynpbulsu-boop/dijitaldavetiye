"use client";

/**
 * UnmutePrompt — küçük "♪ Sesi aç" pill, envelope açıldıktan ~600ms sonra
 * sağ-alt köşeden slide-in eder. 8 saniye sonra otomatik fade-out
 * (kullanıcı tıklamadıysa). Tıklama → audio unlock + mute=false.
 *
 * Kullanım:
 *   <UnmutePrompt show={opened} edition="aethel" />
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAudio } from "@/lib/audio/audio-context";
import type { EditionSlug } from "@/lib/design/tokens";

interface Props {
  show: boolean;
  edition: EditionSlug | "aethel";
  /** Custom label. Default: "Sesi Aç" */
  label?: string;
  /** Auto-hide after N ms. Default: 8000. 0 = never. */
  autoHideMs?: number;
}

export function UnmutePrompt({ show, edition, label = "Sesi Aç", autoHideMs = 8000 }: Props) {
  const { unlocked, muted, setMuted, playAmbient } = useAudio();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!show || dismissed) return;
    const t = window.setTimeout(() => setVisible(true), 600);
    return () => window.clearTimeout(t);
  }, [show, dismissed]);

  useEffect(() => {
    if (!visible || autoHideMs === 0) return;
    const t = window.setTimeout(() => setVisible(false), autoHideMs);
    return () => window.clearTimeout(t);
  }, [visible, autoHideMs]);

  const handleClick = async () => {
    setMuted(false);
    playAmbient(edition);
    setVisible(false);
    setDismissed(true);
  };

  if (unlocked && !muted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          data-cursor="audio"
          data-cursor-label={label}
          initial={{ opacity: 0, y: 16, x: 0 }}
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
          <span style={{ fontSize: 16, lineHeight: 1 }}>♪</span>
          <span>{label}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
