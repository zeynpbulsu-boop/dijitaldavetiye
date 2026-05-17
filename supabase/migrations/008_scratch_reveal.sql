-- 008_scratch_reveal.sql — opsiyonel "kazıyarak ortaya çıkar"
--
-- Pressed Love demosunda tarih önce gizli; üç daireyi kazıyarak gün/ay/
-- yıl ortaya çıkıyordu. Bizde Hero'daki tarih satırı opsiyonel olarak
-- scratch surface haline gelir. Çift bu özelliği editor'da açar.
--
-- Default false → kimseyi sürprize uğratmaz; eski davetiyeler aynen
-- kalır. Çift opt-in'ler.

alter table public.invitations
  add column if not exists enable_scratch_reveal boolean not null default false;

comment on column public.invitations.enable_scratch_reveal is
  'Hero''daki tarih satırı kazıyarak ortaya çıkar mı? Pressed Love feature parity.';
