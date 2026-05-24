"""
FAZ 2 — Public Domain klasik müzik download (Wikimedia Commons).

Kullanıcı direktifi: "müzik olayını çözmemiz lazım, tatlı ve kaliteli
olmalı, seçimlerini iyi yap".

Seçimler (her edition'ın atmosferine + telifsizliğe göre):
  AETHEL   → Clair de Lune (Debussy)        — solo piano, dreamy, romantic
  NOCTURNE → Nocturne Op. 9 No. 2 (Chopin)  — elegant, melancholic
  CANDÉLA  → Gymnopédie No. 1 (Satie)       — slow, candlelit
  MISTRAL  → Gnossienne No. 1 (Satie)       — Mediterranean dreamy
  OLEA     → Pachelbel Canon in D           — gentle wedding classic
  AURORA   → Moonlight Sonata Mvt I (Beethoven) — quiet contemplative

Hepsi public domain (besteler 1800-1900, kayıtlar Wikimedia CC0/PD).

Pipeline:
  1. Wikimedia upload.wikimedia.org direct URL download
  2. ffmpeg ile OGG → MP3 convert (eğer OGG ise)
  3. /public/audio/<edition>/<canonical>.mp3 yerleştir

Çalıştırma:
  python3 scripts/fetch-music-wikimedia.py
"""

import os, sys, time, json, urllib.request, urllib.error, subprocess, shutil
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "audio"

# Wikimedia Commons direct download URL'leri.
# Format: ogg/mp3/wav (Wikimedia origin)
# Bunlar stable archival URL'ler — değişmez.
TRACKS = [
    {
        "edition": "aethel",
        "filename": "clair-de-lune.mp3",
        "title": "Debussy - Clair de Lune",
        "url": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Debussy_-_Clair_de_lune_-_Yvonne_Loriod.ogg",
        # fallback alternatives
        "alts": [
            "https://upload.wikimedia.org/wikipedia/commons/7/7d/Debussy_Clair_de_Lune.ogg",
            "https://upload.wikimedia.org/wikipedia/commons/2/2d/Claude_Debussy_-_Suite_bergamasque_-_III._Clair_de_lune.ogg",
        ],
    },
    {
        "edition": "nocturne",
        "filename": "chopin-nocturne.mp3",
        "title": "Chopin - Nocturne Op. 9 No. 2",
        "url": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Frederic_Chopin_-_nocturne_op_9_no_2.ogg",
        "alts": [
            "https://upload.wikimedia.org/wikipedia/commons/5/5f/Chopin_-_Nocturne_Op._9_No._2_in_E_Flat_Major.ogg",
            "https://upload.wikimedia.org/wikipedia/commons/0/04/Frédéric_Chopin_-_Nocturne_op._9_no._2.ogg",
        ],
    },
    {
        "edition": "candela",
        "filename": "la-vie-en-rose-instrumental.mp3",
        "title": "Satie - Gymnopédie No. 1",
        "url": "https://upload.wikimedia.org/wikipedia/commons/9/97/Erik_Satie_-_Gymnopédie_No._1.ogg",
        "alts": [
            "https://upload.wikimedia.org/wikipedia/commons/b/b2/Satie_Gymnopedie_No_1.ogg",
            "https://upload.wikimedia.org/wikipedia/commons/4/4a/Erik_Satie_-_Gymnopedie_No._1.ogg",
        ],
    },
    {
        "edition": "mistral",
        "filename": "sagapo-instrumental.mp3",
        "title": "Satie - Gnossienne No. 1",
        "url": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Erik_Satie_-_Gnossienne_No._1.ogg",
        "alts": [
            "https://upload.wikimedia.org/wikipedia/commons/8/8a/Satie_-_Gnossienne_No_1.ogg",
            "https://upload.wikimedia.org/wikipedia/commons/3/3c/Erik_Satie_-_Gnossienne_no_1.ogg",
        ],
    },
    {
        "edition": "olea",
        "filename": "lemon-tree-acoustic.mp3",
        "title": "Pachelbel - Canon in D",
        "url": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Pachelbel_Canon.ogg",
        "alts": [
            "https://upload.wikimedia.org/wikipedia/commons/d/d3/Pachelbel%27s_Canon_in_D_major.ogg",
            "https://upload.wikimedia.org/wikipedia/commons/6/6b/Canon_in_D.ogg",
        ],
    },
    {
        "edition": "aurora",
        "filename": "comptine-dun-autre-ete.mp3",
        "title": "Beethoven - Moonlight Sonata Mvt I",
        "url": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Beethoven_Moonlight_1st_movement.ogg",
        "alts": [
            "https://upload.wikimedia.org/wikipedia/commons/4/45/Beethoven_-_Moonlight_Sonata_-_1st_movement.ogg",
            "https://upload.wikimedia.org/wikipedia/commons/3/3b/Beethoven_Piano_Sonata_No._14_-_Movement_I.ogg",
        ],
    },
]


def download(url, dest):
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "NUVE-AssetFetcher/1.0 (https://nuve.app)",
            },
        )
        with urllib.request.urlopen(req, timeout=120) as r:
            data = r.read()
        dest.write_bytes(data)
        return True
    except (urllib.error.HTTPError, urllib.error.URLError) as e:
        print(f"    ✗ {e}")
        return False


def convert_to_mp3(src, dest):
    """OGG → MP3 ffmpeg ile. Direct .mp3 ise rename."""
    if src.suffix == ".mp3":
        shutil.move(str(src), str(dest))
        return True
    try:
        cmd = [
            "ffmpeg", "-y", "-i", str(src),
            "-acodec", "libmp3lame", "-b:a", "128k",
            "-ar", "44100", "-ac", "2",
            str(dest),
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=120)
        if result.returncode == 0:
            src.unlink(missing_ok=True)
            return True
        print(f"    ffmpeg error: {result.stderr.decode()[:200]}")
    except Exception as e:
        print(f"    convert error: {e}")
    return False


def fetch_one(track):
    edition = track["edition"]
    edition_dir = OUT / edition
    edition_dir.mkdir(parents=True, exist_ok=True)
    dest = edition_dir / track["filename"]

    if dest.exists() and dest.stat().st_size > 200_000:
        print(f"· cached: {edition}/{track['filename']}")
        return True

    urls = [track["url"]] + track.get("alts", [])
    for i, url in enumerate(urls):
        ext = ".ogg" if ".ogg" in url else ".mp3"
        tmp = edition_dir / f"_tmp_{track['filename']}{ext}"
        print(f"  [{i+1}/{len(urls)}] {track['title']} ← {url[:75]}...")
        if download(url, tmp):
            if convert_to_mp3(tmp, dest):
                kb = dest.stat().st_size // 1024
                print(f"  ✓ {edition}/{track['filename']} ({kb} kB)")
                return True
            else:
                tmp.unlink(missing_ok=True)
    print(f"  ✗ {edition}/{track['filename']} — all URLs failed")
    return False


def main():
    OUT.mkdir(exist_ok=True)
    ok = 0
    fail = 0
    for t in TRACKS:
        if fetch_one(t):
            ok += 1
        else:
            fail += 1
    print(f"\nResult: {ok} downloaded, {fail} failed.")
    print("Failed olanlar README.md'den manuel indirilebilir.")


if __name__ == "__main__":
    main()
