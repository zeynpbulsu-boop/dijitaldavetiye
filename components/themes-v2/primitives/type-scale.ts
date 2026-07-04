/**
 * Tipografi ölçek sabitleri (K5) — bölümden bölüme başlık boyu değişmesin,
 * scroll ritmi tek nefese otursun diye tüm section primitive'leri bu üç
 * ölçekten beslenir. Değerler tasarım yönergesinden:
 *   H2         — section başlıkları (countdown tarihi, RSVP, konum, hediye…)
 *   LEAD       — başlık altı tanıtım/lead paragrafları
 *   CARD_TITLE — kart içi başlıklar (otel adı, program etiketi…)
 */
export const H2 = "clamp(30px, 5vw, 50px)";
export const LEAD = "clamp(15px, 1.9vw, 19px)";
export const CARD_TITLE = "clamp(16px, 2vw, 20px)";
