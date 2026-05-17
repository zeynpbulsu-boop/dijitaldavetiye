# NUVE Production Plan — FAZ A → D

> **Hedef:** Bugün proje bitsin. 4 faz, ~80 madde. Her madde ✅ atomic commit, kabul kriteriyle.
> Claude Code Opus high-effort'la otomatik çalıştır.

---

## ✅ FAZ A — Production Foundation

### A.1 — Mobile-first responsive overhaul
**Hedef:** 6 demo + tüm sayfalar 375px-414px-768px-1024px+ ekranlarda mükemmel.

- [ ] `tailwind.config.ts` breakpoint audit → `sm:640 md:768 lg:1024 xl:1280` (mevcut OK)
- [ ] `globals.css` → `:root { --safe-bottom: env(safe-area-inset-bottom, 0); --safe-top: env(safe-area-inset-top, 0); }`
- [ ] `luxe-edition-demo.tsx` hero section:
  - WaxSealLuxe `size={210}` → `size={typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 210}` (veya CSS clamp via inline `width: clamp(140px, 35vw, 210px)`)
  - Hero `py-32` → `py-20 lg:py-32`
  - CalligraphyName `size={130}` → CSS variant: `style={{ fontSize: 'clamp(56px, 11vw, 130px)' }}`
- [ ] Section padding'leri: `py-32 lg:py-40` → `py-20 sm:py-28 lg:py-40`
- [ ] Schedule cards: `gap-8 px-8 py-6` → `gap-4 sm:gap-8 px-4 sm:px-8 py-4 sm:py-6`
- [ ] Slot machine `max-w-[560px] grid-cols-3 gap-8` → `gap-3 sm:gap-8` + ensure 3-col grid fits 320px wide
- [ ] FAQ accordion summary text: 17px → `clamp(15px, 4vw, 17px)`
- [ ] Footer calligraphy: clamp 38-72px
- [ ] FloatingControls: bottom-6 → `bottom-[max(1.5rem,var(--safe-bottom))]`
- [ ] LiveRsvpCounter: bottom positioning + safe area
- [ ] Envelope ceremony: wax seal 260 → clamp 180-260
- [ ] Touch targets audit: tüm buton/link min 44x44px (h-11 w-11 pill OK, CTA pad 12-16 OK)
- [ ] `meta name="viewport"` `viewport-fit=cover` ekle (`app/layout.tsx`)
- [ ] iOS safari `-webkit-tap-highlight-color: transparent` global

**Kabul:** Chrome DevTools mobile emulation 375/414px → hiçbir overflow, tüm CTA tıklanabilir, calligraphy taşmıyor.

### A.2 — Image optimization (50MB → ~5MB)
**Hedef:** Watermark + wax seal PNG'leri Next/Image + WebP/AVIF + responsive sizes.

- [ ] `npm install sharp` (Next.js otomatik kullanır)
- [ ] `next.config.mjs` → `images: { formats: ['image/avif', 'image/webp'], deviceSizes: [640, 750, 828, 1080, 1200, 1920], imageSizes: [120, 200, 320, 420] }`
- [ ] `scripts/optimize-png.py` yaz: her PNG için 320/640/1280 WebP varyant + AVIF
- [ ] Veya: `next/image` zaten otomatik optimize ediyor → sadece component'leri değiştir
- [ ] `wax-seal-luxe.tsx`: `<img>` → `<Image>` (sized via width/height, priority hero only)
- [ ] `chapel-watermark.tsx`: `<img>` → `<Image>` (fill mode + sizes attribute)
- [ ] Bundle analyzer çalıştır: `ANALYZE=true npm run build`
- [ ] LCP / TBT lighthouse → her demo ≥90 mobile

**Kabul:** Lighthouse mobile Performance ≥90, total transfer her demo <2MB.

### A.3 — Demo → Production bridge
**Hedef:** `/i/[slug]` route'u LuxeEditionDemo kullansın, editor field'larıyla beslensin.

- [ ] `app/i/[slug]/page.tsx` mevcut kodu oku
- [ ] Invitation row'dan tema slug'ı çıkar (`invitation.template_slug`)
- [ ] `LUXE_THEMES[slug]` yoksa eski renderer'a fallback
- [ ] DB field'larını `LuxeEditionTheme` shape'ine map et:
  ```ts
  const theme: LuxeEditionTheme = {
    ...LUXE_THEMES[invitation.template_slug],
    coupleName: invitation.couple_name,
    monogram: invitation.monogram,
    venue: invitation.venue,
    defaultDate: parseDate(invitation.event_date),
    musicTrack: invitation.music_track,
    // … editable field'lar
  }
  ```
- [ ] Migration: `supabase/migrations/00X_luxe_fields.sql` — couple_name, monogram, venue, greeting, hero_cta, music_track, footer_note kolonları ekle
- [ ] Editor `app/editor/[slug]/page.tsx` UI → bu yeni field'lar için input'lar
- [ ] Preview pane live update (debounce 300ms)
- [ ] RSVP form embed: LuxeEditionDemo'ya `<RsvpForm invitationId={...} />` ekle (FAQ'tan önce yeni section)

**Kabul:** Bir test couple oluştur, editor'dan düzenle, `/i/test-slug` üstünde live göster.

### A.4 — Editor UI parity
**Hedef:** Çiftler kendi davetiyelerini düzenleyebilsin.

- [ ] `app/editor/[slug]/_components/text-fields.tsx` — coupleName/monogram/venue/eyebrow inputs
- [ ] `_components/date-picker.tsx` — gün/ay/yıl select
- [ ] `_components/schedule-editor.tsx` — 4-satır add/edit/delete
- [ ] `_components/faq-editor.tsx` — Q/A add/edit/delete
- [ ] `_components/music-uploader.tsx` — couple's track upload to Supabase Storage
- [ ] `_components/preview-pane.tsx` — iframe sandbox veya direct render with current draft
- [ ] Auto-save (debounce 1s) → Supabase `update`
- [ ] `Save` + `Publish` ayrımı (publish = visible at /i/[slug])
- [ ] Auth: editor sadece owner için (Supabase RLS)

**Kabul:** Editor full flow: input değiştir → preview update → save → /i/[slug] reload → yeni değer.

---

## ✅ FAZ B — Real Wedding Features

### B.1 — RSVP form (inline, her template)
- [ ] `components/themed/rsvp-form-luxe.tsx`: name + email + attending (yes/no) + guests (1-4) + dietary (text) + message
- [ ] FAQ'tan önce section olarak embed
- [ ] POST `/api/rsvp` → Supabase insert + Resend confirmation email
- [ ] Onay state'i (sayı arttı): LiveRsvpCounter güncellensin
- [ ] Form validation (zod) + error states + success animation

### B.2 — Countdown timer
- [ ] `components/themed/countdown-luxe.tsx`: gün/saat/dakika/saniye to event_date
- [ ] Hero altında veya schedule'dan önce
- [ ] Editorial: tek satır incecik "47 GÜN 12 SAAT 38 DAKİKA" değil, ayrı kart şeklinde 4 sütun
- [ ] Theme.accent ile vurgu

### B.3 — Map / venue location
- [ ] `npm install @react-google-maps/api` veya Leaflet (no API key)
- [ ] Editor'da venue koordinat input (lat/lng)
- [ ] Demo'da Schedule'dan sonra `<section>` map embed
- [ ] Pin custom icon (theme accent renkli)
- [ ] "Yol tarifi al" butonu → Google Maps deep link

### B.4 — Photo gallery
- [ ] Supabase Storage bucket `couple-photos/{slug}/`
- [ ] Editor'da multi-upload
- [ ] Demo'da Hero ile Schedule arasında `<section>`:
  - Masonry / horizontal scroll / collage
  - Click → lightbox
- [ ] Image optimization (Next/Image + thumbnails)
- [ ] Caption opsiyonel

### B.5 — Hotels / transportation block
- [ ] Editor: 3 önerilen otel (isim, adres, fiyat, link, kısa açıklama)
- [ ] Demo: FAQ'dan önce 3-kolon grid
- [ ] Transport notu (havalimanı, taksi, shuttle)

### B.6 — Music autoplay user gesture
- [ ] Envelope ceremony "Davetiyeyi Aç" tıklanınca music auto-start (browser policy izin verir)
- [ ] Mute/unmute toggle floating control'da
- [ ] localStorage'da kullanıcı tercihi sakla

### B.7 — Add to calendar
- [ ] `.ics` dosyası dinamik üret → `/api/calendar/[slug]`
- [ ] Google Calendar / Apple Calendar / Outlook deep links
- [ ] Schedule kartında "Takvime ekle" linki

---

## ✅ FAZ C — Production Polish

### C.1 — Real domain
- [ ] Domain satın al (öneri: `nuve.com.tr`, `nuvedavetiye.com`, `nuve.app`)
- [ ] Cloudflare DNS:
  - A record → 72.62.39.172
  - CAA record (Let's Encrypt allow)
  - www CNAME
- [ ] Coolify panel → Application → Domains → ekle
- [ ] SSL otomatik (Let's Encrypt)
- [ ] HTTPS redirect zorla
- [ ] WWW canonical (www→non-www veya tersi)
- [ ] HSTS header

### C.2 — Per-invitation OG images
- [ ] `app/i/[slug]/opengraph-image.tsx` — Next.js ImageResponse
- [ ] Theme renkleriyle wax seal + couple name + tarih dinamik
- [ ] 1200x630
- [ ] Twitter card meta
- [ ] WhatsApp link preview test

### C.3 — Analytics
- [ ] Plausible (or PostHog) — privacy-first
- [ ] Pageview track
- [ ] Custom events: envelope_opened, rsvp_submitted, music_played, slot_changed
- [ ] Owner dashboard: hangi davetli ne zaman açtı

### C.4 — Error tracking
- [ ] Sentry kur (free tier yeterli)
- [ ] `instrumentation.ts` setup
- [ ] Source maps upload (Next.js config)
- [ ] Slack/email notification on error

### C.5 — Dodo Payments LIVE (FAZ 19.6 blocker resolve)
- [ ] Kullanıcı Dodo dashboard → live mode → API + webhook keys
- [ ] Coolify env'e ekle (`DODO_PAYMENTS_API_KEY`, `DODO_PAYMENTS_WEBHOOK_KEY` — live versions)
- [ ] Webhook endpoint `https://nuve.../api/webhooks/dodo` → Dodo dashboard'a kaydet
- [ ] Test transaction (gerçek kart, sonra refund)
- [ ] `lib/dodo/checkout.ts` → live mode flag

### C.6 — Email flow (Resend)
- [ ] Order confirmation email template (Tailwind email components)
- [ ] RSVP confirmation to guest
- [ ] RSVP notification to couple
- [ ] Welcome email to couple (editor login link)
- [ ] All emails: theme renklerinde

### C.7 — SEO
- [ ] `app/robots.ts` — production sitemap allow
- [ ] `app/sitemap.ts` — all public pages
- [ ] Meta tags audit:
  - title template per route
  - description per page
  - canonical
  - og:image (per invitation)
- [ ] Structured data: `Event` JSON-LD per invitation (wedding!)
- [ ] Open Graph + Twitter Card

### C.8 — A11y final pass
- [ ] `npm install --save-dev @axe-core/cli`
- [ ] `npx axe http://localhost:3000/dev-preview/aethel`
- [ ] Color contrast: tüm text WCAG AA (4.5:1 normal, 3:1 large)
  - Atelier Indigo: gold-on-navy → audit (D4A158 on 0F1A3D = 8.5:1 ✓)
  - Aurora: rose-gold on taupe → audit (B8867A on EFE9E4 = 3.2:1 ⚠️ borderline)
- [ ] Focus visible: tüm interactive element için custom focus ring
- [ ] Keyboard navigation: envelope ceremony Tab+Enter ile açılabilsin
- [ ] Screen reader: aria-label envelope, slot picker, RSVP
- [ ] prefers-reduced-motion: framer-motion `useReducedMotion()` her component'te
- [ ] Skip link "Ana içeriğe atla"
- [ ] HTML lang attr per locale

---

## ✅ FAZ D — Visual Refinement

### D.1 — Aurora wax seal re-render
- [ ] `scripts/render-aurora-seal-v2.py`:
  ```
  prompt: "Sophisticated minimalist contemporary wax seal asset, warm
  taupe vizon color, embossed elegant geometric line art motif featuring
  intersecting refined lines forming an abstract diamond or asterisk
  shape, surrounded by ultra-fine dotted lace border, shimmering rose
  gold foil accents, photorealistic luxury stationery, isolated on pure
  white background, 8k"
  ```
- [ ] Önceki Aurora seal'i yedekle, yenisini değiştir
- [ ] Pillow alpha clip
- [ ] Live verify

### D.2 — Per-couple monogram override
- [ ] `WaxSealLuxe` prop `monogramOverride?: string`
- [ ] Eğer set, PNG'nin üstüne SVG `<text>` overlay (theme.calligraphyFont, mix-blend-mode multiply gerekmez çünkü PNG zaten alpha)
- [ ] Editor: "Monogram" input field
- [ ] Default: PNG'deki preset
- [ ] Position: SVG text PNG'nin merkezi, font size = size*0.25

### D.3 — Dark theme schedule card contrast
- [ ] `luxe-edition-demo.tsx` schedule li:
  - Açık tema: `background: 'rgba(255,255,255,0.18)'` (mevcut)
  - Koyu tema: `background: 'rgba(255,255,255,0.05)'`, border `${theme.accent}55` (daha belirgin altın çerçeve)
- [ ] `isDark` helper'ı kullan (zaten var)
- [ ] Test: Atelier Indigo + Mansion Lights'ta kartlar belirgin görünmeli

### D.4 — Theme-aware separator
- [ ] `themed-separator.tsx` parent theme'in accent rengini al
- [ ] Glyph variant'lara ek: "dot" (●) basit minimalist
- [ ] Width responsive: mobile 60px, desktop 100px

### D.5 — Hover states + micro-interactions
- [ ] Schedule kartı hover: scale 1.01 + shadow soft
- [ ] FAQ summary hover: background tint
- [ ] Slot picker option hover: opacity ramp
- [ ] CTA shimmer pause-on-hover

### D.6 — prefers-reduced-motion enforce
- [ ] Her `motion.*` component'te `useReducedMotion()` check
- [ ] Reduced motion: opacity transition only, no x/y/scale/rotate
- [ ] CSS keyframes (shimmerSweep, inkPulse, silkGlow) için media query:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .shimmer-sweep, .ink-pulse, .silk-glow { animation: none !important; }
  }
  ```

### D.7 — Lovebirds + ornament accent renk
- [ ] Lovebirds component theme.accent prop'u almaya başlasın
- [ ] Default fallback: ink color
- [ ] LuxeEditionDemo'da her kullanımda `color={theme.accent}` geç

### D.8 — Footer'a copyright + privacy
- [ ] Footer'ın altına thin line: `© {year} NUVE · KVKK · Gizlilik`
- [ ] `/privacy` + `/kvkk` sayfaları (Markdown basit content)

---

## 🎯 Atomicity ve commit pattern

Her madde için:
```bash
git checkout -b faz-a/1-mobile-overhaul
# ... değişiklikler ...
npm run lint && npx tsc --noEmit
git add -A && git commit -m "feat(mobile): A.1 — responsive overhaul (clamp font, py-20 base, safe-area)"
git checkout main && git merge --no-ff faz-a/1-mobile-overhaul
git push origin main
# Coolify Redeploy + verify
```

Branch'siz hızlı path:
```bash
# Her madde sonrası direkt main:
git add -A && git commit -m "..." && git push origin main
```

---

## 📊 Tahmini süre (Opus high-effort autonomous)

| FAZ | Madde | Tahmin |
|---|---|---|
| A | 4 alt-faz × 5-15 madde | 4-6 saat |
| B | 7 madde | 3-4 saat |
| C | 8 madde | 3-4 saat |
| D | 8 madde | 1-2 saat |
| **Toplam** | ~80 madde | **11-16 saat** |

Tek günde bitmek için 4 paralel sub-agent stratejisi: A.1+A.2 paralel, A.3+A.4 paralel, sonra B paralel, sonra C, sonra D.

---

## 🧪 Kabul kriteri (FAZ tamamlama checklist)

**FAZ A done when:**
- [ ] Lighthouse mobile ≥90 perf, ≥95 a11y, ≥95 best practices her demo'da
- [ ] /i/test-slug üstünde editable luxe invitation render ediyor
- [ ] 375px ekranda hiçbir overflow yok

**FAZ B done when:**
- [ ] RSVP submit edip Resend email geliyor
- [ ] Map embed çalışıyor, deep link açılıyor
- [ ] Photo upload + display çalışıyor
- [ ] Countdown live tick

**FAZ C done when:**
- [ ] Gerçek domain üstünde HTTPS aktif
- [ ] WhatsApp link share OG preview göründü
- [ ] Test transaction tamamlandı + refund
- [ ] axe-core 0 violation

**FAZ D done when:**
- [ ] Aurora seal güçlendi
- [ ] Editor'dan monogram değişip live'da görünüyor
- [ ] Dark temalarda schedule kartları belirgin
- [ ] prefers-reduced-motion ile her şey statik

---

İyi şanslar. Hız için Plan agent + general-purpose subagent'ları paralel kullan. Her FAZ sonunda Coolify Redeploy + 5-6 URL'i screenshot ile verify et.
