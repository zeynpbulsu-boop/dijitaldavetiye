#!/usr/bin/env bash
# push-with-pat.sh — Zeynep PAT ile branch'i push et + Coolify auto-deploy.
#
# Kullanım:
#   1. Browser: https://github.com/settings/tokens/new
#      Zeynep hesabıyla, Note: "nuve push", Expiration: 7 days,
#      Scopes: ✓ repo + ✓ workflow → Generate token
#   2. Token'ı kopyala (ghp_... ya da github_pat_...)
#   3. Bu script'i çalıştır:
#      bash scripts/push-with-pat.sh ghp_YOUR_TOKEN_HERE
#
# Script:
#   - PAT'ı remote URL'ye geçici olarak gömüp push eder
#   - Push sonrası URL'i temizler (token sızıntısı yok)
#   - GitHub Actions Coolify auto-deploy workflow tetiklenir (secret'lar set
#     edildiyse otomatik live deploy ~3dk içinde olur)

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "❌ Kullanım: bash scripts/push-with-pat.sh <PAT_TOKEN>"
  echo ""
  echo "PAT al: https://github.com/settings/tokens/new"
  echo "(Zeynep hesabı, repo + workflow scope, 7 days)"
  exit 1
fi

PAT="$1"
USER="zeynpbulsu-boop"
REPO="dijitaldavetiye"
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "→ Push hazırlığı: branch=$BRANCH, user=$USER, repo=$REPO"

# Geçici remote URL (PAT gömülü) — push için
git remote set-url origin "https://${USER}:${PAT}@github.com/${USER}/${REPO}.git"

# Push
echo "→ git push -u origin $BRANCH..."
git push -u origin "$BRANCH"
PUSH_STATUS=$?

# Token URL'den temizle (güvenlik)
git remote set-url origin "https://github.com/${USER}/${REPO}.git"
echo "→ Remote URL token'sız geri çevrildi (güvenli)."

if [ $PUSH_STATUS -eq 0 ]; then
  echo ""
  echo "✅ Push BAŞARILI."
  echo ""
  echo "Şimdi:"
  echo "1. GitHub Actions: https://github.com/${USER}/${REPO}/actions"
  echo "   → 'Coolify Auto-Deploy' workflow tetiklenmiş olmalı"
  echo "   → 3 secret eklenmediyse FAIL olur (validate step)"
  echo ""
  echo "2. 3 GitHub secret ekle (henüz değilse):"
  echo "   https://github.com/${USER}/${REPO}/settings/secrets/actions"
  echo "   - COOLIFY_API_TOKEN: Coolify panel → Settings → Keys & Tokens → Generate"
  echo "   - COOLIFY_APP_UUID: b9ba0lj82z1m88uwltdc1w85"
  echo "   - COOLIFY_BASE_URL: https://coolify.bulsulabs.xyz"
  echo ""
  echo "3. Live URL (deploy ~3dk sonra):"
  echo "   http://b9ba0lj82z1m88uwltdc1w85.72.62.39.172.sslip.io"
else
  echo "❌ Push BAŞARISIZ (exit $PUSH_STATUS)"
  echo "   PAT geçerli mi kontrol et: https://github.com/settings/tokens"
  exit $PUSH_STATUS
fi
