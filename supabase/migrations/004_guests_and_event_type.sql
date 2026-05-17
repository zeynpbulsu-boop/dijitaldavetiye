-- 004_guests_and_event_type.sql — TOP-1 + TOP-3 rakip kapatma
--
-- 1. public.guests — çiftin proaktif yönettiği davetli listesi.
--    Pressed Love'ın en güçlü silahı budur (couple guest ekler,
--    statü takip eder, CSV export'lar). Bizde şu ana kadar yalnız
--    public RSVP form vardı — reaktifti. Bu tablo proaktif tarafı
--    kuruyor.
--
--    Status enum'u rsvps.attendance ile aynı vocab'ı kullanır
--    ('invited' default + 'confirmed' / 'declined' / 'maybe' RSVP
--    geldiğinde) — böylece tek bir mental model.
--
-- 2. invitations.event_type — düğün / nişan / kına / save-the-date.
--    TR pazarında tek müşteri 2-3 davetiye alıyor (her etkinlik için
--    ayrı). LuxeEditionDemo bu kolona göre etiket overrideları
--    yapacak (örn. "Düğün gününüz" → "Nişan gününüz").
--
-- Apply: supabase db push veya dashboard SQL editor.

create extension if not exists "pgcrypto"; -- gen_random_uuid() emergency

-- ---------------------------------------------------------------------
-- guests
-- ---------------------------------------------------------------------
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
  internal_note   text,                                       -- couple's own scratch note
  rsvp_id         uuid references public.rsvps(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists guests_invitation_id_idx on public.guests(invitation_id);
create index if not exists guests_status_idx        on public.guests(invitation_id, status);
create index if not exists guests_email_idx         on public.guests(invitation_id, lower(email))
  where email is not null;
create index if not exists guests_name_idx          on public.guests(invitation_id, lower(name));

-- RLS — open writes via service-role (adminDb), readers go through API
alter table public.guests enable row level security;

-- updated_at otomatik bump (basit trigger)
create or replace function public.guests_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists guests_touch_updated_at on public.guests;
create trigger guests_touch_updated_at
  before update on public.guests
  for each row execute function public.guests_touch_updated_at();

comment on table public.guests is
  'Davetli listesi — couple editörden ekler. RSVP geldiğinde otomatik bağlanır.';
comment on column public.guests.rsvp_id is
  'Bu davetliye public /api/rsvp üzerinden gelen yanıt; eşleşme yoksa null.';
comment on column public.guests.status is
  'invited (default) → confirmed/declined/maybe (RSVP geldiğinde set edilir).';

-- ---------------------------------------------------------------------
-- invitations.event_type
-- ---------------------------------------------------------------------
alter table public.invitations
  add column if not exists event_type text not null default 'wedding'
  check (event_type in ('wedding', 'engagement', 'henna', 'save_the_date'));

comment on column public.invitations.event_type is
  'Etkinlik tipi — LuxeEditionDemo etiket overrideları için.';
