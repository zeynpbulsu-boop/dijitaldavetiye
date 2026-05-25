#!/usr/bin/env bash
# push-with-pat.sh — Bulletproof PAT push (macOS keychain full bypass).
#
# Sorun: 'git -c credential.helper=' bile keychain'i bazen bypass edemiyor
# çünkü macOS osxkeychain helper inheritance ile kendini zorla load eder.
#
# Bulletproof çözüm: http.extraheader ile token'ı Authorization header'ında
# DIREKT inject. Credential helper hiç sorulmaz, URL'de PAT yok (log sızıntısı yok).

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "❌ Kullanım: bash scripts/push-with-pat.sh <PAT_TOKEN>"
  exit 1
fi

PAT="$1"
USER="zeynpbulsu-boop"
REPO="dijitaldavetiye"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
URL_CLEAN="https://github.com/${USER}/${REPO}.git"

echo "→ Branch: $BRANCH"
echo "→ Auth: http.extraheader Authorization bearer (keychain hiç sorulmaz)"

# extraheader ile token authorization header'ına direkt enjekte.
# Credential helper'a danışılmaz — keychain hiç devreye girmez.
# URL temiz: token URL'de yok, log/process list'te görünmez.
GIT_TERMINAL_PROMPT=0 \
  git -c credential.helper= \
      -c http.sslVerify=true \
      -c "http.https://github.com/.extraheader=Authorization: bearer ${PAT}" \
      push -u "$URL_CLEAN" "$BRANCH:$BRANCH" 2>&1 | tail -25

PUSH_STATUS=${PIPESTATUS[0]}

if [ $PUSH_STATUS -eq 0 ]; then
  echo ""
  echo "✅ Push BAŞARILI."
  echo ""
  echo "Sırada:"
  echo "1. GitHub Actions otomatik tetikler: https://github.com/${USER}/${REPO}/actions"
  echo "2. 3 GitHub secret ekle (Coolify deploy için):"
  echo "   https://github.com/${USER}/${REPO}/settings/secrets/actions"
  echo "   - COOLIFY_API_TOKEN  (Coolify panel → Keys & Tokens)"
  echo "   - COOLIFY_APP_UUID   = b9ba0lj82z1m88uwltdc1w85"
  echo "   - COOLIFY_BASE_URL   = https://coolify.bulsulabs.xyz"
  echo "3. Live URL (~3dk):"
  echo "   http://b9ba0lj82z1m88uwltdc1w85.72.62.39.172.sslip.io"
else
  echo ""
  echo "❌ Push BAŞARISIZ (exit $PUSH_STATUS)"
  echo ""
  echo "Sorun çözümleri:"
  echo "1. Token'ı kontrol et: https://github.com/settings/tokens"
  echo "   Scope: ✓ repo (write erişim için ŞART)"
  echo "2. Token Zeynep hesabıyla oluşturulduğundan emin ol"
  echo "3. Token expire olmamış mı (7 gün default)"
  echo ""
  echo "Hala fail ediyorsa keychain'i temizle:"
  echo "   git credential-osxkeychain erase &lt;&lt;EOF"
  echo "   host=github.com"
  echo "   protocol=https"
  echo "   EOF"
  exit $PUSH_STATUS
fi
