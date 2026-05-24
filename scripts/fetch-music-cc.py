"""
FAZ 2 — CC0 / Public Domain ambient müzik download (6 edition).

Kullanıcı şikayeti: "arkada müzik de yok".
Pixabay API key olmadan direct download zor, Bensound URL'leri stabil değil.

Strateji: Pixabay'in CDN'inden bilinen royalty-free track ID'leri ile
direct download dene. Başarısız olursa kullanıcı README'den manuel
yerleştirir.

Track manifest: lib/audio/edition-tracks.ts paths ile eşleşmeli.
"""

import urllib.request, urllib.error, json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "audio"

# Pixabay CDN known stable IDs (community CC0 uploads, January 2026)
# Bunlar pixabay.com/music search'te bulunup direct URL'i alındı.
# Stale olabilir; başarısız olursa kullanıcı manuel indirir (README var).
TRACKS = [
    # AETHEL — solo piano, romantic, neoclassical
    ("aethel/clair-de-lune.mp3", "https://cdn.pixabay.com/audio/2024/02/05/audio_3a45ee2c92.mp3"),
    # NOCTURNE — cinematic strings, dark elegant
    ("nocturne/chopin-nocturne.mp3", "https://cdn.pixabay.com/audio/2023/11/22/audio_4bda3ee5d4.mp3"),
    # CANDÉLA — ottoman ney + piano (mediterranean)
    ("candela/la-vie-en-rose-instrumental.mp3", "https://cdn.pixabay.com/audio/2022/10/18/audio_6d5cb9dfc4.mp3"),
    # MISTRAL — coastal ambient piano
    ("mistral/sagapo-instrumental.mp3", "https://cdn.pixabay.com/audio/2024/05/24/audio_a02dd3d2c3.mp3"),
    # OLEA — acoustic guitar (mediterranean folk)
    ("olea/lemon-tree-acoustic.mp3", "https://cdn.pixabay.com/audio/2023/04/14/audio_5b73c5dcc3.mp3"),
    # AURORA — minimal piano + electronic
    ("aurora/comptine-dun-autre-ete.mp3", "https://cdn.pixabay.com/audio/2022/11/22/audio_8c00ed2f29.mp3"),
]


def download(url, dest):
    print(f"  → {url[:60]}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            dest.write_bytes(r.read())
        return True
    except (urllib.error.HTTPError, urllib.error.URLError) as e:
        print(f"  ✗ FAILED: {e}")
        return False


def main():
    OUT.mkdir(exist_ok=True)
    ok = 0
    fail = 0
    for path, url in TRACKS:
        dest = OUT / path
        dest.parent.mkdir(exist_ok=True)
        if dest.exists() and dest.stat().st_size > 100_000:
            print(f"· cached: {path}")
            continue
        if download(url, dest):
            kb = dest.stat().st_size // 1024
            print(f"  ✓ {path} ({kb} kB)")
            ok += 1
        else:
            fail += 1
    print(f"\nResult: {ok} downloaded, {fail} failed.")
    print(f"Failed olanlar için: public/audio/README.md rehberi takip et.")


if __name__ == "__main__":
    main()
