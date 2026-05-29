-- =====================================================================
-- NUVE — Supabase tek-tıkla setup (tüm migration'ları birleştirir)
--
-- Idempotent — defalarca çalıştırılsa bile bozulmaz.
-- Yeni proje veya mevcut proje fark etmez:
--   Supabase Dashboard → SQL Editor → bu dosyayı yapıştır → Run.
--
-- Sonra Coolify env vars'ı set et:
--   NEXT_PUBLIC_SUPABASE_URL          (Settings → API → Project URL)
--   NEXT_PUBLIC_SUPABASE_ANON_KEY     (Settings → API → anon public)
--   SUPABASE_SERVICE_ROLE_KEY         (Settings → API → service_role secret)
-- =====================================================================

create extension if not exists "pgcrypto";

-- =====================================================================
-- 1) invitations
-- =====================================================================
create table if not exists public.invitations (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text unique not null,
  template_slug         text not null,
  tier                  text not null default 'standard',
  status                text not null default 'draft'
                        check (status in ('draft', 'paid', 'live', 'archived', 'refunded')),

  partner_one_name      text,
  partner_two_name      text,
  wedding_date          date,
  venue_name            text,
  venue_city            text,
  venue_address         text,
  venue_lat             numeric(9, 6),
  venue_lng             numeric(9, 6),

  story_text            text,
  music_url             text,
  music_track_id        text,
  music_track           text,
  monogram_initials     text,
  locale                text not null default 'tr'
                        check (locale in ('tr', 'en', 'sr')),

  greeting              text,
  hero_eyebrow          text,
  hero_cta              text,
  envelope_cta          text,
  footer_note           text,

  wax_seal_color        text,
  hero_media_url        text,
  photos                jsonb not null default '[]'::jsonb,

  gift_iban             text,
  gift_bank             text,
  gift_account_holder   text,
  gift_note             text,
  hotels                jsonb not null default '[]'::jsonb,

  event_type            text not null default 'wedding',
  enable_scratch_reveal boolean not null default false,

  owner_email           text,
  owner_phone           text,
  admin_token           text not null default encode(gen_random_bytes(24), 'base64') unique,

  dodo_session_id       text,
  dodo_payment_id       text,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  paid_at               timestamptz,
  live_until            timestamptz
);

-- Eski projeler için: yoksa kolonları ekle (yeni installs no-op)
alter table public.invitations
  add column if not exists venue_address         text,
  add column if not exists venue_lat             numeric(9, 6),
  add column if not exists venue_lng             numeric(9, 6),
  add column if not exists music_track           text,
  add column if not exists greeting              text,
  add column if not exists hero_eyebrow          text,
  add column if not exists hero_cta              text,
  add column if not exists envelope_cta          text,
  add column if not exists footer_note           text,
  add column if not exists wax_seal_color        text,
  add column if not exists hero_media_url        text,
  add column if not exists photos                jsonb not null default '[]'::jsonb,
  add column if not exists gift_iban             text,
  add column if not exists gift_bank             text,
  add column if not exists gift_account_holder   text,
  add column if not exists gift_note             text,
  add column if not exists hotels                jsonb not null default '[]'::jsonb,
  add column if not exists event_type            text not null default 'wedding',
  add column if not exists enable_scratch_reveal boolean not null default false;

-- tier: tek-paket standard'a backfill
update public.invitations
   set tier = 'standard'
 where tier in ('sade', 'klasik', 'premium');

do $$
declare con record;
begin
  for con in
    select conname from pg_constraint
     where conrelid = 'public.invitations'::regclass
       and contype  = 'c'
       and pg_get_constraintdef(oid) ilike '%tier%'
  loop
    execute format('alter table public.invitations drop constraint %I', con.conname);
  end loop;
end $$;

alter table public.invitations
  alter column tier set default 'standard';
alter table public.invitations
  add constraint invitations_tier_check check (tier = 'standard');

-- event_type: birthday dahil 5 değer
alter table public.invitations
  drop constraint if exists invitations_event_type_check;
alter table public.invitations
  add constraint invitations_event_type_check
  check (event_type in ('wedding', 'engagement', 'henna', 'save_the_date', 'birthday'));

create index if not exists invitations_status_idx       on public.invitations (status);
create index if not exists invitations_dodo_payment_idx on public.invitations (dodo_payment_id);
create index if not exists invitations_owner_email_idx  on public.invitations (owner_email);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

drop trigger if exists invitations_touch_updated_at on public.invitations;
create trigger invitations_touch_updated_at
  before update on public.invitations
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- 2) rsvps
-- =====================================================================
create table if not exists public.rsvps (
  id            uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name    text not null,
  guest_email   text,
  attendance    text not null check (attendance in ('yes', 'no', 'maybe')),
  plus_one      boolean not null default false,
  plus_one_name text,
  menu_choice   text,
  allergies     text,
  note          text,
  created_at    timestamptz not null default now()
);

create index if not exists rsvps_invitation_idx on public.rsvps (invitation_id, created_at desc);

-- =====================================================================
-- 3) guests (proaktif davetli listesi)
-- =====================================================================
create table if not exists public.guests (
  id              uuid primary key default gen_random_uuid(),
  invitation_id   uuid not null references public.invitations(id) on delete cascade,
  name            text not null,
  email           text,
  phone           text,
  status          text not null default 'invited'
                  check (status in ('invited', 'confirmed', 'declined', 'maybe')),
  plus_one        boolean not null default false,
  plus_one_name   text,
  dietary_notes   text,
  internal_note   text,
  rsvp_id         uuid references public.rsvps(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists guests_invitation_id_idx on public.guests(invitation_id);
create index if not exists guests_status_idx        on public.guests(invitation_id, status);
create index if not exists guests_email_idx         on public.guests(invitation_id, lower(email))
  where email is not null;
create index if not exists guests_name_idx          on public.guests(invitation_id, lower(name));

create or replace function public.guests_touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

drop trigger if exists guests_touch_updated_at on public.guests;
create trigger guests_touch_updated_at
  before update on public.guests
  for each row execute function public.guests_touch_updated_at();

-- =====================================================================
-- 4) webhook_events (Dodo idempotency)
-- =====================================================================
create table if not exists public.webhook_events (
  webhook_id    text primary key,
  event_type    text not null,
  payment_id    text,
  invitation_id uuid references public.invitations(id) on delete set null,
  received_at   timestamptz not null default now(),
  raw_payload   jsonb not null
);

create index if not exists webhook_events_payment_idx on public.webhook_events (payment_id);

-- =====================================================================
-- 5) reviews (landing sosyal kanıt)
-- =====================================================================
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  country      text,
  country_code text,
  rating       smallint not null default 5 check (rating between 1 and 5),
  content      text not null,
  verified     boolean not null default false,
  published    boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists reviews_published_idx on public.reviews(published, created_at desc);

-- =====================================================================
-- 6) Storage bucket: couple-media (hero foto, galeri)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'couple-media', 'couple-media', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- =====================================================================
-- 7) Row Level Security
-- =====================================================================
alter table public.invitations    enable row level security;
alter table public.rsvps          enable row level security;
alter table public.guests         enable row level security;
alter table public.webhook_events enable row level security;
alter table public.reviews        enable row level security;

drop policy if exists "Public can read live invitations"     on public.invitations;
drop policy if exists "Anon can insert RSVPs"                on public.rsvps;
drop policy if exists "Public can read published reviews"    on public.reviews;
drop policy if exists "Service role full access invitations" on public.invitations;
drop policy if exists "Service role full access rsvps"       on public.rsvps;
drop policy if exists "Service role full access guests"      on public.guests;
drop policy if exists "Service role full access webhooks"    on public.webhook_events;
drop policy if exists "Service role full access reviews"     on public.reviews;

create policy "Public can read live invitations"
  on public.invitations for select
  to anon, authenticated
  using (status = 'live');

create policy "Anon can insert RSVPs"
  on public.rsvps for insert
  to anon, authenticated
  with check (
    exists (select 1 from public.invitations i
            where i.id = invitation_id and i.status = 'live')
  );

create policy "Public can read published reviews"
  on public.reviews for select
  to anon, authenticated
  using (published = true);

create policy "Service role full access invitations"
  on public.invitations for all to service_role using (true) with check (true);
create policy "Service role full access rsvps"
  on public.rsvps for all to service_role using (true) with check (true);
create policy "Service role full access guests"
  on public.guests for all to service_role using (true) with check (true);
create policy "Service role full access webhooks"
  on public.webhook_events for all to service_role using (true) with check (true);
create policy "Service role full access reviews"
  on public.reviews for all to service_role using (true) with check (true);

-- =====================================================================
-- Bitti. Doğrulama:
--   select table_name from information_schema.tables
--    where table_schema='public' order by 1;
--   → invitations, rsvps, guests, webhook_events, reviews
-- =====================================================================
