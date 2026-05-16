"use client";

/**
 * SlotPicker — FAZ 3.4
 *
 * iPhone time-picker / Apple Watch dial estetiğinde slot makinesi.
 * CSS scroll-snap-mandatory + framer-motion spring + haptic feedback.
 *
 * Kullanım:
 *   <SlotPicker
 *     label="Saat"
 *     options={Array.from({length: 24}, (_, i) => String(i).padStart(2, '0'))}
 *     value={hour}
 *     onChange={setHour}
 *   />
 *
 * Bileşim 3 katmanlı:
 *   1. Üst/alt gradient mask (uçlar fade-out — fokus orta sıra)
 *   2. Snap rail (vertical scroll, items 56px boy, snap center)
 *   3. Selected item çerçevesi (üst+alt 1px hat, lüks daviet ortamı)
 *
 * Audio: minimal "tık" sesi her snap'te (mute toggle ile kapatılır).
 * Haptic: navigator.vibrate(8) — mobilde gerçek titreşim.
 */

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface SlotPickerProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  /** Item yüksekliği — default 56px. */
  itemHeight?: number;
  /** Görünür item sayısı (tek sayı önerilir). Default 5. */
  visibleItems?: number;
  /** Tıklamalarda haptic + ses çalsın mı. Default true. */
  haptic?: boolean;
  className?: string;
}

export function SlotPicker({
  label,
  options,
  value,
  onChange,
  itemHeight = 56,
  visibleItems = 5,
  haptic = true,
  className = "",
}: SlotPickerProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastIdxRef = useRef<number>(options.indexOf(value));
  const [hovering, setHovering] = useState(false);

  const railHeight = itemHeight * visibleItems;
  const padding = (visibleItems - 1) / 2;

  /* Scroll'u value'ya senkronize tut */
  useEffect(() => {
    const idx = options.indexOf(value);
    if (idx < 0) return;
    const rail = railRef.current;
    if (!rail) return;
    // İlk mount'ta jump, sonra smooth
    rail.scrollTo({ top: idx * itemHeight, behavior: "instant" });
    lastIdxRef.current = idx;
  }, [value, options, itemHeight]);

  /* Audio context — tek bir kısa tık */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio(
      // 30ms beyaz gürültü, çok kısa "tk" sesi
      "data:audio/wav;base64,UklGRmgAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUQAAAAACAEPAhcDIwQzBkUITgpUDFkOXxBlEmwUcxZ6GIIaiByQHpkgoyKtJLgmwijOKtoshy6JMIsyjTSPNpE4kzqVPJc+mUA="
    );
    a.volume = 0.18;
    audioRef.current = a;
  }, []);

  /* Scroll → onChange, haptic, audio tık */
  function handleScroll() {
    const rail = railRef.current;
    if (!rail) return;
    const idx = Math.round(rail.scrollTop / itemHeight);
    if (idx === lastIdxRef.current) return;
    lastIdxRef.current = idx;
    const v = options[idx];
    if (v == null) return;

    if (haptic) {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate?.(8); } catch { /* sessizce yut */ }
      }
      const a = audioRef.current;
      if (a) {
        try {
          a.currentTime = 0;
          void a.play();
        } catch { /* autoplay engelliyse sus */ }
      }
    }
    onChange(v);
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          className="mb-3 block text-center text-[10px] uppercase"
          style={{
            letterSpacing: "0.32em",
            color: "rgba(124, 105, 87, 0.85)",
            fontWeight: 300,
          }}
        >
          {label}
        </label>
      )}

      <div
        className="relative overflow-hidden"
        style={{
          height: railHeight,
          /* Üst + alt fade — sahnenin orta sırasını öne çıkarır */
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Selected item çerçevesi — tam ortadaki sıra */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 z-10"
          style={{
            top: padding * itemHeight,
            height: itemHeight,
            borderTop: "1px solid rgba(193, 145, 75, 0.42)",
            borderBottom: "1px solid rgba(193, 145, 75, 0.42)",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(245, 220, 155, 0.06) 50%, transparent 100%)",
          }}
        />

        <div
          ref={railRef}
          onScroll={handleScroll}
          className="no-scrollbar h-full overflow-y-auto"
          style={{
            scrollSnapType: "y mandatory",
            scrollBehavior: hovering ? "smooth" : "auto",
            paddingTop: padding * itemHeight,
            paddingBottom: padding * itemHeight,
          }}
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <motion.div
                key={opt}
                role="button"
                tabIndex={0}
                onClick={() => {
                  const idx = options.indexOf(opt);
                  railRef.current?.scrollTo({
                    top: idx * itemHeight,
                    behavior: "smooth",
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(opt);
                  }
                }}
                className="flex w-full cursor-pointer items-center justify-center"
                style={{
                  height: itemHeight,
                  scrollSnapAlign: "center",
                  scrollSnapStop: "always",
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontWeight: 300,
                  fontSize: 30,
                  letterSpacing: "0.04em",
                  color: isSelected
                    ? "rgba(43, 30, 22, 1)"
                    : "rgba(124, 105, 87, 0.45)",
                  transition: "color 200ms ease",
                }}
                animate={{
                  scale: isSelected ? 1.06 : 0.92,
                  opacity: isSelected ? 1 : 0.55,
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 26,
                }}
              >
                {opt}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Hour/Minute/Day pre-set generators ───────────────────────────── */

export const slotOptions = {
  hours24: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")),
  minutes05: Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")),
  days: Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")),
  monthsTr: [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ],
  monthsEn: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  yearsNext10: Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i)),
};
