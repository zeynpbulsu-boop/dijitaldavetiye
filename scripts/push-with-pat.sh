#!/usr/bin/env bash
# push-with-pat.sh — Zeynep PAT ile push (macOS keychain bypass).
#
# Sorun: macOS Keychain'de Bulsulog-art GitHub credential'ı saklı.
# Normal `git push` keychain'den Bulsulog-art'ı çekip URL'deki PAT'ı
# override eder → 403 Permission denied.
#
# Çözüm: `-c credential.helper=` ile keychain helper'ı DEVRE DIŞI bırak,
# URL'deki gömülü PAT zorla kullanılsın.
#
# Kullanım:
#   bash scripts/push-with-pat.sh ghp_YOUR_TOKEN

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "❌ Kullanım: bash scripts/push-with-pat.sh <PAT_TOKEN>"
  exit 1
fi

PAT="$1"
USER="zeynpbulsu-boop"
REPO="dijitaldavetiye"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
URL_WITH_PAT="https://${USER}:${PAT}@github.com/${USER}/${REPO}.git"
URL_CLEAN="https://github.com/${USER}/${REPO}.git"

echo "→ Push hazırlığı: branch=$BRANCH, user=$USER, repo=$REPO"
echo "→ Keychain bypass aktif (credential.helper= empty)"

# Direct push to URL with PAT, credential helper devre dışı.
# Keychain'e dokunmaz, başka commands etkilenmez.
git -c credential.helper= \
    -c credential.useHttpPath=true \
    push -u "$URL_WITH_PAT" "$BRANCH:$BRANCH" 2>&1 | tail -20

PUSH_STATUS=${PIPESTATUS[0]}

# Remote URL temizle (token'sız) — sızıntı yok
git remote set-url origin "$URL_CLEAN" 2>/dev/null || true

if [ $PUSH_STATUS -eq 0 ]; then
  echo ""
  echo "✅ Push BAŞARILI."
  echo ""
  echo "Sırada:"
  echo "1. GitHub Actions: https://github.com/${USER}/${REPO}/actions"
  echo "   Coolify Auto-Deploy workflow tetiklenmiş olmalı"
  echo ""
  echo "2. 3 GitHub secret ekle (Coolify deploy için):"
  echo "   https://github.com/${USER}/${REPO}/settings/secrets/actions"
  echo "   - COOLIFY_API_TOKEN (Coolify panel → Keys & Tokens → Generate)"
  echo "   - COOLIFY_APP_UUID: b9ba0lj82z1m88uwltdc1w85"
  echo "   - COOLIFY_BASE_URL: https://coolify.bulsulabs.xyz"
  echo ""
  echo "3. Live (~3dk):"
  echo "   http://b9ba0lj82z1m88uwltdc1w85.72.62.39.172.sslip.io"
else
  echo ""
  echo "❌ Push BAŞARISIZ (exit $PUSH_STATUS)"
  echo "Token geçerli mi: https://github.com/settings/tokens"
  exit $PUSH_STATUS
fi
