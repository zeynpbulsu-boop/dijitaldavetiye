# NUVE — Claude Code Handoff

> Bu doküman, projeyi **Cowork sandbox'tan Claude Code'a** taşımak için 5 dakikalık reçete.

---

## 1. Local kurulum

```bash
# 1. Repo'yu local'e klonla
cd ~/projects   # veya tercih ettiğin dizin
git clone https://github.com/zeynpbulsu-boop/dijitaldavetiye.git nuve
cd nuve

# 2. Bağımlılıkları yükle
npm install

# 3. Claude Code'u kur (yoksa)
npm install -g @anthropic-ai/claude-code

# 4. Anthropic API key set et (Opus erişimi için)
export ANTHROPIC_API_KEY=sk-ant-...

# 5. Local .env hazırla
cp .env.local.example .env.local
# Coolify panelinden gerçek değerleri kopyala
```

---

## 2. Claude Code'u aç

```bash
claude
```

İlk komut:

```
Read CLAUDE.md and PLAN.md. We're continuing NUVE project from a Cowork session.
The project is at FAZ 5.12 — 6 luxe demo editions are live but disconnected
from the production /i/[slug] flow. Mobile is untested. 50MB assets unoptimized.
Editor doesn't match LuxeEditionTheme shape.

Today's mission: execute PLAN.md FAZ A → B → C → D in order.
Start with FAZ A.1 (mobile responsive overhaul) on /dev-preview/aethel.
Use Opus high-effort. Spawn subagents for parallel work where logical.

Each completed item: commit + push + Coolify redeploy + verify live.
```

Claude Code Opus high-effort açılır, `CLAUDE.md` + `PLAN.md` okur, hemen iş başına.

---

## 3. Coolify Redeploy otomasyonu

Claude Code'da `osascript` köprüsü Cowork'teki gibi yok. İki seçenek:

**A) Manuel:** Her FAZ sonunda kendin Coolify panelinden Redeploy bas. Claude Code "deploy bekleniyor" diye uyarır.

**B) GitHub Actions auto-deploy webhook** (KURMAYI ÖNERİYORUM, 5 dakikalık iş):

1. **Coolify webhook URL'ini al:**
   - Coolify panel → Application → Webhooks → "Generate Webhook"
   - URL'i kopyala (örn: `https://coolify.bulsulabs.xyz/api/v1/deploy?uuid=xxx`)

2. **GitHub Actions workflow ekle** — `.github/workflows/coolify-deploy.yml` oluştur:
   ```yaml
   name: Trigger Coolify Deploy
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Hit Coolify webhook
           run: |
             curl -X POST \
               -H "Authorization: Bearer ${{ secrets.COOLIFY_API_TOKEN }}" \
               "${{ secrets.COOLIFY_WEBHOOK_URL }}"
   ```
   > **NOT:** Bu dosyayı Cowork session push edemedi (PAT'te `workflow` scope yok). Local'de kendin push et:
   > ```bash
   > # Local repo'da, yeni PAT veya SSH ile:
   > git add .github/workflows/coolify-deploy.yml
   > git commit -m "ci: auto-trigger Coolify on push"
   > git push
   > ```

3. **GitHub repo → Settings → Secrets:**
   - `COOLIFY_WEBHOOK_URL` = (yukarıdaki URL)
   - `COOLIFY_API_TOKEN` = (Coolify panel → Keys & Tokens → Generate API Token)

Sonra her `git push` → otomatik Coolify deploy. 2-3 dk bekle, live verify.

---

## 4. Görsel doğrulama

Cowork'teki Chrome MCP yok. Alternatifler:

**A) Browser DevTools:** Manuel test, mobile emulation Chrome DevTools'tan (Cmd+Shift+M).

**B) Playwright:** Headless screenshot:
```bash
npm install --save-dev playwright
npx playwright install chromium
```
Sonra:
```ts
// scripts/screenshot-demos.ts
import { chromium, devices } from 'playwright';

const URLS = [
  'http://localhost:3000/dev-preview/aethel',
  'http://localhost:3000/dev-preview/atelier-indigo',
  // ...
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  ...devices['iPhone 13'],
});
const page = await ctx.newPage();
for (const url of URLS) {
  await page.goto(url);
  await page.waitForTimeout(7000); // animations
  await page.screenshot({ path: `screenshots/${url.split('/').pop()}-mobile.png`, fullPage: true });
}
await browser.close();
```
Claude Code bu scripti çalıştırıp screenshot'ları okuyabilir.

**C) Lighthouse CI:**
```bash
npm install --save-dev @lhci/cli
npx lhci autorun --collect.url=http://localhost:3000/dev-preview/aethel
```

---

## 5. Cowork session özetleri

Tamamlanmış FAZ'lar `CLAUDE.md` içinde history bölümünde. Hepsi git history'de:

```bash
git log --oneline | head -30
```

Son commit: `fe14331 feat(luxe): FAZ 5.12 — 5 edition rollout`

---

## 6. Bilinen sorunlar (öncelik sıralı)

| # | Sorun | Lokasyon |
|---|---|---|
| 1 | Watermark PNG'ler 5-9MB | `public/*/watermark.png` |
| 2 | `<img>` kullanımı her yerde | `wax-seal-luxe.tsx`, `chapel-watermark.tsx` |
| 3 | Mobile responsive değil | `luxe-edition-demo.tsx` tüm padding/size'lar |
| 4 | `/i/[slug]` luxe demo'ya bağlı değil | `app/i/[slug]/page.tsx` |
| 5 | Editor LuxeEditionTheme bilmiyor | `app/editor/[slug]/page.tsx` |
| 6 | Aurora seal zayıf | `public/aurora/wax-seal.png` |
| 7 | Mansion seal "H" monogram | `public/mansion-lights/wax-seal.png` |
| 8 | Dodo LIVE keys yok | Coolify env |
| 9 | Real domain yok | DNS + Coolify |
| 10 | A11y audit yapılmadı | Tüm pages |

---

## 7. Token tüketimi tahmini

Tüm 4 FAZ Opus high-effort'la ~$150-250 arası bir maliyet beklenir (yoğun çoklu dosya refactoring). Subagent'lar ek maliyet ekler ama paralelleştirme süreyi yarıya indirir.

`/cost` komutu Claude Code'da o anki tüketimi gösterir.

---

## 8. Yardım

- Claude Code docs: https://docs.claude.com/claude-code
- Anthropic API status: https://status.anthropic.com
- Bu proje issue'ları: GitHub repo

İyi çalışmalar. 🚀
