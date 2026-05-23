# NUVE Edition Ambient Audio — Telif Sorunsuz Kaynaklar

Her edition için ambient + opsiyonel music + SFX gerekli. Tüm kaynaklar
**royalty-free**, ticari kullanıma açık. Asset boyutları MP3 q=128kbps.

## Hedef yapı

```
public/audio/
├── aethel/
│   ├── ambient-chapel-reverb.mp3     (loop, 2-3 dk)
│   ├── clair-de-lune.mp3              (music track)
│   ├── bell-bronze-toll.mp3           (SFX, 4 sn)
│   ├── doves-flapping.mp3             (SFX, 2 sn)
│   └── footsteps-stone.mp3            (SFX, 3 sn)
├── nocturne/
│   ├── ambient-bosphorus-night.mp3
│   ├── chopin-nocturne.mp3
│   ├── chandelier-crystal.mp3
│   ├── champagne-pour.mp3
│   └── ink-drop.mp3
├── candela/
│   ├── ambient-yali-evening.mp3
│   ├── la-vie-en-rose-instrumental.mp3
│   ├── candle-flicker.mp3
│   ├── bosphorus-ferry-horn-far.mp3
│   └── lantern-whoosh.mp3
├── mistral/
│   ├── ambient-aegean-waves.mp3
│   ├── sagapo-instrumental.mp3
│   ├── seagull-distant.mp3
│   ├── boat-creak.mp3
│   └── water-splash.mp3
├── olea/
│   ├── ambient-cicadas-leaves.mp3
│   ├── lemon-tree-acoustic.mp3
│   ├── cicada-burst.mp3
│   ├── morning-birdsong.mp3
│   └── olive-oil-pour.mp3
├── aurora/
│   ├── ambient-pad-faint-piano.mp3
│   ├── comptine-dun-autre-ete.mp3
│   ├── glass-chime.mp3
│   └── paper-flutter.mp3
└── shared/
    ├── ceremonial-chime.mp3          (countdown T-0)
    ├── confetti-pop.mp3              (countdown T-0)
    ├── wax-seal-shatter.mp3          (envelope + countdown)
    └── envelope-tear.mp3             (envelope open)
```

## Önerilen kaynaklar (telif yemez, ticari OK)

### 1. Pixabay Music — https://pixabay.com/music/

CC0 lisans, kayıt gerekli ama ücretsiz. Direkt MP3 indir.

**AETHEL** — Tuscan chapel, sage, doves
- Arama: "piano romantic", "neoclassical", "tuscany violin"
- Track önerileri (Pixabay arama URL'leri):
  - https://pixabay.com/music/search/solo%20piano%20romantic/
  - https://pixabay.com/music/search/classical%20chapel/
  - SFX: https://pixabay.com/sound-effects/search/church%20bell/ → "bronze toll" filtresi

**NOCTURNE** — Black-tie palace, gold, starfield
- Arama: "chopin nocturne", "neoclassical strings", "elegant piano"
- https://pixabay.com/music/search/classical%20piano%20nocturne/
- SFX: https://pixabay.com/sound-effects/search/champagne%20pour/ + crystal chimes

**CANDÉLA** — Bosphorus mansion, candlelit, burgundy
- Arama: "ottoman ney piano", "vintage instrumental", "la vie en rose"
- https://pixabay.com/music/search/ottoman%20cinematic/
- SFX: candle crackle, distant ferry horn

**MISTRAL** — Aegean coastal, blue, sailboat
- Arama: "ambient ocean piano", "olafur arnalds near light", "mediterranean piano"
- https://pixabay.com/music/search/aegean%20piano%20ambient/
- SFX: waves, seagulls, boat creak

**OLEA** — Alaçatı olive grove, sage, lemon tree
- Arama: "acoustic guitar fingerpicked", "lemon tree fools garden", "joep beving"
- https://pixabay.com/music/search/acoustic%20mediterranean%20folk/
- SFX: cicada, morning birdsong

**AURORA** — Modernist minimal, beige rose-gold
- Arama: "minimal piano electronic", "nils frahm", "comptine"
- https://pixabay.com/music/search/minimal%20piano%20ambient/
- SFX: glass chime, paper flutter

### 2. Free Music Archive — https://freemusicarchive.org/

Bazı tracks CC-BY (atıf gerekli), bazıları CC0. Filtre: License → "Creative Commons Zero".

### 3. Suno AI — https://suno.com

Kendi 6 edition'a özel komposizyon üretebilir (premium ~$10/ay, edition'lar arası tutarlılık için ideal). "Generated with Suno" attribution gerekmez ticari kullanımda.

### 4. NUVE-özel kompozisyon (Phase 3 ideal)

Spotify'da bulamayacağın özgün track için Suno AI ile üretim:
- AETHEL: "Solo piano, neoclassical, 60bpm, warm reverb, no percussion, einaudi nuvole bianche style"
- NOCTURNE: "Cinematic strings + low brass swell, max richter on the nature of daylight register, restrained regal"
- CANDÉLA: "Ney + piano + cello hybrid, mercan dede style ambient, 60bpm, slow ud accent"
- MISTRAL: "Ambient piano + airy synth pad, olafur arnalds near light, salt-air spaciousness, 65bpm"
- OLEA: "Acoustic guitar fingerpicked + soft strings, joep beving warmth, mediterranean folk hint, 70bpm"
- AURORA: "Minimal piano + electronic pulse, nils frahm style, quiet luxury, 60bpm"

## Yerleştirme script'i

Tüm dosyaları `~/Downloads/nuve-music/<edition>/...` ataya indirdiysen:

```bash
bash scripts/place-music.sh
```

Script dosyaları doğru `public/audio/<edition>/` yerlerine kopyalar.

## Lisanslama notu

Pixabay CC0 + Suno AI → atıf gerekmez, ticari OK.
Free Music Archive CC-BY → "Music by [artist] — freemusicarchive.org" footer/credits sayfasında belirt.

## Audio yoksa?

Sistem graceful degrade. AudioProvider Tone.js + Howler'ı lazy yükler;
dosya 404 → sessiz fallback. Hata yok, kullanıcı hiç fark etmez.
