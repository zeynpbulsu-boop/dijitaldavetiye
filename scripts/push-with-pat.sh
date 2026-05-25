#!/usr/bin/env bash
# push-with-pat.sh — Bulletproof PAT push (GIT_ASKPASS yöntemi).
#
# Çalışma mantığı:
# Geçici askpass scripti yaratıp GIT_ASKPASS env'ine bağlarız.
# Git ne zaman credential isterse askpass'tan PAT alır.
# Keychain hiç sorulmaz. GIT_TERMINAL_PROMPT=0 ile prompt da kapalı.
# Çıkışta askpass dosyası silinir (token disk'te kalmaz).

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Kullanim: bash scripts/push-with-pat.sh <PAT_TOKEN>"
  exit 1
fi

PAT="$1"
GH_USER="zeynpbulsu-boop"
REPO="dijitaldavetiye"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
URL_CLEAN="https://github.com/${GH_USER}/${REPO}.git"

# Gecici askpass — su anki PID ile unique, /tmp altinda.
ASKPASS="$(mktemp -t nuve-askpass.XXXXXX)"
chmod 700 "$ASKPASS"
cat > "$ASKPASS" << EOF
#!/bin/sh
case "\$1" in
  Username*) echo "${GH_USER}" ;;
  Password*) echo "${PAT}" ;;
esac
EOF
chmod +x "$ASKPASS"

# Trap: script biterken askpass'i sil (token disk'te kalmasin).
trap 'rm -f "$ASKPASS"' EXIT INT TERM

echo "-> Branch: $BRANCH"
echo "-> Auth: GIT_ASKPASS (keychain bypass, PAT bellekte)"

# credential.helper'i bos string ile NULL'a setleyip, GIT_ASKPASS'i kullaniriz.
# Boyle keychain helper inheritance da iptal olur.
GIT_TERMINAL_PROMPT=0 \
GIT_ASKPASS="$ASKPASS" \
SSH_ASKPASS="$ASKPASS" \
  git -c credential.helper= \
      -c "credential.https://github.com.helper=" \
      push -u "$URL_CLEAN" "$BRANCH:$BRANCH" 2>&1 | tail -25

PUSH_STATUS=${PIPESTATUS[0]}

if [ $PUSH_STATUS -eq 0 ]; then
  echo ""
  echo "Push BASARILI."
  echo ""
  echo "Sirada:"
  echo "1. GitHub Actions otomatik tetikler:"
  echo "   https://github.com/${GH_USER}/${REPO}/actions"
  echo "2. 3 GitHub secret ekle (Coolify deploy icin):"
  echo "   https://github.com/${GH_USER}/${REPO}/settings/secrets/actions"
  echo "   - COOLIFY_API_TOKEN  (Coolify panel -> Keys & Tokens)"
  echo "   - COOLIFY_APP_UUID   = b9ba0lj82z1m88uwltdc1w85"
  echo "   - COOLIFY_BASE_URL   = https://coolify.bulsulabs.xyz"
  echo "3. Live URL (~3dk):"
  echo "   http://b9ba0lj82z1m88uwltdc1w85.72.62.39.172.sslip.io"
else
  echo ""
  echo "Push BASARISIZ (exit $PUSH_STATUS)"
  echo ""
  echo "Yaygin sorunlar:"
  echo "1. Token scope'unda 'repo' VE 'workflow' isaretli olmali."
  echo "2. Token Zeynep hesabiyla olusturulmali (Bulsulog-art ile DEGIL)."
  echo "3. Token expire olmus olabilir."
  exit $PUSH_STATUS
fi
