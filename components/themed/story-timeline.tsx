"use client";

/**
 * StoryTimeline — FAZ 5.6
 *
 * Çiftin tanışma hikayesi — dikey, zarif, asil zaman tüneli.
 * Pressed Love'da YOK. NUVE'nin duygusal değer eklediği yer.
 *
 * Yapı: orta dikey ince çizgi + her event için circle node + sağ-sol
 * şekilde sıralanan kart (alternate). scroll-trigger ile fade-in sırayla.
 *
 * Her event:
 *   { date, title, body, icon? }
 *
 * Tema'nın ornamentColor'u çizgi + node renkleri için kullanılır.
 */

import { motion } from "framer-motion";

export interface StoryEvent {
  /** Yıl/ay/tarih label (ferah uppercase tracking). */
  date: string;
  /** Başlık (calligraphy ya da display serif). */
  title: string;
  /** Açıklama paragrafı. */
  body: string;
  /** Opsiyonel ikon emoji. */
  icon?: string;
}

interface StoryTimelineProps {
  events: StoryEvent[];
  /** Çizgi + node rengi (tema accent). */
  lineColor?: string;
  /** Başlık rengi (tema ink). */
  titleColor?: string;
  /** Body rengi. */
  bodyColor?: string;
  /** Card background — body sayfası bg ile aynı (transparan kalır). */
  cardBg?: string;
  className?: string;
}

export function StoryTimeline({
  events,
  lineColor = "rgba(122, 138, 110, 0.45)",
  titleColor = "rgba(47, 53, 39, 1)",
  bodyColor = "rgba(92, 100, 80, 0.85)",
  cardBg = "rgba(255, 255, 255, 0.35)",
  className = "",
}: StoryTimelineProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[860px] py-12 ${className}`}>
      {/* Orta dikey çizgi */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 1,
          height: "100%",
          background: `linear-gradient(to bottom, transparent 0%, ${lineColor} 8%, ${lineColor} 92%, transparent 100%)`,
        }}
      />

      <ul className="relative space-y-16">
        {events.map((event, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 1.1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-start"
            >
              {/* Node — orta çizginin üstünde küçük daire */}
              <span
                aria-hidden
                className="absolute left-1/2 top-3 -translate-x-1/2"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: cardBg,
                  border: `1.5px solid ${lineColor}`,
                  boxShadow: `0 0 0 4px ${cardBg}`,
                }}
              />

              {/* Card — sol/sağ alternate */}
              <div
                className={`w-[calc(50%-32px)] ${isLeft ? "pr-12" : "ml-auto pl-12"}`}
              >
                <div
                  className="px-6 py-5"
                  style={{
                    background: cardBg,
                    border: `0.5px solid ${lineColor}`,
                    borderRadius: 2,
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <div
                    className="mb-2 text-[10px] uppercase"
                    style={{
                      color: bodyColor,
                      letterSpacing: "0.32em",
                      fontWeight: 300,
                    }}
                  >
                    {event.icon && <span style={{ marginRight: 6 }}>{event.icon}</span>}
                    {event.date}
                  </div>
                  <h3
                    className="font-display"
                    style={{
                      color: titleColor,
                      fontSize: "clamp(22px, 2.6vw, 32px)",
                      lineHeight: 1.1,
                      letterSpacing: "0.015em",
                      fontWeight: 300,
                      fontStyle: "italic",
                    }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="mt-3 text-[14px]"
                    style={{
                      color: bodyColor,
                      lineHeight: 1.65,
                      letterSpacing: "0.012em",
                      fontWeight: 300,
                    }}
                  >
                    {event.body}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
