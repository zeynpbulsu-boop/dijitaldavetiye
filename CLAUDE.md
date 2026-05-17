# NUVE — Claude Code Project Memory

> **Bu dosyayı her oturum başında otomatik oku.** Proje bağlamı, mimari, asset'ler, plan ve komutlar burada. Sonraki adımlar için `PLAN.md`'a bak.

---

## 🎯 Proje Özeti

**NUVE** — TR/Balkan premium dijital wedding davetiye platformu.

- **Stack:** Next.js 14 App Router + TypeScript + Tailwind + framer-motion
- **DB:** Supabase (invitations, rsvps, webhook_events)
- **Payment:** Dodo Payments (€39.99 flat per template) — LIVE keys eksik (FAZ 19.6 blocker)
- **Deploy:** Coolify (self-hosted) → `coolify.bulsulabs.xyz`
- **Live URL:** `http://b9ba0lj82z1m88uwltdc1w85.72.62.39.172.sslip.io`
- **Repo:** `https://github.com/zeynpbulsu-boop/dijitaldavetiye`
- **Domain hedefi:** Henüz alınmadı (sslip.io üstünde)

**Pazar pozisyonu:** bizevleniyoruz.net ve pressedlove.com'u "tematik bütünsel" deneyimle geçmek.

---

## 🏛️ Mimari

### Dosya yapısı
```
app/
  page.tsx                          # Landing
  _sections/                        # Hero, TemplateCarousel, HowItWorks, Pricing, FAQ, vb.
  dev-preview/
    aethel/page.tsx                 # 6 luxe demo (FAZ 5.10-5.12)
    atelier-indigo/page.tsx
    bodrum-blue/page.tsx
    mansion-lights/page.tsx
    olive-grove/page.tsx
    aurora/page.tsx
  templates/[slug]/page.tsx         # Şablon detay sayfası (carousel hedefi)
  order/[slug]/page.tsx             # Sipariş başlangıç
  i/[slug]/page.tsx                 # ★ Yayında olan gerçek davetiye (Demo→Prod bridge buraya bağlanacak)
  editor/[slug]/page.tsx            # Çiftin düzenleme paneli
  admin/page.tsx                    # Owner admin

components/
  templates/
    _shared/
      edition-renderer.tsx          # Slot orchestration (FAZ 2)
      default-slots/                # cover, story, rsvp, gift, thanks
    elegant-ivory/                  # FAZ 2C pilot, slot kullanıyor
    blush-reverie/ ...              # Legacy editions (slot'a göç edecek)
    aethel-chapel/                  # FAZ 3.5
  themed/
    luxe-edition-demo.tsx           # ★ FAZ 5.12 universal demo, theme prop alır
    envelope-ceremony.tsx           # Tap-to-open wax seal
    wax-seal-luxe.tsx               # Per-edition PNG mühür
    chapel-watermark.tsx            # Per-edition background texture
    calligraphy-name.tsx            # SVG stroke isim
    themed-separator.tsx
    live-rsvp-counter.tsx
    music-waveform-player.tsx
    story-timeline.tsx              # ŞU AN KULLANILMIYOR (uydurma content)
  inputs/
    slot-picker.tsx                 # iPhone time-picker style, scroll-snap-y
  ornaments/
    lace-frame.tsx
    lovebirds.tsx
    watercolor-reveal.tsx

lib/
  design/
    tokens.ts                       # EditionMeta — 7 edition tanımı
    luxe-themes.ts                  # ★ FAZ 5.12 — 6 LuxeEditionTheme preset
    motion.ts                       # Framer-motion preset'leri
  supabase/
    server.ts / client.ts
  dodo/                             # Payments wrapper
  i18n/
    dictionaries.ts                 # TR/EN/SR

public/
  aethel/{wax-seal-luxe,chapel-vignette,_orig-*}.png
  atelier-indigo/{wax-seal,watermark,_orig-*}.png
  bodrum-blue/{wax-seal,watermark,_orig-*}.png
  mansion-lights/{wax-seal,watermark,_orig-*}.png
  olive-grove/{wax-seal,watermark,_orig-*}.png
  aurora/{wax-seal,watermark,_orig-*}.png

scripts/
  render-luxe-assets.py             # Aethel için fal.ai render (FAZ 5.11)
  render-5-editions.py              # 5 edition fal.ai batch (FAZ 5.12)
  transparent-bg.py / -all.py       # Pillow alpha clipping
```

### Tema Sistemi

**`lib/design/tokens.ts`** — 7 edition'ın temel `EditionMeta`'sı:
- `atelier-indigo` `timeless` `olive-grove` `mansion-lights` `bodrum-blue` `aurora` (object keys)
- + `AETHEL_CHAPEL` (const export, slug "aurora" tip reuse ile)

**`lib/design/luxe-themes.ts`** — 6 `LuxeEditionTheme` preset:
```ts
interface LuxeEditionTheme {
  meta: EditionMeta;
  bg, footerBg, ink, inkSoft, inkMuted, accent, haloColor: string;
  waxSealSrc: string;          // /atelier-indigo/wax-seal.png
  watermarkSrc: string;        // /atelier-indigo/watermark.png
  coupleName, monogram, venue, greeting, heroEyebrow, heroCta,
  envelopeCta, musicTrack, footerNote: string;
  defaultDate: { day, month, year };
}
```

**Asset üretim akışı (fal.ai):**
1. `scripts/render-5-editions.py` → fal.ai flux-pro/v1.1-ultra → pure-white-BG PNG
2. `scripts/transparent-bg-all.py` → Pillow threshold=232 → gerçek alpha
3. PNG'ler `public/<edition>/{watermark,wax-seal}.png` olarak commit

**Component flow:**
```
LuxeEditionDemo (theme={…})
  → EnvelopeCeremony (waxSealSrc, watermarkSrc)
  → Hero (WaxSealLuxe + CalligraphyName + Lovebirds + CTA)
  → ChapelWatermark (fixed @4.5%, hero @9%, footer @8%)
  → ThemedSeparator x4
  → SlotPicker × 3 (gün/ay/yıl, Hero date live update via inkPulse)
  → Schedule (4 satır, SVG icons: bell/glass/plate/star)
  → MusicWaveformPlayer (Web Audio API + 36 bars)
  → FAQ accordion
  → Footer (mini wax seal + calligraphy + lovebirds)
  → LiveRsvpCounter (sticky bottom)
```

---

## 📜 FAZ History (Compact)

- **FAZ 1** Design token system
- **FAZ 2A** Deprecation/registry/unit tests
- **FAZ 2B** Slot architecture refactor
- **FAZ 2C** elegant-ivory slot orchestration pilot
- **FAZ 3** Typography (Cormorant Light 300), lace frame, lovebirds, slot picker, Aethel Chapel edition
- **FAZ 4** fal.ai pipeline ilk versiyon
- **FAZ 5** Tematik bütünsel davetiye (Pressed Love rakip analizi)
- **FAZ 5.7-5.10** Aethel killer demo (envelope ceremony + wax seal SVG + slot machine + schedule + FAQ)
- **FAZ 5.11** Fal.ai luxe assets (chapel vignette + wax seal PNG)
- **FAZ 5.11.1** background-blend-mode fix (mix-blend-mode framer-motion stacking context'inde çalışmıyor)
- **FAZ 5.11.2** Pillow alpha PNG (beyaz BG → transparent)
- **FAZ 5.12** 5 edition rollout (10 PNG, LuxeEditionDemo, 5 page route)
- **FAZ 18-22** Editor, payments, i18n, mobile menu, supabase migrations, build fixes
- **FAZ 19.6** ⚠️ BLOCKER: Dodo Payments LIVE keys gerekli, kullanıcıya bağlı

---

## 🔑 Komutlar Cheatsheet

```bash
# Dev
npm run dev                                      # localhost:3000
npm run build && npm start                       # Production simulate
npx tsc --noEmit                                 # Type check
npx next lint                                    # ESLint
npm test                                         # Vitest (slot composition tests)

# Asset üretim (fal.ai key gerekli, scripts içinde gömülü)
python3 scripts/render-5-editions.py             # 10 PNG render
python3 scripts/transparent-bg-all.py            # Alpha clipping batch
python3 scripts/render-luxe-assets.py            # Aethel için
python3 scripts/transparent-bg.py                # Aethel için

# Git + Deploy
git add -A && git commit -m "..." && git push origin main

# Coolify Redeploy URL'i (browser):
# https://coolify.bulsulabs.xyz/project/awm4k3kh9chfcdmxdjo0uz6o/environment/w1w5qgscs3rz3yqoeom0lbsg/application/b9ba0lj82z1m88uwltdc1w85
# → sağ üst "Redeploy" butonu (~1262, 155 koordinatı)
# Build ~90sn, total ~2-3 dk
```

### Live URL'ler

| Edition | URL |
|---|---|
| Aethel | http://b9ba0lj82z1m88uwltdc1w85.72.62.39.172.sslip.io/dev-preview/aethel |
| Atelier Indigo | …/dev-preview/atelier-indigo |
| Mansion Lights | …/dev-preview/mansion-lights |
| Bodrum Blue | …/dev-preview/bodrum-blue |
| Olive Grove | …/dev-preview/olive-grove |
| Aurora | …/dev-preview/aurora |
| Production /i/ | …/i/[slug] — burada slot-based render var, luxe henüz bağlı değil |

---

## 🎨 Tasarım Sözleşmesi

**Tipografi:**
- Body: `var(--font-display)` = Cormorant Garamond Light 300, letter-spacing 0.018em
- Calligraphy isim: `var(--font-calligraphy)` = Pinyon Script (alt: Great Vibes)
- Eyebrow: 10px, uppercase, letter-spacing 0.5em
- CTA: 10-11px, uppercase, letter-spacing 0.4em, hover'da 0.48em

**Renkler:**
- Açık temalar: hero bg cream (`#F2EEE4` Aethel, `#F4F1EA` Bodrum, `#F5F2EB` Olive, `#EFE9E4` Aurora)
- Koyu temalar: deep bg (`#0F1A3D` Atelier, `#4A1521` Mansion)
- Accent her edition'a özgü (sage/gold/turquoise/sage/rose-gold/gold)

**Spacing:**
- Section padding: `py-32 lg:py-40`
- Max width: 760px (FAQ/Schedule), 560px (Slot machine), 1100-1200px (watermark)
- Border'lar: 0.5px (incecik)

**Watermark opacity:**
- Fixed (sayfa boyu): 4.5%
- Hero: 9%
- Footer: 8%
- Envelope ceremony: 5%

**Animations:**
- Default ease: `[0.22, 1, 0.36, 1]`
- Back-ease (wax seal entrance): `[0.34, 1.56, 0.64, 1]`
- Stagger delay: 0.08-0.1s
- prefers-reduced-motion her yerde uygulanmalı (audit gerekli)

---

## ⚠️ Bilinen Sorunlar / Açık Kararlar

1. **Demo ≠ Production:** `/dev-preview/*` izole. `/i/[slug]` hâlâ eski slot orchestration kullanıyor.
2. **Asset boyutu:** Watermark PNG'ler 5-9MB → mobile için felaket. Next/Image + WebP gerekli.
3. **Editor UI uyumsuz:** Couple/venue/tarih hardcoded LuxeEditionTheme'lerde, editor sahibi düzenleyemiyor.
4. **i18n eksik:** LuxeEditionDemo TR strings'i theme prop'unda taşıyor, dictionary'e bağlı değil.
5. **A11y:** prefers-reduced-motion bazı yerlerde eksik, focus ring hiç yok, kontrast audit edilmedi.
6. **Dodo LIVE keys:** Test keys ile çalışıyor, gerçek satış için kullanıcıdan keys gerek.
7. **Mansion seal "H" monogram generic:** Couple monogramına dinamik swap (SVG text overlay) gerekli.
8. **Aurora wax seal zayıf:** Geometric çok sade. Re-render ile güçlendir.
9. **Music player:** Autoplay user gesture gerekiyor, src henüz yok (placeholder).
10. **Footer copy:** Mock content, dynamic'e bağlanmalı.

---

## 📦 Coolify / Infra

- **Dashboard:** https://coolify.bulsulabs.xyz
- **Project UUID:** `awm4k3kh9chfcdmxdjo0uz6o`
- **Environment:** `w1w5qgscs3rz3yqoeom0lbsg`
- **App UUID:** `b9ba0lj82z1m88uwltdc1w85`
- **Build:** Dockerfile (multi-stage Next.js standalone)
- **Auto-deploy:** GitHub push tetiklemiyor güvenilir şekilde → manuel Redeploy gerek
- **Env vars:** Supabase URL/keys, Dodo test keys, Resend key Coolify panelinde set edili
- **VPS:** 72.62.39.172

**Domain bağlama yapılacak:**
- Cloudflare DNS A record → 72.62.39.172
- Coolify panelde domain ekle, Let's Encrypt otomatik
- HTTPS redirect

---

## 🚀 Sonraki Adımlar

**`PLAN.md`'ı oku.** 4 fazlık (A-D) detaylı checklist orada. Sırayla yürü, her madde için kabul kriteri ve dosya patikası belirtilmiş.

**Önerilen başlangıç:**
1. `PLAN.md` → FAZ A.1 (Mobile audit + responsive)
2. Her commit küçük ve atomic
3. Her FAZ sonunda Coolify Redeploy + live verify
4. Cowork'teki Chrome MCP yerine local'de browser DevTools kullan

**Hız ipuçları:**
- Çoklu dosya refactor için Plan agent'ı veya `general-purpose` subagent
- Image optimization için `sharp` + Next/Image
- A11y check için `npx @axe-core/cli`
- Bundle analiz için `@next/bundle-analyzer`

---

## 🔐 Secrets (commit etme!)

Bu repo'da gerçek API key YOK. Coolify env vars panelinde:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DODO_PAYMENTS_API_KEY` (test)
- `DODO_PAYMENTS_WEBHOOK_KEY` (test)
- `RESEND_API_KEY`

**fal.ai key** scriptlerde hardcoded → şu an OK (geçici), production'da env'e taşı.

---

İyi çalışmalar. Sıradaki kararı `PLAN.md`'a göre al.
