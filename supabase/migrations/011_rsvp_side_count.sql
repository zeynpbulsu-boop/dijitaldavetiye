-- Migration 011 — RSVP'ye taraf (gelin/damat) ve kişi sayısı alanları.
-- Rakip paritesi: BizEvleniyoruz RSVP'si taraf + kişi sayısı topluyor;
-- bizde yalnızca plus_one boolean'ı vardı (2+ misafirli aile giremiyordu).
-- İki kolon da nullable → mevcut satırlar ve eski istemciler etkilenmez.

alter table public.rsvps
  add column if not exists side text
    check (side in ('bride', 'groom', 'both')),
  add column if not exists guest_count integer
    check (guest_count between 1 and 20);

comment on column public.rsvps.side is
  'Misafir hangi taraftan — bride/groom/both (Migration 011)';
comment on column public.rsvps.guest_count is
  'Toplam gelen kişi sayısı, misafirin kendisi dahil (Migration 011)';
