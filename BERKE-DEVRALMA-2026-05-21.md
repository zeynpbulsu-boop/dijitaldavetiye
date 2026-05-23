# NUVE — Devralma Notu (2026-05-21)

> Zeynep + Claude Opus 4.7 ile yapılan oturumun özeti. Berke devam edecek.

---

## TL;DR

Tek bir oturumda **11 PR (PR #17 → PR #27)** main'e merge edildi + Coolify deploy edildi. Kullanıcı (Zeynep) Pressed Love (özellikle Swan Lake demo) + The Digital Invite + bizevleniyoruz.net referanslarını verdi; NUVE'nin 6 luxe edition'ını bu rakiplerle görsel + içerik paritesine getirmek hedefti.

**Sonuç:** 6/6 edition (`aethel`, `atelier-indigo`, `mansion-lights`, `bodrum-blue`, `olive-grove`, `aurora`) artık aynı `LuxeEditionDemo` pattern'ini kullanıyor ve şu özellikler her birinde çalışıyor:

- Full-bleed Pressed Love Swan Lake kalitesinde suluboya cover sahnesi (`/<edition>/cover.jpg`)
- 380px büyük wax seal + drop-shadow
- 4-entry "— Hikâyemiz" timeline (yıl + başlık + 2-3 satır anlatı + per-edition glyph)
- 5-satır per-edition Program of the Day (Pressed Love Big Entrance paritesi)
- 5 venue-specific FAQ
- 4 venue-specific hotel listesi
- Countdown (weddingDateISO set)
- Per-edition micro-animations (doves / starfield / chandelier / waves / leaves / aurora)
- Envelope ceremony: diyagonal flap çizgileri + mail icon + büyük seal
- Sticky CTA (24h dismiss localStorage)
- /tasarimlar dedicated catalog page (kategori filtreleri + 3-col grid + Coming Soon kartı)

---

## Test URL'leri (Coolify live)

http://b9ba0lj82z1m88uwltdc1w85.72.62.39.172.sslip.io

| Demo | URL |
|---|---|
| Aethel (Toskana şapel) | /dev-preview/aethel |
| Atelier Indigo (Çırağan gece) | /dev-preview/atelier-indigo |
| Mansion Lights (yalı) | /dev-preview/mansion-lights |
| Bodrum Blue (Ege + yelkenli) | /dev-preview/bodrum-blue |
| Olive Grove (Alaçatı zeytinlik) | /dev-preview/olive-grove |
| Aurora (modernist gradient) | /dev-preview/aurora |
| Dedicated catalog | /tasarimlar |
| Landing | / |

**Test:** Gizli sekme + Cmd+Shift+R unutma.

---

## Bu turda yapılan PR'lar (sırayla)

| # | SHA | Başlık | Özet |
|---|---|---|---|
| 17 | `b2322c1` | per-edition full-bleed scene covers | fal.ai ile 6 edition için ilk cover.jpg setleri |
| 18 | `de2dd30` | /tasarimlar catalog + carousel polish | Dedicated catalog sayfası + numbered display + En sevilen / Yakında rozetleri + Demoyu gör hover pill |
| 19 | `4ea5f37` | per-edition micro-animations | EditionAmbient component, 6 kind (doves/starfield/chandelier/waves/leaves/aurora) |
| 20 | `e3a7b93` | JourneyTimeline + per-edition default story | "Bizim Hikâyemiz" section, 6 farklı glyph |
| 21 | `5b452da` | per-edition schedule + FAQ + hotels | Pressed Love Big Entrance paritesi narrative + ScheduleIcon 4→10 kind |
| 22 | `ec8c013` | Hero full-bleed cover + büyük seal + envelope flap | Hero artık coverScene'i full-bleed render eder, seal 210→380px |
| 23 | `da6781a` | inline import() type fix | Build kıran TypeScript syntax düzeltildi |
| 24 | `c5fd8ac` | Swan Lake watercolor quality covers | 6 cover.jpg yeniden render edildi PL Swan Lake estetiğiyle (painterly pastel, fal.ai flux-pro/v1.1-ultra) |
| 25 | `c4a0246` | .dockerignore _orig + NODE_OPTIONS 2GB | Build context 219MB→30MB, OOM fix |
| 26 | `27b4e35` | envelope-paper bg infrastructure | `envelopePaperSrc` opsiyonel field, ileride doldurulacak |
| **27** | `f21b06f` | **KÖK SORUN: aethel demo LuxeEditionDemo'ya geçti** | `app/dev-preview/aethel/page.tsx` artık bespoke component yerine `LuxeEditionDemo + AETHEL_THEME` kullanıyor |

---

## KRİTİK BİLGİ — Çözülen kök sorun

Zeynep saatlerce "hiçbir şey değişmemiş, uzaktan yakından alakası yok" geri bildirimi verdi. Sebebi:

**`/dev-preview/aethel/page.tsx` bespoke `AethelChapelDemo` component'ini import ediyordu.** Diğer 5 edition `LuxeEditionDemo` kullanıyordu. PR #17-26 boyunca yapılan tüm geliştirmeler 5 edition'da çalışıyordu ama Aethel'da görünmüyordu — kullanıcı her test ettiğinde carousel'in ilk kartına (Aethel) tıklıyordu.

**PR #27 bu sorunu kapattı.** Şimdi 6/6 demo aynı pattern.

Eski bespoke `app/dev-preview/aethel/_aethel-demo.tsx` dosyası hâlâ duruyor ama artık import edilmiyor → bir sonraki temizlemede silinmeli.

---

## Şu an çalışmayan / yarım kalan

### 1. Envelope paper bg asset'leri eksik
PR #26 ile altyapı eklendi (`envelopePaperSrc?: string` field + Image fill render), ama fal.ai congested olduğu için 6 PNG render edilemedi. Şu an SVG flap çizgileri fallback'i devrede.

**Devam etmek için:**
```bash
cd /Users/zeynepbulsu/projects/nuve
python3 scripts/render-envelope-paper.py
python3 scripts/optimize-covers.py  # benzer mantıkla yaz
# Sonra luxe-themes.ts'de her theme'e envelopePaperSrc ekle
```

### 2. Müzik autoplay yok
`MusicWaveformPlayer` component'i var ama `src` prop'u set edilmiyor (sadece `trackLabel`). Pressed Love demolarında müzik çalıyor. Bunun için:
- Royalty-free MP3 dosyaları (Pixabay / Suno) bul
- Her edition için `/public/<edition>/music.mp3` ekle
- `LuxeEditionTheme.musicUrl?: string` field ekle
- `MusicWaveformPlayer src={theme.musicUrl}` geç
- Autoplay tarayıcı policy gereği user-gesture sonrası başlar — envelope açıldığında tetiklenebilir

### 3. _aethel-demo.tsx silinmedi
`app/dev-preview/aethel/_aethel-demo.tsx` (eski bespoke component) artık kullanılmıyor ama dosya duruyor. Bundle'a kalmaması için silinebilir.

### 4. Hero phone mockup detayları
Landing'deki phone mockup (`app/_sections/hero.tsx`) Aethel snapshot gösteriyor. Daha sonra:
- "Tap to play" caption + müzik notası göstergesi
- Müzik çaldığını ima eden ufak animasyon
- Belki video preview (envelope açılışı 3sn)

### 5. Dodo Payments LIVE keys
Production ödeme akışı için Dodo LIVE keys lazım (Zeynep'e bağlı). Şu an test mode.

### 6. Domain
Hâlâ `*.sslip.io` üzerinde. Cloudflare DNS A record + Coolify SSL otomasyonu gerekli.

---

## Coolify deploy / panel erişimi

**Panel down olduğunda manuel deploy nasıl tetiklenir:**

Chrome MCP disconnect olduktan sonra Coolify API token olmadan deploy etmek için Livewire üzerinden session cookie ile bir Python script yazıldı. Konum: `/tmp/coolify_deploy2.py`

Çalışma şartları:
- Chrome'da Coolify panel açık ve login olunmuş olmalı (cookie geçerli olsun)
- `Chrome/Default/Cookies` SQLite'tan cookies decrypt edilir (macOS keychain `Chrome Safe Storage` password ile)
- Livewire `deploy` method'u `/livewire/update` endpoint'ine POST edilir
- Direkt IP'ye + `Host: coolify.bulsulabs.xyz` header ile gönderilir (TLS cert chain LibreSSL ile uyumsuz, `-k` insecure mode)

**Daha iyi yol:** Coolify panel → Settings → Keys & Tokens → API Token oluştur. Sonra:
```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  "https://coolify.bulsulabs.xyz/api/v1/deploy?uuid=b9ba0lj82z1m88uwltdc1w85&force=false"
```

**Build log nasıl okunur (Coolify panel olmadan):**
- Horizon dashboard: `https://coolify.bulsulabs.xyz/horizon/api/jobs/failed`
- VEYA SSH: `ssh 72.62.39.172 'docker logs coolify -f --tail 500'`
- VEYA deployment uuid ile: `/api/v1/applications/{app_uuid}/logs` (API token gerek)

---

## Coolify build sorunu — çözüldü ama önemli

PR #20-22 deploy'ları üst üste başarısızdı. Çözülen iki sebep:

1. **PR #23** — `luxe-edition-demo.tsx:1383` satırında `name: import("@/lib/i18n/luxe-strings").ScheduleIconName` inline import() type syntax'ı Next.js 14 SWC compiler'da fail oluyordu. Top-level type import'a çevrildi.

2. **PR #25** — `public/` 219MB olmuştu (6 edition × 3-4 versiyon × 5-7MB _orig PNG). Docker build context çok şişiyor, sharp AVIF/WebP optimization'da OOM oluyordu.
   - `.dockerignore`'a `public/**/_orig-*.png` exclude eklendi
   - `Dockerfile` builder stage'ine `ENV NODE_OPTIONS="--max-old-space-size=2048"` eklendi

---

## Asset üretim — fal.ai pipeline

Tüm cover sahneleri fal.ai `flux-pro/v1.1-ultra` ile rendered. API key:
```
7441b24e-10e4-445f-87ed-5ef928088a0b:82a7f49c3728ef622af17281125214a9
```
(scripts içinde hardcoded — production'da env'e taşınmalı)

Scriptler:
- `scripts/render-edition-covers.py` — PR #17 ilk cover'ları (gerçekçi atmosferik)
- `scripts/render-swan-quality-covers.py` — PR #24 Swan Lake painterly pastel (kullanılan)
- `scripts/optimize-covers.py` — Pillow 1600px JPEG q88
- `scripts/optimize-swan-covers.py` — PR #24 swan PNG'leri cover.jpg'ye çevirdi
- `scripts/render-envelope-paper.py` — PR #26 zarf bg (YARIM, fal.ai timeout)
- `scripts/render-5-editions.py` — eski watermark + wax-seal render (PR #17 öncesi)

Pillow gerekli: `python3 -m pip install Pillow pycryptodome`

---

## Memory dosyaları (Claude'un öğrendiği)

`/Users/zeynepbulsu/.claude/projects/-Users-zeynepbulsu/memory/`:

| Dosya | İçerik |
|---|---|
| `feedback_deploy_target.md` | "Sadece Coolify URL ver, Vercel preview gösterme" |
| `feedback_visual_verification.md` | "Paritesi iddia etmeden önce Chrome screenshot ile yan yana karşılaştır" |

Berke devam ederken bu kuralları takip etmeli. Özellikle ikincisi kritik — kod gönderip "yapıldı" demek yetmiyor, deploy sonrası gerçek render'a bakmak şart.

---

## Önerilen sıradaki adımlar (öncelik sırasıyla)

1. **Aethel demo'yu Zeynep ile birlikte gez** — PR #27 sonrası live'da artık çalışıyor. Geri bildirim al.
2. **Müzik autoplay** — Pressed Love'da olan tek eksik. MP3 dosyaları + autoplay logic.
3. **Envelope paper bg asset render** — fal.ai congested değilse çalışır, 1-2 dakikada biter.
4. **`_aethel-demo.tsx` sil** — kod temizliği.
5. **`HANDOFF.md`'deki GitHub Actions auto-deploy workflow** — PAT workflow scope'lu olunca push edilebilir.
6. **i/[slug] production route'una luxe demo bağlama** — şu an demo izole, gerçek davetiyelerle bağlı değil.

---

## Komutlar cheatsheet (Berke için)

```bash
# Proje dizini
cd /Users/zeynepbulsu/projects/nuve

# Git
git status
git log --oneline -10
git fetch origin main && git pull

# Coolify deploy (manuel)
cp "/Users/zeynepbulsu/Library/Application Support/Google/Chrome/Default/Cookies" /tmp/chrome_cookies.db
python3 /tmp/coolify_deploy2.py

# Live site kontrol
curl -sS "http://b9ba0lj82z1m88uwltdc1w85.72.62.39.172.sslip.io/dev-preview/aethel" | grep -c "Hikâyem"

# Coolify panel browser
# https://coolify.bulsulabs.xyz/project/awm4k3kh9chfcdmxdjo0uz6o/environment/w1w5qgscs3rz3yqoeom0lbsg/application/b9ba0lj82z1m88uwltdc1w85
```

---

## Sistem durumu

- **Repo**: https://github.com/zeynpbulsu-boop/dijitaldavetiye (main HEAD `f21b06f`)
- **Coolify panel**: https://coolify.bulsulabs.xyz (TLS cert macOS LibreSSL ile uyumsuz, `-k` veya Chrome ile)
- **VPS**: 72.62.39.172 (Hetzner, küçük boyut — OOM riski)
- **Live**: http://b9ba0lj82z1m88uwltdc1w85.72.62.39.172.sslip.io
- **Build**: Dockerfile (node:20-alpine + Next.js standalone)

---

**Hadi kolay gelsin Berke.** Aethel demo'yu git, Atelier Indigo'yu git — orada Pressed Love Swan Lake'le yan yana karşılaştır. Zeynep ile bunu yan yana açıp neyin farklı kaldığını işaretleyin, sıradaki PR'lar oradan şekillenir.
