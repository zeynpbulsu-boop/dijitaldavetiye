# NUVE — Coolify Deployment

End-to-end checklist for pushing this Next.js 14 app to Coolify with
Supabase + Dodo Payments + Resend wired up. ~30 minutes if you have
all the accounts ready.

---

## 0. Prerequisites

- A Coolify instance you can log into (your own VPS or hosted)
- A GitHub account
- A Supabase account (free tier is fine to start)
- A Dodo Payments account (`dodopayments.com`) — keys from dashboard
- (Optional) A Resend account for transactional emails
- A domain you control (or use the `*.coolify.app` subdomain Coolify gives you)

---

## 1. Push code to GitHub

From the project root:

```bash
cd nuve-nextjs
git init
git add .
git commit -m "NUVE — initial commit"
gh repo create nuve --private --source=. --push
```

If you don't have `gh` CLI: create an empty private repo at
github.com/new called `nuve`, then:

```bash
git remote add origin git@github.com:YOUR_USERNAME/nuve.git
git branch -M main
git push -u origin main
```

---

## 2. Set up Supabase

1. Go to https://supabase.com → New Project. Region: **Frankfurt** (closest to Türkiye).
2. After provisioning (~2 min), open the **SQL Editor**.
3. Paste the entire contents of `supabase/migrations/001_init.sql` and **Run**.
4. Verify 3 tables exist under **Database → Tables**: `invitations`, `rsvps`, `webhook_events`.
5. Go to **Project Settings → API**. Copy three values:
   - **Project URL** → for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret — never commit) → for `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Set up Dodo Payments

1. Sign in at https://app.dodopayments.com.
2. **Developer → API Keys** → create one. Copy → `DODO_PAYMENTS_API_KEY`.
3. **Products → Create product** three times — one per tier. For each:
   - Type: **One-time**
   - Price: `₺2.999` / `₺4.999` / `₺6.299` (or your USD/EUR equivalents)
   - Save → copy the **Product ID** (looks like `pdt_xxxxx`)
   - Map to env vars: `DODO_PRODUCT_SADE`, `DODO_PRODUCT_KLASIK`, `DODO_PRODUCT_PREMIUM`
4. **Developer → Webhooks → Add endpoint**:
   - URL: `https://YOUR_DOMAIN/api/webhooks/dodo` (you'll set domain in step 5)
   - Events to subscribe: `payment.succeeded`, `payment.failed`, `payment.cancelled`,
     `refund.succeeded`, `refund.failed`, `dispute.opened`, `dispute.won`, `dispute.lost`
   - Save → copy the **Signing secret** → `DODO_PAYMENTS_WEBHOOK_KEY`
5. Start in **test_mode**. Flip to `live_mode` only after you've taken a test card payment end-to-end.

---

## 4. (Optional) Resend for emails

1. Sign in at https://resend.com → **API Keys** → create one → `RESEND_API_KEY`.
2. **Domains → Add domain** → add your sending domain (e.g. `nuve.app`).
3. Add the SPF + DKIM TXT records Resend shows you to your DNS. Wait for verification (5–60 min).
4. Set `NUVE_FROM_EMAIL` to something like `NUVE <hello@nuve.app>`.

Without this, the webhook + RSVP routes just log a message and skip sending. No crash.

---

## 5. Create the Coolify application

1. In your Coolify panel: **+ New → Application**.
2. Source: **GitHub** → connect → pick the `nuve` repo → branch `main`.
3. Build pack: **Dockerfile** (Coolify will detect the `Dockerfile` at repo root).
4. Port: `3000`.
5. Health check path: `/` (returns 200).

### Environment variables

Paste this whole block into Coolify's env editor and fill in the blanks:

```
NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

DODO_PAYMENTS_API_KEY=
DODO_PAYMENTS_WEBHOOK_KEY=
DODO_PAYMENTS_ENVIRONMENT=test_mode
DODO_PRODUCT_SADE=
DODO_PRODUCT_KLASIK=
DODO_PRODUCT_PREMIUM=

RESEND_API_KEY=
NUVE_FROM_EMAIL="NUVE <hello@nuve.app>"
```

Hit **Save**, then **Deploy**. First build ~5–8 minutes.

---

## 6. Bind your domain

1. In Coolify: **Application → Domains** → add `nuve.app` (or whatever).
2. Coolify shows the DNS record you need (an `A` record to your VPS IP).
3. Add that record in your DNS provider (Cloudflare, etc.). Wait for propagation.
4. Coolify auto-issues a Let's Encrypt SSL cert when DNS resolves.
5. Once live, go back to **Dodo dashboard → Webhooks → your endpoint** and confirm the URL
   matches `https://YOUR_DOMAIN/api/webhooks/dodo`.

---

## 7. Drop in your watercolor assets

The invitation view will look for backgrounds at:

```
public/illustrations/{template-slug}/hero.jpg   (or .png / .webp)
```

Supported template slugs (one folder per — already scaffolded):

```
blush-reverie · bordeaux · olive-grove · mansion-lights ·
magnolia · timeless · modern · lavender · kir-bahcesi ·
egee-blue · black-ink · elegant-ivory · verde-borgogna · blush-garden
```

Drop one image per template (use the largest, highest-quality version
you have — Next will serve it as-is, no optimization). Recommended:
**1080×1920px portrait JPEG, under 600 KB**.

If a folder has no image, the page falls back to the gradient + SVG
ornaments — no error, the slot just stays empty.

Commit the assets:

```bash
git add public/illustrations/
git commit -m "Add watercolor backgrounds"
git push
```

Coolify auto-detects the push and rebuilds.

---

## 8. Smoke test

After deploy, walk this path in a browser:

1. `https://YOUR_DOMAIN` — landing page loads, no console errors
2. Click **Davetiyeni Oluştur** → `/order/blush-reverie` → form loads, autosave indicator shows
3. Fill in two names + a date → click **Devam et — Öde ve yayınla**
4. Dodo hosted checkout opens → use test card `4242 4242 4242 4242`, any future expiry, any CVC
5. Pay → return to `/checkout/success` → confirms payment received
6. In Supabase **Table Editor → invitations**, find your row → manually set `status = 'live'`
7. Visit `https://YOUR_DOMAIN/i/YOUR_SLUG` → envelope appears → click seal → animation plays → invitation reveals
8. Submit an RSVP → check **Table Editor → rsvps** → row appears
9. Visit `https://YOUR_DOMAIN/admin/YOUR_ADMIN_TOKEN` (copy from Supabase row) → see RSVP in admin panel + CSV download works

If any step fails, check **Coolify → Application → Logs** first. Most issues
are env vars not pasted correctly.

---

## 9. Going live (test_mode → live_mode)

When you're ready to take real money:

1. Dodo dashboard → switch your API key to **live_mode**
2. Re-paste the **live** API key into `DODO_PAYMENTS_API_KEY` env var on Coolify
3. Set `DODO_PAYMENTS_ENVIRONMENT=live_mode`
4. Create the **live** webhook endpoint (different from test) and grab its new signing secret
5. Update `DODO_PAYMENTS_WEBHOOK_KEY`
6. Restart the app from Coolify

That's it. Real cards now go through Dodo's MoR — they handle tax,
chargebacks, settlement to your Wise/Payoneer USD/EUR account.

---

## Common gotchas

- **Webhook signature failures**: your reverse proxy is stripping the
  `webhook-id` / `webhook-signature` / `webhook-timestamp` headers.
  Check Coolify → **Application → Settings → Headers**.
- **"Failed to fetch font Inter Tight"** during build: usually a Coolify
  build-time network issue. Re-trigger the build.
- **Supabase RLS errors** when reading invitations: confirm the policy
  on `invitations` for `select` to `anon` is `status = 'live'`.
- **Audio doesn't play**: browser blocks autoplay; the seal click is
  the user gesture that unlocks it. Make sure `music_url` is a direct
  MP3/M4A link (no Spotify/SoundCloud — those don't autoplay).
