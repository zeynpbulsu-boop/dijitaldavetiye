-- 007_venue_coords.sql — venue koordinatları
--
-- B.3 — Pressed Love Como demosunda venue için "How to get there"
-- linki + harita önizlemesi vardı. Bizde harita yoktu; bu migration
-- iki numeric kolon ekleyip OpenStreetMap iframe + Google Maps yol
-- tarifi deep link açabilmemizi sağlıyor.
--
-- Apply: supabase db push veya dashboard SQL editor.

alter table public.invitations
  add column if not exists venue_lat numeric(9, 6),  -- ±90.000000, 6 hane
  add column if not exists venue_lng numeric(9, 6);  -- ±180.000000, 6 hane

comment on column public.invitations.venue_lat is
  'Düğün yerinin enlemi (decimal degrees). Null ise harita gizlenir.';
comment on column public.invitations.venue_lng is
  'Düğün yerinin boylamı (decimal degrees). Null ise harita gizlenir.';
