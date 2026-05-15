"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CornerBlooms } from "@/components/ornaments/corner-blooms";
import { useT } from "@/lib/i18n/provider";

/**
 * Ceremonies — split layout showing two opening styles side by side.
 * Left (lg): two tilted phone mockups (CSS only) — ribbon envelope + wax letter.
 * Right: editorial copy on opening rituals.
 *
 * Both phones are placeholders — when the user supplies envelope-opening
 * video/animation assets, swap the inner phone content for those.
 */
export function Ceremonies() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-line bg-bg py-24 lg:py-36"
    >
      <CornerBlooms slot="ceremonies" />
      <div className="container-wide relative z-10">
        <div className="grid grid-cols-12 items-center gap-x-6 gap-y-16">
          {/* LEFT — two tilted phones */}
          <div className="col-span-12 lg:col-span-7">
            <div className="relative mx-auto flex max-w-[640px] items-center justify-center gap-4 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 32, rotate: -10 }}
                animate={inView ? { opacity: 1, y: 0, rotate: -7 } : {}}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 max-w-[260px]"
              >
                <RibbonPhone
                  tag={t.ceremonies.phone_ribbon.tag}
                  label={t.ceremonies.phone_ribbon.label}
                  hint={t.ceremonies.phone_ribbon.hint}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 32, rotate: 10 }}
                animate={inView ? { opacity: 1, y: 0, rotate: 6 } : {}}
                transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 max-w-[260px]"
              >
                <WaxPhone
                  tag={t.ceremonies.phone_wax.tag}
                  label={t.ceremonies.phone_wax.label}
                  hint={t.ceremonies.phone_wax.hint}
                />
              </motion.div>
            </div>
          </div>

          {/* RIGHT — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-5"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — {t.ceremonies.eyebrow}
            </span>
            <h2
              className="mt-4 font-display text-brand-ink"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
              }}
            >
              {t.ceremonies.headline_prefix} <br className="hidden sm:inline" />
              <span className="italic text-brand-cognac">{t.ceremonies.headline_accent}</span>.
            </h2>

            <p
              className="mt-7 max-w-[440px] text-brand-ink/75"
              style={{ fontSize: "17px", lineHeight: 1.7 }}
            >
              {t.ceremonies.lead}
            </p>

            <div className="mt-8 space-y-4 border-t border-brand-ink/15 pt-6">
              {t.ceremonies.rituals.map((r, i) => (
                <Ritual
                  key={i}
                  tag={String(i + 1).padStart(2, "0")}
                  title={r.title}
                  body={r.body}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Ritual({
  tag,
  title,
  body,
}: {
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="w-7 shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-cognac">
        {tag}
      </span>
      <div className="flex-1">
        <p
          className="font-display text-brand-ink"
          style={{
            fontSize: "20px",
            lineHeight: 1.2,
            letterSpacing: "-0.012em",
          }}
        >
          {title}
        </p>
        <p
          className="mt-1 text-brand-ink/70"
          style={{ fontSize: "14px", lineHeight: 1.55 }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

/** Phone mockup — ribbon envelope */
function RibbonPhone({ tag, label, hint }: { tag: string; label: string; hint: string }) {
  return (
    <PhoneFrame label={label}>
      <div className="flex h-full flex-col items-center justify-center px-5 pb-10 pt-12">
        <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-brand-mute">
          {tag}
        </span>

        <svg
          viewBox="0 0 200 240"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-6 w-full drop-shadow-[0_3px_10px_rgba(43,30,22,0.18)]"
          aria-hidden
        >
          {/* Envelope */}
          <rect
            x="10"
            y="60"
            width="180"
            height="155"
            rx="3"
            fill="#F2EEE6"
            stroke="#2B1E16"
            strokeOpacity="0.18"
          />
          <path
            d="M10 60 L100 140 L190 60"
            stroke="#2B1E16"
            strokeOpacity="0.18"
            fill="none"
          />
          {/* Ribbon vertical */}
          <rect x="92" y="20" width="16" height="220" fill="#B98E78" />
          {/* Ribbon bow */}
          <g transform="translate(100 36)" fill="#B98E78">
            <ellipse cx="-22" cy="0" rx="22" ry="14" />
            <ellipse cx="22" cy="0" rx="22" ry="14" />
            <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#8C5A3C" />
          </g>
          {/* Ribbon tails */}
          <path
            d="M88 215 L70 248 M112 215 L130 248"
            stroke="#8C5A3C"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>

        <p className="mt-4 text-center font-display italic text-brand-cognac" style={{ fontSize: "13px" }}>
          {hint}
        </p>
      </div>
    </PhoneFrame>
  );
}

/** Phone mockup — wax-sealed letter */
function WaxPhone({ tag, label, hint }: { tag: string; label: string; hint: string }) {
  return (
    <PhoneFrame label={label}>
      <div className="flex h-full flex-col items-center justify-center px-5 pb-10 pt-12">
        <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-brand-mute">
          {tag}
        </span>

        <svg
          viewBox="0 0 200 240"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-6 w-full drop-shadow-[0_3px_10px_rgba(43,30,22,0.18)]"
          aria-hidden
        >
          {/* Letter paper */}
          <rect
            x="20"
            y="35"
            width="160"
            height="190"
            rx="3"
            fill="#F2EEE6"
            stroke="#2B1E16"
            strokeOpacity="0.18"
          />
          {/* Text lines */}
          <g stroke="#2B1E16" strokeOpacity="0.15" strokeWidth="0.8">
            <line x1="35" y1="65" x2="165" y2="65" />
            <line x1="35" y1="78" x2="155" y2="78" />
            <line x1="35" y1="91" x2="145" y2="91" />
            <line x1="35" y1="104" x2="160" y2="104" />
          </g>
          {/* Names — italic */}
          <text
            x="100"
            y="148"
            textAnchor="middle"
            fontFamily="serif"
            fontStyle="italic"
            fontSize="22"
            fill="#2B1E16"
          >
            S et M
          </text>
          {/* Wax seal */}
          <g transform="translate(100 195)">
            <circle r="22" fill="#8C5A3C" />
            <circle
              r="18"
              fill="none"
              stroke="#F2EEE6"
              strokeOpacity="0.5"
              strokeDasharray="1.5 1.4"
            />
            <text
              x="0"
              y="7"
              textAnchor="middle"
              fontFamily="serif"
              fontStyle="italic"
              fontSize="20"
              fill="#F2EEE6"
            >
              S
            </text>
          </g>
        </svg>

        <p className="mt-4 text-center font-display italic text-brand-cognac" style={{ fontSize: "13px" }}>
          {hint}
        </p>
      </div>
    </PhoneFrame>
  );
}

function PhoneFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full aspect-[9/19.5]">
      <div className="absolute -inset-x-3 -bottom-6 h-16 rounded-full bg-brand-ink/15 blur-2xl" aria-hidden />
      <div className="relative h-full w-full rounded-[34px] bg-brand-ink p-[6px] shadow-[0_24px_40px_-16px_rgba(43,30,22,0.4)]">
        <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-brand-cream-alt">
          <div className="absolute left-1/2 top-2 z-10 h-3.5 w-16 -translate-x-1/2 rounded-full bg-brand-ink/90" />
          {children}
        </div>
      </div>
      <p className="mt-4 text-center text-[9.5px] uppercase tracking-[0.28em] text-brand-mute">
        {label}
      </p>
    </div>
  );
}
