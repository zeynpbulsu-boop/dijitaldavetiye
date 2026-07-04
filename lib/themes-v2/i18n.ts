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
  ceremony: { tapToOpen: string; skip: string; dear: string; guestFallback: string; breakSeal: string };
  hero: {
    saveTheDate: string;
    awaitsYou: string;
    ourInvitation: string;
    toOurLoved: string;
    flipHint: string;
    flipBack: string;
  };
  music: { label: string; sub: string; tapToPlay: string };
  gallery: { title: string };
  scratch: { hint: string };
  phase: { toNight: string; toDay: string };
  extra: { title: string };
  countdown: {
    title: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
    passed: string;
  };
  venue: { label: string; directions: string; addToCalendar: string };
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
    namePlaceholder: string;
    emailPlaceholder: string;
    plusOnePlaceholder: string;
    side: string;
    sideBride: string;
    sideGroom: string;
    sideBoth: string;
    guestCount: string;
    dietary: string;
    dietaryPlaceholder: string;
    note: string;
    notePlaceholder: string;
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
  ceremony: { tapToOpen: "Açmak için dokun", skip: "Atla", dear: "Sevgili", guestFallback: "Kıymetli Misafirimiz", breakSeal: "Mührü kırmak için dokunun" },
  hero: {
    saveTheDate: "Save the Date",
    awaitsYou: "Bir davet sizi bekliyor",
    ourInvitation: "Davetiyemiz",
    toOurLoved: "Sevdiklerimize",
    flipHint: "çevirmek için dokunun →",
    flipBack: "← ön yüze dön",
  },
  music: { label: "Bizim Şarkımız", sub: "İlk dansımıza eşlik edin", tapToPlay: "çalmak için dokunun" },
  gallery: { title: "Anılarımız" },
  scratch: { hint: "Görmek için kazıyın" },
  phase: { toNight: "Gece görünümüne geç", toDay: "Gündüz görünümüne geç" },
  extra: { title: "Ek Bilgiler" },
  countdown: {
    title: "Geri Sayım",
    day: "Gün",
    hour: "Saat",
    minute: "Dakika",
    second: "Saniye",
    passed: "Bugün büyük gün — sizi aramızda görmek isteriz.",
  },
  venue: { label: "Konum", directions: "Yol Tarifi", addToCalendar: "Takvime Ekle" },
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
    namePlaceholder: "Adınız ve soyadınız",
    emailPlaceholder: "ornek@mail.com",
    plusOnePlaceholder: "Misafirin adı",
    side: "Hangi taraftan?",
    sideBride: "Gelin",
    sideGroom: "Damat",
    sideBoth: "İkisi de",
    guestCount: "Kaç kişi geliyorsunuz?",
    dietary: "Diyet / alerji",
    dietaryPlaceholder: "Vejetaryen, glutensiz, fındık alerjisi…",
    note: "Notunuz",
    notePlaceholder: "İletmek istediğiniz herhangi bir şey…",
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
  ceremony: { tapToOpen: "Tap to open", skip: "Skip", dear: "Dear", guestFallback: "Our Cherished Guest", breakSeal: "Tap to break the seal" },
  hero: {
    saveTheDate: "Save the Date",
    awaitsYou: "An invitation awaits you",
    ourInvitation: "Our Invitation",
    toOurLoved: "To our loved ones",
    flipHint: "tap to flip →",
    flipBack: "← back to front",
  },
  music: { label: "Our Song", sub: "Join us for our first dance", tapToPlay: "tap to play" },
  gallery: { title: "Our Memories" },
  scratch: { hint: "Scratch to reveal" },
  phase: { toNight: "Switch to night view", toDay: "Switch to day view" },
  extra: { title: "Details" },
  countdown: {
    title: "Countdown",
    day: "Days",
    hour: "Hours",
    minute: "Minutes",
    second: "Seconds",
    passed: "Today is the big day — we'd love to see you there.",
  },
  venue: { label: "Location", directions: "Directions", addToCalendar: "Add to Calendar" },
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
    namePlaceholder: "Your full name",
    emailPlaceholder: "you@mail.com",
    plusOnePlaceholder: "Guest's name",
    side: "Whose side?",
    sideBride: "Bride",
    sideGroom: "Groom",
    sideBoth: "Both",
    guestCount: "How many of you are coming?",
    dietary: "Dietary / allergies",
    dietaryPlaceholder: "Vegetarian, gluten-free, nut allergy…",
    note: "Your note",
    notePlaceholder: "Anything you'd like us to know…",
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
  ceremony: { tapToOpen: "Dodirnite da otvorite", skip: "Preskoči", dear: "Dragi", guestFallback: "Naši dragi gosti", breakSeal: "Dodirnite da slomite pečat" },
  hero: {
    saveTheDate: "Save the Date",
    awaitsYou: "Pozivnica vas čeka",
    ourInvitation: "Naša pozivnica",
    toOurLoved: "Našim najdražima",
    flipHint: "dodirnite da okrenete →",
    flipBack: "← nazad na prednju stranu",
  },
  music: { label: "Naša pesma", sub: "Pridružite nam se za prvi ples", tapToPlay: "dodirnite za reprodukciju" },
  gallery: { title: "Naše uspomene" },
  scratch: { hint: "Ogrebite da otkrijete" },
  phase: { toNight: "Pređi na noćni prikaz", toDay: "Pređi na dnevni prikaz" },
  extra: { title: "Dodatne informacije" },
  countdown: {
    title: "Odbrojavanje",
    day: "Dana",
    hour: "Sati",
    minute: "Minuta",
    second: "Sekundi",
    passed: "Danas je veliki dan — radujemo se što ćete biti s nama.",
  },
  venue: { label: "Lokacija", directions: "Putanja", addToCalendar: "Dodaj u kalendar" },
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
    namePlaceholder: "Vaše ime i prezime",
    emailPlaceholder: "vi@mail.com",
    plusOnePlaceholder: "Ime pratnje",
    side: "Sa čije strane?",
    sideBride: "Mlada",
    sideGroom: "Mladoženja",
    sideBoth: "Obe",
    guestCount: "Koliko vas dolazi?",
    dietary: "Ishrana / alergije",
    dietaryPlaceholder: "Vegetarijanac, bez glutena, alergija na orahe…",
    note: "Vaša poruka",
    notePlaceholder: "Sve što želite da nam kažete…",
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

/**
 * Etkinlik türüne + dile göre davetiye başlığı (semantik h1 + meta).
 * Landing "her etkinlik" vaat ediyor; doğum günü/nişan/kına davetiyesi artık
 * "Düğün Davetiyesi" demiyor. Bilinmeyen tür/dil → düğün/TR fallback.
 */
const EVENT_HEADINGS: Record<Locale, Record<string, string>> = {
  tr: {
    wedding: "Düğün Davetiyesi",
    engagement: "Nişan Davetiyesi",
    henna: "Kına Gecesi Daveti",
    save_the_date: "Save the Date",
    birthday: "Doğum Günü Daveti",
  },
  en: {
    wedding: "Wedding Invitation",
    engagement: "Engagement Invitation",
    henna: "Henna Night Invitation",
    save_the_date: "Save the Date",
    birthday: "Birthday Invitation",
  },
  sr: {
    wedding: "Pozivnica za venčanje",
    engagement: "Pozivnica za veridbu",
    henna: "Pozivnica za veče kane",
    save_the_date: "Sačuvajte datum",
    birthday: "Pozivnica za rođendan",
  },
};

export function eventHeading(
  locale: Locale | string | null | undefined,
  eventType: string | null | undefined,
): string {
  const loc = locale && locale in EVENT_HEADINGS ? (locale as Locale) : "tr";
  const map = EVENT_HEADINGS[loc];
  return map[eventType ?? "wedding"] ?? map.wedding;
}

/**
 * Hero eyebrow varsayılanı — etkinlik türüne + dile göre. Host kendi
 * eyebrow'unu girmezse (boş bırakırsa) bu gösterilir; doğum günü davetiyesi
 * artık "Düğün törenimize davetlisiniz" demez.
 */
const EVENT_EYEBROWS: Record<Locale, Record<string, string>> = {
  tr: {
    wedding: "Düğün törenimize davetlisiniz",
    engagement: "Nişan törenimize davetlisiniz",
    henna: "Kına gecemize davetlisiniz",
    save_the_date: "Tarihi ajandanıza not edin",
    birthday: "Doğum günü kutlamamıza davetlisiniz",
  },
  en: {
    wedding: "You're invited to our wedding",
    engagement: "You're invited to our engagement",
    henna: "You're invited to our henna night",
    save_the_date: "Save our date",
    birthday: "You're invited to the birthday celebration",
  },
  sr: {
    wedding: "Pozvani ste na naše venčanje",
    engagement: "Pozvani ste na našu veridbu",
    henna: "Pozvani ste na naše veče kane",
    save_the_date: "Zabeležite naš datum",
    birthday: "Pozvani ste na proslavu rođendana",
  },
};

export function defaultEyebrow(
  locale: Locale | string | null | undefined,
  eventType: string | null | undefined,
): string {
  const loc = locale && locale in EVENT_EYEBROWS ? (locale as Locale) : "tr";
  const map = EVENT_EYEBROWS[loc];
  return map[eventType ?? "wedding"] ?? map.wedding;
}
