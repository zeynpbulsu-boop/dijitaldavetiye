-- 003_luxe_fields.sql — FAZ A.3
--
-- Adds the editable copy fields that LuxeEditionDemo consumes via
-- `LuxeEditionTheme`. These are optional — when null the bridge in
-- lib/templates/luxe-bridge.ts falls back to the per-edition preset
-- in lib/design/luxe-themes.ts.
--
-- Editor UI (FAZ A.4) wires these to inputs so each couple can
-- override the default copy. Defaults are NULL; we do not seed
-- values here because the bridge already provides them.
--
-- Apply via Supabase CLI:
--   supabase db push
-- or against the dashboard SQL editor — order matters relative to
-- 001_init.sql and 002_flat_pricing.sql.

alter table public.invitations
  add column if not exists greeting       text,
  add column if not exists hero_eyebrow   text,
  add column if not exists hero_cta       text,
  add column if not exists envelope_cta   text,
  add column if not exists footer_note    text,
  -- Couple-uploaded track (Supabase Storage URL) — distinct from
  -- music_url which historically carried external mp3 links.
  add column if not exists music_track    text;

comment on column public.invitations.greeting     is 'Envelope ceremony greeting line';
comment on column public.invitations.hero_eyebrow is 'Small label above the couple name in the Hero';
comment on column public.invitations.hero_cta     is 'Primary CTA copy in the Hero block';
comment on column public.invitations.envelope_cta is 'Envelope-open button copy';
comment on column public.invitations.footer_note  is 'Closing line under the footer wax seal';
comment on column public.invitations.music_track  is 'Track label shown next to the waveform player';
