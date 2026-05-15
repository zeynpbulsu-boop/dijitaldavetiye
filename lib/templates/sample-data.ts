import type { InvitationData } from "./types";

/**
 * Sample data used to render template previews. Each template can override
 * this with its own demo couple to better suit the design.
 */
export const defaultSampleData: InvitationData = {
  partnerOne: "Clara",
  partnerTwo: "Elliot",
  partnerOneFull: "Clara Ashford",
  partnerTwoFull: "Elliot Reed",
  monogram: "C & E",
  date: "2027-06-21",
  timeOfDay: "Twelve thirty in the afternoon",
  location: "Occitanie, France",
  venue: "Château de la Rose",
  rsvpDeadline: "2027-05-01",
  coverPhoto:
    "https://images.unsplash.com/photo-1525772764200-be829a350797?auto=format&fit=crop&w=800&q=80",
  galleryPhotos: [
    "https://images.unsplash.com/photo-1674581217672-27e3010ed09a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1768445338301-dccd39b5923f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1676070096487-32dd955e09e0?auto=format&fit=crop&w=600&q=80",
  ],
  storyParagraphs: [
    "We first met on a quiet evening in Karaköy. Elliot was reading in a small café, Clara was waiting for her friends at the next table.",
    "Three years, countless journeys, shared coffees and quiet promises later, we are ready to make the biggest one.",
  ],
  slug: "clara-ve-elliot",
};

export const turkishSample: InvitationData = {
  partnerOne: "Ali",
  partnerTwo: "Zeynep",
  partnerOneFull: "Ali Yılmaz",
  partnerTwoFull: "Zeynep Demir",
  monogram: "A & Z",
  date: "2026-06-15",
  timeOfDay: "On sekiz buçukta",
  location: "İstanbul, Türkiye",
  venue: "Sait Halim Paşa Yalısı",
  rsvpDeadline: "2026-05-15",
  coverPhoto:
    "https://images.unsplash.com/photo-1525772764200-be829a350797?auto=format&fit=crop&w=800&q=80",
  galleryPhotos: [
    "https://images.unsplash.com/photo-1674581217672-27e3010ed09a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1768445338301-dccd39b5923f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1676070096487-32dd955e09e0?auto=format&fit=crop&w=600&q=80",
  ],
  slug: "ali-ve-zeynep",
};
