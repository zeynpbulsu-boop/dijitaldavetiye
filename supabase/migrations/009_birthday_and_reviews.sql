-- 009_birthday_and_reviews.sql — The Digital Invite paritesi
--
-- 1) event_type CHECK constraint'ine 'birthday' ekleniyor — doğum
--    günü davetiyesi yeni bir ürün segmenti (TDI'da €44 ayrı tier).
--    Postgres CHECK constraint'i drop/add gerek; doğum günü dahil
--    5 değer destekleniyor.
--
-- 2) public.reviews — landing'de "Loved by Couples Worldwide" social
--    proof bloğu için. Sahte değil; admin Supabase Studio'dan elle
--    ekler (henüz public yazma formu yok — moderation riski).
--    Published flag ile draft / live state.
--
-- Apply: supabase db push.

-- ----------------------------------------------------------------
-- 1) event_type — birthday eklemesi
-- ----------------------------------------------------------------
alter table public.invitations
  drop constraint if exists invitations_event_type_check;

alter table public.invitations
  add constraint invitations_event_type_check
  check (event_type in ('wedding', 'engagement', 'henna', 'save_the_date', 'birthday'));

comment on column public.invitations.event_type is
  'Etkinlik tipi: wedding / engagement / henna / save_the_date / birthday.';

-- ----------------------------------------------------------------
-- 2) reviews — sosyal kanıt
-- ----------------------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  country     text,            -- "📍 Dubai" gibi pin için
  country_code text,           -- ISO Alpha-2 (TR, GB, DE …) — emoji flag için
  rating      smallint not null default 5 check (rating between 1 and 5),
  content     text not null,
  verified    boolean not null default false,
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists reviews_published_idx on public.reviews(published, created_at desc);

alter table public.reviews enable row level security;

comment on table public.reviews is
  'Landing page sosyal kanıt. Admin Studio''dan elle ekleyip published=true yapar.';
