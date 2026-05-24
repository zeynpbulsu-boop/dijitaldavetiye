"""
FAZ 2 — Public Domain klasik müzik download v2 (Wikimedia Commons + ffmpeg).

Gerçek Wikimedia dosya isimleri (search ile bulundu):
  AETHEL   → Clair de lune (Claude Debussy) Suite bergamasque.ogg
  NOCTURNE → Nocturne in E flat major, Op. 9 no. 2.mp3
  CANDÉLA  → Satie Gymnopèdie n.1 DariaBaiocchi.wav
  MISTRAL  → Satie - Gnossienne 1.ogg
  OLEA     → Pachelbel's Canon.ogg
  AURORA   → Beethoven Moonlight sonata sequenced.ogg

Pipeline:
  1. Wikimedia API → imageinfo → direct file URL
  2. Download (ogg/wav/mp3/flac)
  3. ffmpeg → MP3 128kbps (browser compat + ~3-5MB per track)
  4. Place public/audio/<edition>/<canonical>.mp3
"""

import urllib.request, urllib.parse, urllib.error, json, subprocess, shutil
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "audio"

TRACKS = [
    {
        "edition": "aethel",
        "filename": "clair-de-lune.mp3",
        "title": "Debussy - Clair de Lune",
        "wikifile": "Clair de lune (Claude Debussy) Suite bergamasque.ogg",
    },
    {
        "edition": "nocturne",
        "filename": "chopin-nocturne.mp3",
        "title": "Chopin - Nocturne Op. 9 No. 2",
        "wikifile": "Nocturne in E flat major, Op. 9 no. 2.mp3",
    },
    {
        "edition": "candela",
        "filename": "la-vie-en-rose-instrumental.mp3",
        "title": "Satie - Gymnopédie No. 1",
        "wikifile": "Satie Gymnopèdie n.1 DariaBaiocchi.wav",
    },
    {
        "edition": "mistral",
        "filename": "sagapo-instrumental.mp3",
        "title": "Satie - Gnossienne No. 1",
        "wikifile": "Satie - Gnossienne 1.ogg",
    },
    {
        "edition": "olea",
        "filename": "lemon-tree-acoustic.mp3",
        "title": "Pachelbel - Canon in D",
        "wikifile": "Pachelbel's Canon.ogg",
    },
    {
        "edition": "aurora",
        "filename": "comptine-dun-autre-ete.mp3",
        "title": "Beethoven - Moonlight Sonata",
        "wikifile": "Beethoven Moonlight sonata sequenced.ogg",
    },
]


def get_direct_url(wikifile: str) -> str | None:
    """Wikimedia API ile bir File:NAME'in direct download URL'ini al."""
    api = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "prop": "imageinfo",
        "iiprop": "url",
        "format": "json",
        "titles": f"File:{wikifile}",
    }
    url = f"{api}?{urllib.parse.urlencode(params)}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NUVE-Fetcher/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read())
        pages = data.get("query", {}).get("pages", {})
        for _, page in pages.items():
            if "imageinfo" in page:
                return page["imageinfo"][0]["url"]
    except Exception as e:
        print(f"    API error: {e}")
    return None


def download(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(
            url, headers={"User-Agent": "NUVE-Fetcher/1.0 (https://nuve.app)"}
        )
        with urllib.request.urlopen(req, timeout=180) as r:
            dest.write_bytes(r.read())
        return True
    except Exception as e:
        print(f"    download error: {e}")
        return False


def to_mp3(src: Path, dest: Path) -> bool:
    """ffmpeg convert to MP3 128kbps."""
    try:
        cmd = [
            "ffmpeg", "-y", "-i", str(src),
            "-acodec", "libmp3lame", "-b:a", "128k",
            "-ar", "44100", "-ac", "2",
            "-loglevel", "error",
            str(dest),
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=180)
        if result.returncode == 0:
            return True
        print(f"    ffmpeg: {result.stderr.decode()[:200]}")
    except Exception as e:
        print(f"    convert: {e}")
    return False


def fetch(track):
    edition_dir = OUT / track["edition"]
    edition_dir.mkdir(parents=True, exist_ok=True)
    dest = edition_dir / track["filename"]
    if dest.exists() and dest.stat().st_size > 200_000:
        print(f"· cached: {track['edition']}/{track['filename']}")
        return True

    print(f"\n  {track['title']}")
    url = get_direct_url(track["wikifile"])
    if not url:
        print(f"  ✗ no URL: {track['wikifile']}")
        return False
    print(f"  ← {url}")
    ext = "." + url.rsplit(".", 1)[-1].lower()
    tmp = edition_dir / f"_tmp_{track['filename']}{ext}"
    if not download(url, tmp):
        return False
    print(f"    ✓ {tmp.stat().st_size // 1024} kB raw, converting…")
    if not to_mp3(tmp, dest):
        tmp.unlink(missing_ok=True)
        return False
    tmp.unlink(missing_ok=True)
    kb = dest.stat().st_size // 1024
    print(f"  ✓ {track['edition']}/{track['filename']} ({kb} kB)")
    return True


def main():
    OUT.mkdir(exist_ok=True)
    ok, fail = 0, 0
    for t in TRACKS:
        try:
            if fetch(t):
                ok += 1
            else:
                fail += 1
        except Exception as e:
            print(f"  ✗ {t['edition']}: {e}")
            fail += 1
    print(f"\nResult: {ok} downloaded, {fail} failed.")


if __name__ == "__main__":
    main()
