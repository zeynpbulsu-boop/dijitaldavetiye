import type { Locale } from "@/lib/i18n/types";

export type ThemeV2Slug =
  | "celenk"
  | "polaroid"
  | "kurdele"
  | "fener"
  | "defter"
  | "geceyarisi"
  | "postakart";

export interface ThemeV2Palette {
  bg: string;
  ink: string;
  inkSoft: string;
  accent: string;
  paper: string;
  countdownBg: string;
  countdownInk: string;
}

export interface ThemeV2Meta {
  slug: ThemeV2Slug;
  name: string;
  tagline: string;
  mood: string;
  signature: string;
  palette: ThemeV2Palette;
}

export interface InvitationDate {
  day: string;
  month: string;
  year: string;
  weekday?: string;
  time?: string;
  iso?: string;
}

export interface PolaroidPhoto {
  src?: string;
  caption: string;
  rotation?: number;
}

export interface ScheduleItem {
  time: string;
  label: string;
  desc?: string;
}

export interface MenuItem {
  name: string;
  detail?: string;
}

export interface MenuColumn {
  heading: string;
  items: MenuItem[];
}

export interface ThemeV2Data {
  /** Davetiyenin dili — arayüz metinleri bu dilde render edilir. */
  locale: Locale;
  /** Etkinlik türü (wedding/engagement/henna/save_the_date/birthday) —
   *  başlık ve meta bu türe göre uyarlanır. */
  eventType: string;
  coupleName: string;
  partnerOne: string;
  partnerTwo: string;
  monogram: string;
  eyebrow: string;
  greeting: string;
  date: InvitationDate;
  venue: {
    name: string;
    address?: string;
    city?: string;
    lat?: number | null;
    lng?: number | null;
  };
  story: {
    title: string;
    body: string;
  };
  photos: PolaroidPhoto[];
  schedule: ScheduleItem[];
  menu: MenuColumn[];
  extraInfo: string;
  footerNote: string;
  /** Optional gift / bank-transfer block (rendered only when present). */
  gift?: GiftInfo | null;
  /** Konaklama önerileri — boşsa ThemeShell bu bölümü render etmez. */
  hotels: HotelEntry[];
}

export interface HotelEntry {
  name: string;
  address?: string;
  price?: string;
  url?: string;
  note?: string;
}

export interface GiftInfo {
  iban?: string | null;
  bank?: string | null;
  accountHolder?: string | null;
  note?: string | null;
}

export interface ThemeV2Props {
  meta: ThemeV2Meta;
  data: ThemeV2Data;
}
