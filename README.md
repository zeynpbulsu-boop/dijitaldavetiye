# NUVE — Wedding Invitation Platform

Modern, editorial digital wedding invitation platform built with Next.js 14 App Router.

## Stack

- **Next.js 14** (App Router, RSC, TypeScript)
- **Tailwind CSS** + shadcn/ui theming system
- **Inter** (body) + **Cormorant Garamond** (display italic) via `next/font/google`
- **Lucide React** icons
- Editorial color palette (warm cream, rose, sage, gold)
- Built-in OG image, favicon, Apple touch icon, robots.txt, sitemap.xml — all generated from code

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve production build
```

## Project Structure

```
app/
  layout.tsx                Root layout — fonts + metadata + OG
  page.tsx                  Landing — composes all sections
  globals.css               Tailwind base + design tokens
  icon.tsx                  Favicon (32×32) — code-generated wax seal
  apple-icon.tsx            iOS home-screen icon (180×180)
  opengraph-image.tsx       1200×630 link-preview card
  robots.ts                 robots.txt
  sitemap.ts                sitemap.xml
  _sections/
    nav.tsx
    hero.tsx
    wax-seal.tsx            Reusable SVG component
    how-it-works.tsx
    comparison.tsx          Paper vs Digital
    themes.tsx              12-template gallery (real Unsplash photos)
    admin-teaser.tsx        Realistic admin panel mockup
    international.tsx       Multi-language (TR, EN, DE, FR, SR, BA, GR, IT)
    pricing.tsx
    testimonials.tsx
    partners.tsx            B2B wedding-planner CTA
    faq.tsx
    footer.tsx

components/ui/              shadcn components (add via CLI later)
lib/utils.ts                cn() className helper
```

## Configuration

Copy `.env.local.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SITE_URL=https://nuve.co
```

Other env vars (Supabase, Dodo Payments, Resend, etc.) come in later phases.

## Adding shadcn components

```bash
npx shadcn@latest init       # only first time
npx shadcn@latest add accordion button card badge
```

## Deploy to Vercel

```bash
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

Then on Vercel: Import Project → Select repo → Deploy.
Vercel auto-detects Next.js. Build takes ~60s, lives at `<project>.vercel.app`.

## Design System Tokens

| Token | HSL | Use |
|-------|-----|-----|
| `bg-bg` | warm cream | page background |
| `bg-paper` | white | cards, contrast |
| `text-ink` | warm dark | headings |
| `text-ink-soft` | softer dark | body |
| `text-accent-deep` | rose deep | emphasis, italic spans |
| `text-gold` | antique gold | premium accent |
| `text-sage` | sage green | secondary accent |
| `font-serif` italic | Cormorant Garamond | editorial emphasis only |

## Next Steps

1. Decide on final brand name + domain (currently `nuve.co` placeholder)
2. Add Supabase database (orders, RSVPs, templates)
3. Add Dodo Payments + Shopier integration for checkout
4. Build the order form (`app/order/[template]/page.tsx`)
5. Build the admin panel (`app/admin/page.tsx`)
6. Build dynamic wedding sites (`app/[slug]/page.tsx`)

---

**Built by NUVE Studio · 2026**
