-- 006_gifts_and_hotels.sql — Pressed Love Como demo paritesi
--
-- Como davetiyesi inceleme: Banka hesabı + Hediye notu + 4 otel
-- önerisi bloğu vardı. TR pazarında "altın takma + IBAN" geleneği
-- bizim için zaten kritik; Pressed Love'da bile var demek default
-- feature olduğunu gösteriyor.
--
-- Yeni kolonlar (hepsi nullable, geçmiş satırlar etkilenmez):
--   gift_iban           IBAN (TR format dahil 34 karaktere kadar)
--   gift_bank           banka adı
--   gift_account_holder hesap sahibi adı
--   gift_note           opsiyonel ekstra not (Türk geleneğine
--                       referansla "altın takma" notu vs.)
--   hotels              jsonb array: { name, address?, price?,
--                       url?, note? }
--
-- Apply: supabase db push veya dashboard SQL editor.

alter table public.invitations
  add column if not exists gift_iban           text,
  add column if not exists gift_bank           text,
  add column if not exists gift_account_holder text,
  add column if not exists gift_note           text,
  add column if not exists hotels              jsonb not null default '[]'::jsonb;

comment on column public.invitations.gift_iban
  is 'Çift için banka hesabı IBAN (hediye için).';
comment on column public.invitations.gift_bank
  is 'Banka adı — IBAN ile birlikte UI''da gösterilir.';
comment on column public.invitations.gift_account_holder
  is 'Hesap sahibi adı.';
comment on column public.invitations.gift_note
  is 'Ekstra hediye notu — TR örnek: "İsmin referans alanına yazılırsa minnet duyarız".';
comment on column public.invitations.hotels
  is 'Otel önerileri (JSONB array). Her giriş: { name, address?, price?, url?, note? }';
