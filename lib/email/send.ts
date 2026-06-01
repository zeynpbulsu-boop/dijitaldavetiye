/**
 * Email sender — uses Resend's REST API directly so we don't add an
 * SDK dep for one POST. Falls back to a console log + no-op when the
 * API key isn't configured (so dev / local work without Resend).
 *
 * Configure via env:
 *   RESEND_API_KEY      (required for actual sending)
 *   NUVE_FROM_EMAIL     (e.g. "NUVE <hello@nuve.app>") — optional, has a default
 */

import { log } from "@/lib/log";

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
    // PII: alıcı adresi log'a yazılmaz, sadece subject.
    log.warn("email", "RESEND_API_KEY not set — skipped", args.subject);
    return { ok: false };
  }
  if (!args.to.includes("@")) {
    log.warn("email", "Invalid 'to' address");
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
      log.warn("email", "Resend rejected", { status: res.status, body });
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    log.warn("email", "Send failed", err);
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

/** Couple → ödeme onayı + düzenleme (editör) + RSVP + public linkleri */
export function paymentReceivedEmail(args: {
  to: string;
  coupleLine: string;
  tier: string;
  editorUrl: string;
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
      <p style="font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.65;color:rgba(43,30,22,0.78);margin:0 0 22px;">
        <strong>${escapeHtml(args.coupleLine)}</strong> · ${escapeHtml(args.tier)} paketi alındı.
        Sıra detayları hazırlamada — birkaç dakika sürer.
      </p>

      <p style="font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.65;color:rgba(43,30,22,0.78);margin:0 0 10px;">
        <strong>1 · Davetiyeni hazırla</strong> — isimler, tarih, mekân (Google Maps linki), müzik, fotoğraflar.
      </p>
      <p style="margin:0 0 22px;">
        <a href="${args.editorUrl}" style="display:inline-block;background:${ink};color:#F6F1EA;font-family:Inter,Arial,sans-serif;font-size:13px;letter-spacing:0.04em;text-decoration:none;padding:12px 26px;border-radius:999px;">Davetiyeni Düzenle →</a>
      </p>
      <p style="margin:0 0 22px;"><a href="${args.editorUrl}" style="font-family:Inter,Arial,sans-serif;font-size:12px;color:${cognac};word-break:break-all;">${args.editorUrl}</a></p>

      <p style="font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.65;color:rgba(43,30,22,0.78);margin:0 0 14px;">
        <strong>2 · Biz kontrol edip yayınlıyoruz</strong> — sen hazırlayınca davetiyeni gözden geçirip canlıya alıyoruz (en geç 48 saat).
      </p>

      <p style="font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.65;color:rgba(43,30,22,0.78);margin:0 0 6px;">
        <strong>RSVP takibi</strong> — yanıtları buradan görürsün (bu linki paylaşma):
      </p>
      <p style="margin:0 0 16px;"><a href="${args.adminUrl}" style="font-family:Inter,Arial,sans-serif;font-size:12px;color:${cognac};word-break:break-all;">${args.adminUrl}</a></p>

      <p style="font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.65;color:rgba(43,30,22,0.78);margin:0 0 6px;">
        <strong>Davetiye linki</strong> — canlıya alınınca açılır, misafirlere bunu gönderirsin:
      </p>
      <p style="margin:0;"><a href="${args.publicUrl}" style="font-family:Inter,Arial,sans-serif;font-size:12px;color:${cognac};word-break:break-all;">${args.publicUrl}</a></p>
    `),
    text: [
      "Tesekkurler. Davetiyen yola cikiyor.",
      `${args.coupleLine} - ${args.tier}`,
      "",
      `1) Davetiyeni duzenle: ${args.editorUrl}`,
      `2) Biz kontrol edip yayinliyoruz (en gec 48 saat).`,
      `RSVP takibi: ${args.adminUrl}`,
      `Davetiye linki: ${args.publicUrl}`,
    ].join("\n"),
  };
}

/** Guest → confirmation that their RSVP was received (FAZ C.6) */
interface RsvpEmailStrings {
  attend: { yes: string; no: string; maybe: string };
  subjYes: string;
  subjOther: string;
  bodyYes: string;
  bodyNo: string;
  bodyMaybe: string;
  saved: string;
  date: string;
  venue: string;
  seeAgain: string;
}

const RSVP_EMAIL_I18N: Record<string, RsvpEmailStrings> = {
  tr: {
    attend: { yes: "Geliyorum", no: "Gelemiyorum", maybe: "Belki" },
    subjYes: "yanıtın bize ulaştı",
    subjOther: "yanıtın için teşekkürler",
    bodyYes: "Görüşmek için sabırsızlanıyoruz, {name}.",
    bodyNo: "Yanıtın için teşekkürler, {name}. Bizim için orada olmasan da yanımızdasın.",
    bodyMaybe: "Yanıtın için teşekkürler, {name}. Kararını netleştirdiğinde haber verebilirsin.",
    saved: "Yanıtın kaydedildi.",
    date: "Tarih:",
    venue: "Mekan:",
    seeAgain: "Davetiyeyi tekrar görmek istersen:",
  },
  en: {
    attend: { yes: "Attending", no: "Not attending", maybe: "Maybe" },
    subjYes: "we got your response",
    subjOther: "thank you for your response",
    bodyYes: "We can't wait to see you, {name}.",
    bodyNo: "Thank you for letting us know, {name}. You're with us even if you can't be there.",
    bodyMaybe: "Thank you for your response, {name}. Let us know once you've decided.",
    saved: "Your response is saved.",
    date: "Date:",
    venue: "Venue:",
    seeAgain: "To see the invitation again:",
  },
  sr: {
    attend: { yes: "Dolazim", no: "Ne dolazim", maybe: "Možda" },
    subjYes: "stigao je tvoj odgovor",
    subjOther: "hvala na odgovoru",
    bodyYes: "Jedva čekamo da te vidimo, {name}.",
    bodyNo: "Hvala što si nam javio/la, {name}. Sa nama si i ako ne možeš da budeš tu.",
    bodyMaybe: "Hvala na odgovoru, {name}. Javi nam kada odlučiš.",
    saved: "Tvoj odgovor je sačuvan.",
    date: "Datum:",
    venue: "Mesto:",
    seeAgain: "Da ponovo vidiš pozivnicu:",
  },
};

export function guestRsvpConfirmationEmail(args: {
  to: string;
  guestName: string;
  attendance: "yes" | "no" | "maybe";
  coupleLine: string;
  weddingDate?: string | null;
  venue?: string | null;
  publicUrl: string;
  locale?: string | null;
}): SendArgs {
  const L = RSVP_EMAIL_I18N[args.locale ?? "tr"] ?? RSVP_EMAIL_I18N.tr;
  const nameStrong = `<strong>${escapeHtml(args.guestName)}</strong>`;

  const attendanceLabel = L.attend[args.attendance];

  const subject =
    args.attendance === "yes"
      ? `${args.coupleLine} — ${L.subjYes}`
      : `${args.coupleLine} — ${L.subjOther}`;

  const bodyTemplate =
    args.attendance === "yes"
      ? L.bodyYes
      : args.attendance === "no"
        ? L.bodyNo
        : L.bodyMaybe;
  const headlineBody = bodyTemplate.replace("{name}", nameStrong);

  const detailsBlock = [
    args.weddingDate ? `<strong>${L.date}</strong> ${escapeHtml(args.weddingDate)}` : "",
    args.venue ? `<strong>${L.venue}</strong> ${escapeHtml(args.venue)}` : "",
  ]
    .filter(Boolean)
    .join("<br />");

  return {
    to: args.to,
    subject,
    html: wrap(`
      <p style="font-family:Georgia,serif;font-size:22px;line-height:1.35;color:${ink};margin:0 0 16px;">
        ${L.saved}<br />
        <span style="font-style:italic;color:${cognac};">${escapeHtml(attendanceLabel)}.</span>
      </p>
      <p style="font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.7;color:rgba(43,30,22,0.78);margin:0 0 18px;">
        ${headlineBody}
      </p>
      ${
        detailsBlock
          ? `<div style="background:${cream};border-radius:6px;padding:14px 18px;margin:18px 0;font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.7;color:rgba(43,30,22,0.78);">
              ${detailsBlock}
            </div>`
          : ""
      }
      <p style="font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.65;color:rgba(43,30,22,0.78);margin:18px 0 8px;">
        ${L.seeAgain}
      </p>
      <p style="margin:0;"><a href="${args.publicUrl}" style="font-family:Inter,Arial,sans-serif;font-size:13px;color:${cognac};word-break:break-all;">${args.publicUrl}</a></p>
    `),
    text: [
      `${L.saved} - ${attendanceLabel}`,
      `${args.coupleLine}`,
      args.weddingDate ? `${L.date} ${args.weddingDate}` : "",
      args.venue ? `${L.venue} ${args.venue}` : "",
      "",
      `${args.publicUrl}`,
    ]
      .filter(Boolean)
      .join("\n"),
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
