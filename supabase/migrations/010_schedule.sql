-- 010_schedule.sql — gün-akışı / program (data-loss fix)
--
-- Çift, sipariş/düzenleyici formunda düğün gününün akışını giriyordu
-- (tören, kokteyl, yemek…) ama bu veri kalıcı saklanmıyordu (DB kolonu yoktu)
-- ve canlı davetiyede hiç gösterilmiyordu. Bu kolon o veri kaybını giderir.
--
-- Yeni kolon (nullable, geçmiş satırlar etkilenmez):
--   schedule  jsonb array: { time, title, desc? }
--
-- Apply: supabase db push veya dashboard SQL editor (idempotent — if not exists).

alter table public.invitations
  add column if not exists schedule jsonb;

comment on column public.invitations.schedule is
  'Gün-akışı / program — jsonb array of { time, title, desc? } (Migration 010)';
