/**
 * Email sender — uses Resend's REST API directly so we don't add an
 * SDK dep for one POST. Falls back to a console log + no-op when the
 * API key isn't configured (so dev / local work without Resend).
 *
 * Configure via env:
 *   RESEND_API_KEY      (required for actual sending)
 *   NUVE_FROM_EMAIL     (e.g. "NUVE <hello@nuve.app>") — optional, has a default
 */

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  /** Optional plain-text fallback for clients that don't render HTML. */
  text?: string;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "NUVE <hello@nuve.app>";

export async function sendEmail(args: SendArgs): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(
      "[email] RESEND_API_KEY not set — skipped:",
      args.subject,
      "→",
      args.to,
    );
    return { ok: false };
  }
  if (!args.to.includes("@")) {
    console.warn("[email] Invalid 'to' address:", args.to);
    return { ok: false };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.NUVE_FROM_EMAIL ?? DEFAULT_FROM,
        to: [args.to],
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn("[email] Resend rejected:", res.status, body);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.warn("[email] Send failed:", err);
    return { ok: false };
  }
}

/* ---------- Templates ---------- */

const cream = "#F2EEE6";
const ink = "#2B1E16";
const cognac = "#8C5A3C";

function wrap(inner: string): string {
  // Inline-styles only — most email clients drop <style> blocks.
  return `<!doctype html><html><body style="margin:0;padding:0;background:${cream};font-family:Georgia,serif;color:${ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${cream};padding:40px 20px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid rgba(43,30,22,0.10);border-radius:8px;padding:36px 32px;">
      <tr><td>
        <div style="font-family:Georgia,serif;font-style:italic;font-size:26px;color:${ink};line-height:1;letter-spacing:-0.01em;">nuve<span style="color:${cognac};">.</span></div>
        <div style="height:1px;background:rgba(43,30,22,0.10);margin:24px 0;"></div>
        ${inner}
        <div style="height:1px;background:rgba(43,30,22,0.10);margin:28px 0 16px;"></div>
        <p style="font-family:Inter,Arial,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(43,30,22,0.55);margin:0;">
          NUVE · İstanbul · Made with care
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/** Couple → confirmation that payment is in + admin URL */
export function paymentReceivedEmail(args: {
  to: string;
  coupleLine: string;
  tier: string;
  adminUrl: string;
  publicUrl: string;
}): SendArgs {
  return {
    to: args.to,
    subject: `${args.coupleLine} — davetiyen hazırlanıyor`,
    html: wrap(`
      <p style="font-family:Georgia,serif;font-size:22px;line-height:1.35;color:${ink};margin:0 0 16px;">
        Teşekkürler.<br />
        <span style="font-style:italic;color:${cognac};">Davetiyen yola çıkıyor.</span>
      </p>
      <p style="font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.65;color:rgba(43,30,22,0.78);margin:0 0 20px;">
        Stüdyomuzdaki bir kişi <strong>${escapeHtml(args.coupleLine)}</strong> siparişine atandı.
        ${escapeHtml(args.tier)} paketiyle, 48 saat içinde davetiyen canlıya alınacak.
      </p>
      <p style="font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.65;color:rgba(43,30,22,0.78);margin:20px 0 8px;">
        <strong>Admin paneli</strong> — RSVP yanıtlarını buradan takip edeceksin.
        Bu linki kimseyle paylaşma.
      </p>
      <p style="margin:0 0 18px;"><a href="${args.adminUrl}" style="font-family:Inter,Arial,sans-serif;font-size:13px;color:${cognac};word-break:break-all;">${args.adminUrl}</a></p>
      <p style="font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.65;color:rgba(43,30,22,0.78);margin:0 0 8px;">
        <strong>Public davetiye linki</strong> — davetiye canlıya alındığında bu URL açılacak.
      </p>
      <p style="margin:0;"><a href="${args.publicUrl}" style="font-family:Inter,Arial,sans-serif;font-size:13px;color:${cognac};word-break:break-all;">${args.publicUrl}</a></p>
    `),
    text: [
      "Tesekkurler. Davetiyen yola cikiyor.",
      `${args.coupleLine} - ${args.tier}`,
      "",
      `Admin: ${args.adminUrl}`,
      `Davetiye: ${args.publicUrl}`,
    ].join("\n"),
  };
}

/** Couple → notify of a new RSVP */
export function rsvpReceivedEmail(args: {
  to: string;
  guestName: string;
  attendance: string;
  adminUrl: string;
}): SendArgs {
  const attendanceLabel =
    args.attendance === "yes"
      ? "Evet, geliyor"
      : args.attendance === "no"
        ? "Hayır, gelemiyor"
        : "Belki";
  return {
    to: args.to,
    subject: `Yeni RSVP — ${args.guestName}`,
    html: wrap(`
      <p style="font-family:Georgia,serif;font-size:22px;line-height:1.35;margin:0 0 14px;">
        Yeni bir <span style="font-style:italic;color:${cognac};">yanıt</span>.
      </p>
      <p style="font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.7;margin:0 0 16px;color:rgba(43,30,22,0.78);">
        <strong>${escapeHtml(args.guestName)}</strong> davetine yanıt verdi:
        <span style="color:${cognac};font-weight:600;">${escapeHtml(attendanceLabel)}</span>
      </p>
      <p style="margin:18px 0 0;"><a href="${args.adminUrl}" style="font-family:Inter,Arial,sans-serif;font-size:13px;color:${cognac};">Tüm yanıtları gör →</a></p>
    `),
    text: `Yeni RSVP: ${args.guestName} — ${attendanceLabel}\nYanıtları gör: ${args.adminUrl}`,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
