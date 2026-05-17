-- 005_media_and_wax_color.sql — rakip kapatma turu 2
--
-- Pressed Love'da Essential+ tier'da "Wax seal color selection" ve
-- "Custom hero media + intro video"; Premium'da "Photo & video gallery"
-- var. Bunlar üç ek kolon + bir Storage bucket ile bizde de mümkün:
--
--   - wax_seal_color  → hex string (default null = preset rengi)
--   - hero_media_url  → couple'ın yüklediği venue/engagement fotosu
--   - photos          → galeri için url[] (JSONB array)
--
-- Storage tarafı: 'couple-media' isimli public-read bucket. Couple'ın
-- yüklediği dosyalar burada barınır. RLS politikaları service-role'ün
-- okumasına/yazmasına izin verir; anon sadece okuyabilir.
--
-- Apply: supabase db push ya da dashboard SQL editor.

alter table public.invitations
  add column if not exists wax_seal_color text,
  add column if not exists hero_media_url text,
  add column if not exists photos        jsonb not null default '[]'::jsonb;

comment on column public.invitations.wax_seal_color is
  'Wax seal tint rengi (hex). Null ise preset rengi.';
comment on column public.invitations.hero_media_url is
  'Couple yüklediği hero foto/video (Supabase Storage URL).';
comment on column public.invitations.photos is
  'Galeri URL listesi (JSONB array). Her giriş: { url, alt?, caption? }';

-- Storage bucket: 'couple-media' public-read
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'couple-media',
  'couple-media',
  true,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- RLS: anon read; service-role write (default — RLS bypass'lı admin client).
-- Storage tabloları üzerinde özel policy yazmıyoruz çünkü:
--   - Bucket public=true → anon read otomatik
--   - service-role RLS bypass eder → adminDb upload yapabilir
--   - Bizim editor flow'umuz hep service-role üzerinden gidiyor (admin_token URL gate)
