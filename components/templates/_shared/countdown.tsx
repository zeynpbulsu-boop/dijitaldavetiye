"use client";

import { useEffect, useState } from "react";
import { calcCountdown } from "@/lib/format";

interface CountdownProps {
  targetIso: string;
  labels?: { days: string; hours: string; minutes: string; seconds: string };
  /** Color override for numbers */
  numberColor?: string;
  /** Color override for labels */
  labelColor?: string;
  /** Color of the ":" separator */
  separatorColor?: string;
}

const defaultLabels = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

export function Countdown({
  targetIso,
  labels = defaultLabels,
  numberColor,
  labelColor,
  separatorColor,
}: CountdownProps) {
  const [cd, setCd] = useState(() => calcCountdown(targetIso));

  useEffect(() => {
    const id = setInterval(() => setCd(calcCountdown(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (cd.isPast) {
    return (
      <div
        className="font-serif italic text-[28px]"
        style={{ color: numberColor ?? "var(--accent-deep)" }}
      >
        Bugün!
      </div>
    );
  }

  const numStyle = numberColor ? { color: numberColor } : undefined;
  const lblStyle = labelColor ? { color: labelColor } : undefined;
  const sepStyle = { color: separatorColor ?? "var(--gold-deep, #8A6D45)" };

  return (
    <div className="text-center">
      <div className="flex items-baseline justify-center gap-3 font-serif">
        <div className="text-[36px] leading-none min-w-[40px]" style={numStyle}>
          {cd.days}
        </div>
        <span className="text-[36px]" style={sepStyle}>
          :
        </span>
        <div className="text-[36px] leading-none min-w-[40px]" style={numStyle}>
          {String(cd.hours).padStart(2, "0")}
        </div>
        <span className="text-[36px]" style={sepStyle}>
          :
        </span>
        <div className="text-[36px] leading-none min-w-[40px]" style={numStyle}>
          {String(cd.minutes).padStart(2, "0")}
        </div>
        <span className="text-[36px]" style={sepStyle}>
          :
        </span>
        <div className="text-[36px] leading-none min-w-[40px]" style={numStyle}>
          {String(cd.seconds).padStart(2, "0")}
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-3">
        {(["days", "hours", "minutes", "seconds"] as const).map((k) => (
          <div
            key={k}
            className="min-w-[40px] text-[10px] font-medium uppercase tracking-[0.3em]"
            style={lblStyle ?? { color: "var(--muted, #8A7D70)" }}
          >
            {labels[k]}
          </div>
        ))}
      </div>
    </div>
  );
}
