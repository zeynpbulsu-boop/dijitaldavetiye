-- =====================================================================
-- NUVE — initial schema (migration 001)
--
-- Three tables:
--   invitations      — one row per draft / paid / live invitation
--   rsvps            — guest responses, FK to invitations
--   webhook_events   — Dodo webhook idempotency log
--
-- Run against a fresh Supabase project:
--   psql $DATABASE_URL -f supabase/migrations/001_init.sql
-- Or paste into Supabase Studio → SQL editor.
-- =====================================================================

-- Required extensions
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------
-- invitations
-- ---------------------------------------------------------------------
create table if not exists public.invitations (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,            -- e.g. "elif-ve-mert-12-09-2026"
  template_slug       text not null,                   -- FK in spirit to template registry
  tier                text not null check (tier in ('sade', 'klasik', 'premium')),
  status              text not null default 'draft'
                      check (status in ('draft', 'paid', 'live', 'archived', 'refunded')),

  -- Couple + event basics
  partner_one_name    text,
  partner_two_name    text,
  wedding_date        date,
  venue_name          text,
  venue_city          text,
  venue_address       text,

  -- Customisation
  story_text          text,
  music_url           text,
  music_track_id      text,
  monogram_initials   text,
  locale              text not null default 'tr'
                      check (locale in ('tr', 'en', 'sr')),

  -- Owner contact
  owner_email         text,
  owner_phone         text,

  -- Admin access token — random, given to owner so they can manage RSVPs
  admin_token         text not null default encode(gen_random_bytes(24), 'base64')
                      unique,

  -- Payment trail
  dodo_session_id     text,
  dodo_payment_id     text,

  -- Lifecycle timestamps
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  paid_at             timestamptz,
  live_until          timestamptz
);

create index if not exists invitations_status_idx       on public.invitations (status);
create index if not exists invitations_dodo_payment_idx on public.invitations (dodo_payment_id);
create index if not exists invitations_owner_email_idx  on public.invitations (owner_email);

-- updated_at auto-touch
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists invitations_touch_updated_at on public.invitations;
create trigger invitations_touch_updated_at
  before update on public.invitations
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- rsvps
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- webhook_events  (Dodo idempotency log)
-- ---------------------------------------------------------------------
create table if not exists public.webhook_events (
  webhook_id   text primary key,            -- the Dodo "webhook-id" header
  event_type   text not null,
  payment_id   text,
  invitation_id uuid references public.invitations(id) on delete set null,
  received_at  timestamptz not null default now(),
  raw_payload  jsonb not null
);

create index if not exists webhook_events_payment_idx on public.webhook_events (payment_id);

-- =====================================================================
-- Row Level Security
--   anon role        → public can read 'live' invitations by slug only
--                      AND insert into rsvps for that invitation
--   service_role     → full access from server-side routes & webhook
-- =====================================================================

alter table public.invitations   enable row level security;
alter table public.rsvps         enable row level security;
alter table public.webhook_events enable row level security;

-- Drop policies if rerunning
drop policy if exists "Public can read live invitations" on public.invitations;
drop policy if exists "Anon can insert RSVPs" on public.rsvps;
drop policy if exists "Service role full access invitations" on public.invitations;
drop policy if exists "Service role full access rsvps" on public.rsvps;
drop policy if exists "Service role full access webhooks" on public.webhook_events;

-- Public read for live invitations (RSVP page uses this)
create policy "Public can read live invitations"
  on public.invitations
  for select
  to anon, authenticated
  using (status = 'live');

-- Anyone can submit an RSVP for a live invitation (no SELECT for anon).
create policy "Anon can insert RSVPs"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.status = 'live'
    )
  );

-- Service role bypasses RLS entirely, but keep an explicit policy
-- so postgrest is happy (and behaviour is documented).
create policy "Service role full access invitations"
  on public.invitations
  for all
  to service_role
  using (true)
  with check (true);

create policy "Service role full access rsvps"
  on public.rsvps
  for all
  to service_role
  using (true)
  with check (true);

create policy "Service role full access webhooks"
  on public.webhook_events
  for all
  to service_role
  using (true)
  with check (true);
