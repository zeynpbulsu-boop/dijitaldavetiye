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
}

export interface ThemeV2Props {
  meta: ThemeV2Meta;
  data: ThemeV2Data;
}
