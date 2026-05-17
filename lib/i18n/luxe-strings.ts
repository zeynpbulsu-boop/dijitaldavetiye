/**
 * LuxeEditionDemo'nun locale-aware string'leri.
 *
 * Daha önce SCHEDULE, FAQ ve section başlıkları component içinde TR
 * hardcoded yazılıydı — Pressed Love 19+ dil destekliyordu, biz sadece
 * TR'deydik. Bu dosya o gap'i kapatıyor: theme.locale değerine göre
 * (default "tr") dictionary seçilir.
 *
 * Yeni dil eklemek için: ilgili anahtara TR'deki sözcüklere paralel
 * çevirileri ekle. Eksik anahtar kalırsa TS hata verir.
 */

export type LuxeLocale = "tr" | "en" | "sr";

export interface LuxeStrings {
  /* Section eyebrows (uppercase, tracked) */
  sections: {
    slotMachine: { eyebrow: string; title: string; helper: string };
    countdown: { eyebrow: string; title: string };
    schedule: { eyebrow: string; title: string };
    music: { eyebrow: string; title: string };
    rsvp: { eyebrow: string; title: string };
    faq: { eyebrow: string; title: string };
    gallery: { eyebrow: string; title: string };
    calendarGoogle: string;
    calendarIcs: string;
  };
  countdownLabels: { d: string; h: string; m: string; s: string };
  countdownPastLabel: string;
  schedule: ReadonlyArray<{
    time: string;
    title: string;
    desc: string;
    icon: "bell" | "glass" | "plate" | "star";
  }>;
  faq: ReadonlyArray<{ q: string; a: string }>;
  footerFallback: string;
}

const TR: LuxeStrings = {
  sections: {
    slotMachine: {
      eyebrow: "— Tarihi Değiştirin",
      title: "Kendi gününüzü seçin",
      helper:
        "Slot makinesini çevirin — yukarıdaki tarih anında güncellensin. Demo modundadır; gerçek davetiyenizde editörden ayarlarsınız.",
    },
    countdown: { eyebrow: "— Geri Sayım", title: "Birlikteliğimize" },
    schedule: { eyebrow: "— O Günün Akışı", title: "Programımız" },
    music: { eyebrow: "— Bizim Müziğimiz", title: "O Anın Sesi" },
    rsvp: { eyebrow: "— Yanıt", title: "Bizimle olur musun?" },
    faq: { eyebrow: "— Sıkça Sorulanlar", title: "Aklındaki Sorular" },
    gallery: { eyebrow: "— Anılarımız", title: "Bir bakış" },
    calendarGoogle: "Google Takvim",
    calendarIcs: "Apple / Outlook (.ics)",
  },
  countdownLabels: { d: "Gün", h: "Saat", m: "Dakika", s: "Saniye" },
  countdownPastLabel: "Düğün günü geldi.",
  schedule: [
    { time: "16:00", title: "Tören · Şapelde", desc: "Sevgiyi taş duvarların arasında mühürleyeceğiz", icon: "bell" },
    { time: "17:30", title: "Aperitivo · Bahçede", desc: "Prosecco, mevsim çiçekleri arasında", icon: "glass" },
    { time: "19:30", title: "Akşam Yemeği · Loggia'da", desc: "Mum ışığında, yıldızların altında", icon: "plate" },
    { time: "22:00", title: "Dans · Sarmaşıkların Altında", desc: "Sabaha kadar bizimle kalın", icon: "star" },
  ] as const,
  faq: [
    { q: "Mekana nasıl ulaşırız?", a: "Detaylı yol tarifini RSVP onayından sonra paylaşacağız." },
    { q: "Ne giymeli?", a: "Bahçe-şık. Topuklu yerine alçak topuk veya zarif sandalet öneririz." },
    { q: "Çocuklar gelebilir mi?", a: "Elbette — küçük misafirler için ayrı bir alan ve aktivite planımız var." },
    { q: "Konaklama önerisi?", a: "Yakındaki 3 boutique otel ile özel kontenjan ayırdık." },
  ] as const,
  footerFallback: "Bizimle olmanız bizi onurlandırır",
};

const EN: LuxeStrings = {
  sections: {
    slotMachine: {
      eyebrow: "— Change the Date",
      title: "Pick your own day",
      helper:
        "Spin the slot machine — the date above updates instantly. Demo mode; on your real invitation you set it in the editor.",
    },
    countdown: { eyebrow: "— Countdown", title: "Until we're together" },
    schedule: { eyebrow: "— The Day's Flow", title: "Programme" },
    music: { eyebrow: "— Our Music", title: "The Sound of the Moment" },
    rsvp: { eyebrow: "— Reply", title: "Will you be there?" },
    faq: { eyebrow: "— Frequently Asked", title: "On your mind" },
    gallery: { eyebrow: "— Our memories", title: "A glimpse" },
    calendarGoogle: "Google Calendar",
    calendarIcs: "Apple / Outlook (.ics)",
  },
  countdownLabels: { d: "Days", h: "Hours", m: "Minutes", s: "Seconds" },
  countdownPastLabel: "Today is the day.",
  schedule: [
    { time: "16:00", title: "Ceremony · At the chapel", desc: "We'll seal our love within these stone walls", icon: "bell" },
    { time: "17:30", title: "Aperitivo · In the garden", desc: "Prosecco among seasonal flowers", icon: "glass" },
    { time: "19:30", title: "Dinner · On the loggia", desc: "By candlelight, under the stars", icon: "plate" },
    { time: "22:00", title: "Dancing · Under the vines", desc: "Stay with us until dawn", icon: "star" },
  ] as const,
  faq: [
    { q: "How do we reach the venue?", a: "We'll share detailed directions after we receive your RSVP." },
    { q: "What should we wear?", a: "Garden-chic. We recommend low heels or elegant sandals over stilettos." },
    { q: "Can we bring our children?", a: "Of course — we have a dedicated space and activities for little guests." },
    { q: "Where should we stay?", a: "We've held a block at three nearby boutique hotels." },
  ] as const,
  footerFallback: "Your presence honors us",
};

const SR: LuxeStrings = {
  sections: {
    slotMachine: {
      eyebrow: "— Promenite Datum",
      title: "Izaberite svoj dan",
      helper:
        "Okrenite slot — datum iznad se odmah ažurira. Demo režim; na pravoj pozivnici datum se podešava u uređivaču.",
    },
    countdown: { eyebrow: "— Odbrojavanje", title: "Do našeg dana" },
    schedule: { eyebrow: "— Tok Dana", title: "Program" },
    music: { eyebrow: "— Naša Muzika", title: "Zvuk trenutka" },
    rsvp: { eyebrow: "— Odgovor", title: "Da li ćeš biti tu?" },
    faq: { eyebrow: "— Često Postavljana", title: "Pitanja" },
    gallery: { eyebrow: "— Naše uspomene", title: "Pogled" },
    calendarGoogle: "Google kalendar",
    calendarIcs: "Apple / Outlook (.ics)",
  },
  countdownLabels: { d: "Dani", h: "Sati", m: "Minuti", s: "Sekunde" },
  countdownPastLabel: "Danas je taj dan.",
  schedule: [
    { time: "16:00", title: "Venčanje · U kapeli", desc: "Pred kamenim zidovima ćemo zapečatiti našu ljubav", icon: "bell" },
    { time: "17:30", title: "Aperitiv · U bašti", desc: "Prosecco među sezonskim cvetovima", icon: "glass" },
    { time: "19:30", title: "Večera · Na lođi", desc: "Pri svetlosti sveća, pod zvezdama", icon: "plate" },
    { time: "22:00", title: "Igranka · Pod lozom", desc: "Ostanite sa nama do zore", icon: "star" },
  ] as const,
  faq: [
    { q: "Kako da stignemo do mesta?", a: "Detaljne instrukcije za put šaljemo nakon vašeg potvrđenog dolaska." },
    { q: "Šta da obučemo?", a: "Bašta-šik. Preporučujemo niže potpetice ili elegantne sandale." },
    { q: "Da li smemo da dovedemo decu?", a: "Naravno — pripremili smo poseban prostor i aktivnosti za male goste." },
    { q: "Gde da odsednemo?", a: "Rezervisali smo blok soba u tri obližnja boutique hotela." },
  ] as const,
  footerFallback: "Vaše prisustvo nas časti",
};

const STRINGS: Record<LuxeLocale, LuxeStrings> = { tr: TR, en: EN, sr: SR };

export function luxeStrings(locale: LuxeLocale | undefined): LuxeStrings {
  if (locale && STRINGS[locale]) return STRINGS[locale];
  return STRINGS.tr;
}
