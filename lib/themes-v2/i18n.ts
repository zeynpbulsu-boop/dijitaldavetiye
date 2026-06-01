import type { Locale } from "@/lib/i18n/types";

/**
 * Davetiye (themes-v2) arayüz metinleri — TR/EN/SR.
 *
 * Landing'in büyük `Messages` sözlüğünden AYRI tutulur: davetiye render'ı
 * kendi içinde tutarlı + bağımsız olsun diye. `invitation.locale` bridge'den
 * ThemeV2Data.locale'e gelir; ThemeShell bu modülden doğru dili seçip
 * context ile tüm section primitive'lerine dağıtır. Böylece EN/SR davetiye
 * misafiri artık hardcoded Türkçe görmez ("çoklu dil" özelliği gerçekten çalışır).
 */

export interface InvitationStrings {
  /** Görünmez (sr-only) semantik sayfa başlığı eki — "{çift} — {heading}". */
  heading: string;
  ceremony: { tapToOpen: string };
  countdown: {
    title: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
    passed: string;
  };
  venue: { label: string; directions: string };
  gift: {
    label: string;
    headline: string;
    accountHolder: string;
    bank: string;
    iban: string;
    copy: string;
    copied: string;
  };
  program: { label: string };
  hotels: { label: string; headline: string; reserve: string };
  rsvp: {
    eyebrow: string;
    title: string;
    name: string;
    email: string;
    attendance: string;
    yes: string;
    maybe: string;
    no: string;
    plusOne: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    required: string;
  };
  expired: {
    titleA: string;
    titleB: string;
    body: string;
    cta: string;
  };
}

const tr: InvitationStrings = {
  heading: "Düğün Davetiyesi",
  ceremony: { tapToOpen: "Açmak için dokun" },
  countdown: {
    title: "Geri Sayım",
    day: "Gün",
    hour: "Saat",
    minute: "Dakika",
    second: "Saniye",
    passed: "Bugün büyük gün — sizi aramızda görmek isteriz.",
  },
  venue: { label: "Konum", directions: "Yol Tarifi" },
  gift: {
    label: "Hediye",
    headline: "Varlığınız en büyük hediye",
    accountHolder: "Hesap Sahibi",
    bank: "Banka",
    iban: "IBAN",
    copy: "Kopyala",
    copied: "Kopyalandı",
  },
  program: { label: "Program" },
  hotels: {
    label: "Konaklama",
    headline: "Misafirlerimize öneriler",
    reserve: "Rezervasyon / detay →",
  },
  rsvp: {
    eyebrow: "Yanıt",
    title: "Katılımını Onayla",
    name: "Ad Soyad",
    email: "E-posta",
    attendance: "Katılım",
    yes: "Evet",
    maybe: "Belki",
    no: "Hayır",
    plusOne: "+1 ile geleceğim",
    submit: "Yanıtı Gönder",
    submitting: "Gönderiliyor…",
    successTitle: "Teşekkürler",
    successBody: "Cevabın bize ulaştı.",
    required: "Zorunlu",
  },
  expired: {
    titleA: "Bu davetiyenin",
    titleB: "süresi doldu",
    body: "Bu dijital davetiye bir yıl boyunca yayında kaldı ve nazikçe arşivlendi. Güzel bir gündü — umarız siz de oradaydınız.",
    cta: "Kendi davetiyeni oluştur →",
  },
};

const en: InvitationStrings = {
  heading: "Wedding Invitation",
  ceremony: { tapToOpen: "Tap to open" },
  countdown: {
    title: "Countdown",
    day: "Days",
    hour: "Hours",
    minute: "Minutes",
    second: "Seconds",
    passed: "Today is the big day — we'd love to see you there.",
  },
  venue: { label: "Location", directions: "Directions" },
  gift: {
    label: "Gift",
    headline: "Your presence is the greatest gift",
    accountHolder: "Account Holder",
    bank: "Bank",
    iban: "IBAN",
    copy: "Copy",
    copied: "Copied",
  },
  program: { label: "Schedule" },
  hotels: {
    label: "Where to stay",
    headline: "Recommendations for our guests",
    reserve: "Book / details →",
  },
  rsvp: {
    eyebrow: "RSVP",
    title: "Confirm your attendance",
    name: "Full name",
    email: "Email",
    attendance: "Attendance",
    yes: "Yes",
    maybe: "Maybe",
    no: "No",
    plusOne: "I'm bringing a +1",
    submit: "Send response",
    submitting: "Sending…",
    successTitle: "Thank you",
    successBody: "Your response has reached us.",
    required: "Required",
  },
  expired: {
    titleA: "This invitation",
    titleB: "has expired",
    body: "This digital invitation was live for a year and has been gently archived. It was a beautiful day — we hope you were there.",
    cta: "Create your own invitation →",
  },
};

const sr: InvitationStrings = {
  heading: "Pozivnica za venčanje",
  ceremony: { tapToOpen: "Dodirnite da otvorite" },
  countdown: {
    title: "Odbrojavanje",
    day: "Dana",
    hour: "Sati",
    minute: "Minuta",
    second: "Sekundi",
    passed: "Danas je veliki dan — radujemo se što ćete biti s nama.",
  },
  venue: { label: "Lokacija", directions: "Putanja" },
  gift: {
    label: "Poklon",
    headline: "Vaše prisustvo je najveći poklon",
    accountHolder: "Vlasnik računa",
    bank: "Banka",
    iban: "IBAN",
    copy: "Kopiraj",
    copied: "Kopirano",
  },
  program: { label: "Program" },
  hotels: {
    label: "Smeštaj",
    headline: "Preporuke za naše goste",
    reserve: "Rezerviši / detalji →",
  },
  rsvp: {
    eyebrow: "Potvrda",
    title: "Potvrdite dolazak",
    name: "Ime i prezime",
    email: "Email",
    attendance: "Dolazak",
    yes: "Da",
    maybe: "Možda",
    no: "Ne",
    plusOne: "Dolazim sa pratnjom (+1)",
    submit: "Pošalji odgovor",
    submitting: "Šalje se…",
    successTitle: "Hvala",
    successBody: "Vaš odgovor je stigao do nas.",
    required: "Obavezno",
  },
  expired: {
    titleA: "Ova pozivnica",
    titleB: "je istekla",
    body: "Ova digitalna pozivnica bila je aktivna godinu dana i nežno je arhivirana. Bio je to prelep dan — nadamo se da ste bili tu.",
    cta: "Napravite svoju pozivnicu →",
  },
};

const STRINGS: Record<Locale, InvitationStrings> = { tr, en, sr };

export function invitationStrings(locale: Locale | string | null | undefined): InvitationStrings {
  if (locale && locale in STRINGS) return STRINGS[locale as Locale];
  return tr;
}
