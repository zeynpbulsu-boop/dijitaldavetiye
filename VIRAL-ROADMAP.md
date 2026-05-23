# NUVE Viral Upgrade Roadmap

> **Mission:** NUVE'yi Awwwards Site of the Day seviyesine çıkar, bizevleniyoruz.net + Pressed Love + The Digital Invite'i geç.
> **Strategy:** Site-wide motion infrastructure (Faz 1) + per-edition signature moment (Faz 2) + asset/global rollout (Faz 3).
> **Pricing target:** Premium €39.99-€79.99 (mevcut 1350₺ ≈ €39 rakip vs €69+ NUVE Premium Signature).

---

## 0. Edition Naming Migration

Bizevleniyoruz katalogundaki çakışmaları kaldırıp tüm 6 edition'ı global pazar (TR/SR/EN) için yeniden adlandırdık. ASCII slug'lar URL/SEO için güvenli.

| Eski slug | Yeni slug | Yeni gösterim adı | Justification |
|---|---|---|---|
| `aethel` | `aethel` | **AETHEL** | Unique, Old English, premium. Keep. |
| `atelier-indigo` | `nocturne` | **NOCTURNE** | Çakışma kalktı. Chopin Nocturne ile uyum. |
| `mansion-lights` | `candela` | **CANDÉLA** | Çakışma kalktı. İtalyanca mum, mansion candlelight ile bağ. |
| `bodrum-blue` | `mistral` | **MISTRAL** | Akdeniz rüzgârı, global pazar için "Bodrum" yerel adından kaçınma. |
| `olive-grove` | `olea` | **OLEA** | Latince zeytin, tek kelime premium koleksiyon ismi. |
| `aurora` | `aurora` | **AURORA** | Unique, hiç rakipte yok. Keep. |

**Etkilenen alanlar:**
- `public/<eski>/` → `public/<yeni>/` (asset klasörleri)
- `app/dev-preview/<eski>/page.tsx` → `app/dev-preview/<yeni>/page.tsx`
- `lib/design/tokens.ts` — `EDITIONS` object keys
- `lib/design/luxe-themes.ts` — `LUXE_THEMES` keys + waxSealSrc/watermarkSrc/coverScene path'leri
- `app/tasarimlar/page.tsx` ve `app/_sections/templates-carousel.tsx` — catalog
- `scripts/render-5-editions.py` ve `scripts/render-swan-quality-covers.py` — generation
- DB: `invitations.template_slug` için migration (her şey production'a gitmeden gerek yok, demo only)

---

## Faz 1 — Site-Wide Viral Upgrades (Tüm 6 edition'a aynı anda)

Her edition'a eşit gelir. Awwwards table-stakes + 2026 cutting-edge mix.

### 1.1 Smooth scroll engine — Lenis
- `@studio-freight/lenis` install
- `lib/motion/lenis-provider.tsx` — root layout wrapper
- `useLenis()` hook, scroll velocity expose
- GSAP ticker sync (`Lenis.on('scroll', ScrollTrigger.update)`)

### 1.2 GSAP ScrollTrigger pinning
- `gsap@3` + `ScrollTrigger` install
- `lib/motion/scroll-trigger.ts` — register plugin (client-only)
- LuxeEditionDemo'da Hero pin (1.5x viewport scrub)
- Countdown pin (digits tick during scroll-thru)
- Gallery horizontal pan (touch-friendly)

### 1.3 View Transitions API
- `lib/motion/view-transition.ts` wrapper
- Envelope wax seal → Hero monogram morph (named transitions)
- Section change cinematic fade-through-color (per-edition palette)

### 1.4 Magnetic + blend-mode cursor
- `components/motion/magnetic-cursor.tsx` (DOM follower, framer-motion `useMotionValue`)
- `data-cursor="magnetic"` attribute on CTAs, slot wheel, IBAN copy, RSVP submit
- Mobile: hidden, fallback to ripple on tap

### 1.5 Rive envelope state machine
- `@rive-app/react-canvas` install
- `public/rive/envelope.riv` — Rive editor'de 4-state machine (Sealed / Unsealing / Opening / Opened)
- `components/themed/envelope-ceremony.tsx` → Rive component (mevcut DOM + tap unchanged, ama animasyon Rive-driven)
- Fallback: prefers-reduced-motion ise mevcut DOM fade

### 1.6 Generative ambient audio + one-shot SFX
- Tone.js + Howler.js install
- `lib/audio/audio-context.tsx` — singleton context, user-gesture-gated
- Per-edition ambient layer:
  - AETHEL: chapel reverb tail + distant bell harmonics
  - NOCTURNE: Bosphorus night water + distant chandelier crystal
  - CANDÉLA: candle flicker + ferry horn far
  - MISTRAL: waves + seagull + boat creak
  - OLEA: cicadas + olive leaves + birdsong
  - AURORA: ambient pad + faint piano
- Nazik unmute prompt (sadece envelope açılır açılmaz "♪ ses açık" pill 3sn görünür)

### 1.7 Scroll-driven CSS animations
- `lib/motion/scroll-timeline.css` — global keyframes
- Hero parallax stack `animation-timeline: scroll()` ile compositor-thread
- Watermark drift, BG color hue shift, vignette intensity

### 1.8 Cinematic page-in (2.5s)
- Black curtain reveal → wax seal melt → ink bloom → envelope reveal
- SplitText kinetic typography (couple names char-by-char with `font-variation-settings` interpolate)
- GSAP master timeline orchestration

### 1.9 Countdown T-0 detonation
- `components/themed/countdown-luxe.tsx` upgrade
- T-0 trigger: confetti burst (per-edition palette colors) + WaxSeal shatter shader + fullscreen flash + Tone.js "ceremonial chime"
- Lottie/Rive seal shatter animation

### 1.10 Scroll progress wax-drip rail
- `components/motion/scroll-progress.tsx`
- SVG path stroke-dashoffset bound to scroll %
- Right edge, 4px wide, per-edition accent color
- Mobile: hidden veya top-thin bar

### 1.11 prefers-reduced-motion respect
- `useReducedMotion()` from framer-motion'a + audio için manuel check
- ScrollTrigger pinning OFF, Lenis lerp ↘, Rive autoplay OFF, ambient audio OFF
- A11y polish: focus rings, ARIA labels, skip-to-content

### 1.12 i18n SR (Sırpça) locale
- `lib/i18n/luxe-strings.ts` SR strings ekle
- `LuxeLocale` tipini `'tr' | 'en' | 'sr'` yap
- Footer language switcher TR / EN / SR

---

## Faz 2 — Per-Edition Signature "Wow Moment"

Her edition'a 1 paylaşılır an. Cost = ayrı dev karmaşıklığı ama screenshot/Twitter ROI yüksek.

| Edition | Signature | Tech | Mobile fallback |
|---|---|---|---|
| **AETHEL** | Vespers Bell + GPGPU doves | R3F + Three.js + Tone.js | Reduced particle count, no GPGPU |
| **NOCTURNE** | Ink Bloom on Water (Ebru marbling) | WebGPU Navier-Stokes compute | WebGL fragment shader fallback |
| **CANDÉLA** | Lanterns at Dusk + scroll-velocity ignition | OGL + bloom + Howler positional | OGL works on mobile, no fallback needed |
| **MISTRAL** | Tide That Knows You (underwater dive) | PixiJS displacement + Three.js caustic + View Transitions | Static caustic image + View Transition only |
| **OLEA** | Wind Through the Grove (gyro-driven) | R3F instanced + Rapier physics + Tone.js generative | Gyro on mobile, cursor on desktop, reduced motion = static |
| **AURORA** | First Light (drag horizon) | Native CSS scroll-driven + variable font + View Transitions | Same — zero JS, works everywhere |

---

## Faz 3 — Asset Generation + Global Rollout

### 3.1 fal.ai asset üretim (~$80-120 toplam)
Her edition için:
- Hero cover scene (4K painterly, fal-ai flux-pro/v1.1-ultra)
- Wax seal PNG (transparent, Aurora için reroll — geometric çok zayıftı)
- Envelope paper bg (BERKE-DEVRALMA'da yarım kalan)
- Watermark texture
- 12 gallery placeholder photo (default — müşteri yüklemediyse)
- Signature moment textures (her edition'a özel)

### 3.2 Suno AI / royalty-free müzik (6 track)
- AETHEL: solo piano Einaudi register
- NOCTURNE: Chopin Nocturne neoclassical
- CANDÉLA: Ottoman ney + piano + cello
- MISTRAL: ambient piano + airy synth
- OLEA: acoustic guitar fingerpicked
- AURORA: minimal piano + electronic pulse

### 3.3 One-shot SFX kütüphanesi
- Chapel bell (AETHEL)
- Lantern whoosh (CANDÉLA)
- Water splash + dive (MISTRAL)
- Cicada burst (OLEA)
- Ferry horn far (NOCTURNE)
- Confetti pop (countdown T-0)
- WaxSeal shatter (countdown T-0)

### 3.4 Production wiring
- Mevcut `/dev-preview/<edition>` izole demo
- Yeni LuxeEditionDemo'yu `/i/[slug]` production route'a bağla
- Editor UI'dan couple/venue/tarih düzenlenebilir hale getir (mevcut hardcoded)
- DB migration: `invitations.template_slug` rename

### 3.5 i18n SR rollout
- 3 dilde tüm strings, RSVP form, FAQ, schedule
- Footer language switcher
- DB: per-invitation locale field

### 3.6 Marka tescil (paralel iş, Zeynep'e)
- Türkpatent başvurusu: NUVE + AETHEL + NOCTURNE + CANDÉLA + MISTRAL + OLEA + AURORA
- EUIPO başvurusu (EU pazarı için)

---

## Commit serisi (her biri build geçer halde)

1. ✅ `docs: VIRAL-ROADMAP.md (faz 1-3 master plan)` ← bu commit
2. `refactor(naming): rename 4 editions to global-friendly slugs (atelier-indigo→nocturne, mansion-lights→candela, bodrum-blue→mistral, olive-grove→olea)`
3. `chore(deps): install lenis, gsap, @rive-app, tone, howler, three, @react-three/fiber, ogl, pixi, @use-gesture`
4. `feat(motion): Lenis smooth scroll provider + GSAP ScrollTrigger setup`
5. `feat(motion): magnetic cursor + blend-mode states`
6. `feat(motion): view transitions API wrapper (envelope→hero seal morph)`
7. `feat(audio): Tone.js + Howler audio context + per-edition ambient + unmute prompt`
8. `feat(envelope): Rive state machine replace DOM envelope ceremony`
9. `feat(intro): 2.5s cinematic page-in (curtain reveal + SplitText + wax melt)`
10. `feat(countdown): T-0 detonation (confetti + seal shatter + flash + chime)`
11. `feat(scroll): wax-drip scroll progress rail`
12. `feat(a11y): prefers-reduced-motion respect across all motion systems`
13. `feat(i18n): SR (Sırpça) locale + 3-way language switcher`

Faz 1 toplam ~13 commit, her biri review-friendly.

---

## Success metrics

- **Lighthouse Performance:** mobile ≥90, desktop ≥95
- **Awwwards score:** Design ≥9, UX ≥9, Mobile ≥9 (Site of the Day eşiği)
- **Page load:** First Contentful Paint <1.5s on 4G mobile
- **Viral test:** 10 ürün hunter / Twitter wedding planner influencer'a göster, ≥3 reshare almazsa pivot
- **Conversion:** /tasarimlar → /order funnel %3+ (mevcut bilinmiyor)

---

Started: 2026-05-23 · Branch: `feature/viral-upgrade-faz-1`
