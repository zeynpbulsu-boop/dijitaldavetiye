/** Format an ISO date as "On Saturday, 21 June 2027" style English */
export function formatLongDateEn(iso: string): string {
  const d = new Date(iso);
  return `On ${d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

/** Format an ISO date as "15 Haziran 2026 · Pazar" style Turkish */
export function formatLongDateTr(iso: string): string {
  const d = new Date(iso);
  const datepart = d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const weekday = d.toLocaleDateString("tr-TR", { weekday: "long" });
  return `${datepart} · ${weekday}`;
}

/** Format as "15 · 06 · 2026" — display format used in invitations */
export function formatDotDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day} · ${month} · ${d.getFullYear()}`;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

/** Calculate time-until from now to a target ISO date */
export function calcCountdown(iso: string): Countdown {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    isPast: false,
  };
}

export function formatPriceTry(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}
