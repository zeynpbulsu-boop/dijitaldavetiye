#!/usr/bin/env bash
# place-music.sh — Downloads klasöründen public/audio/<edition>/... yerleştirme
#
# Kullanım:
#   1. ~/Downloads/nuve-music/<edition>/<filename>.mp3 olarak yerleştir
#   2. bash scripts/place-music.sh
#
# Script Downloads'taki tüm mp3'leri public/audio'a kopyalar (mevcut audio
# manifest'e (lib/audio/edition-tracks.ts) uygun dosya isimleri bekler).

set -euo pipefail

SOURCE="${HOME}/Downloads/nuve-music"
TARGET="public/audio"

if [ ! -d "$SOURCE" ]; then
  echo "❌ Kaynak klasör yok: $SOURCE"
  echo "   ~/Downloads/nuve-music/<edition>/ klasörlerine MP3'leri koy ve tekrar dene."
  exit 1
fi

if [ ! -d "$TARGET" ]; then
  echo "❌ Hedef klasör yok: $TARGET (proje kök dizininden çalıştır)"
  exit 1
fi

mkdir -p "$TARGET/shared"

copied=0
skipped=0
for src in "$SOURCE"/*/*.mp3 "$SOURCE"/shared/*.mp3; do
  [ -f "$src" ] || continue
  rel="${src#$SOURCE/}"
  dest="$TARGET/$rel"
  destdir=$(dirname "$dest")
  mkdir -p "$destdir"
  if [ -f "$dest" ]; then
    src_size=$(stat -f%z "$src" 2>/dev/null || stat -c%s "$src")
    dst_size=$(stat -f%z "$dest" 2>/dev/null || stat -c%s "$dest")
    if [ "$src_size" = "$dst_size" ]; then
      echo "·  skip (aynı): $rel"
      skipped=$((skipped+1))
      continue
    fi
  fi
  cp "$src" "$dest"
  size=$(du -h "$dest" | cut -f1)
  echo "✓  $rel ($size)"
  copied=$((copied+1))
done

echo ""
echo "Toplam: $copied kopya, $skipped skip"
echo ""
echo "Doğrulama:"
find "$TARGET" -name "*.mp3" -type f | sort | head -20
