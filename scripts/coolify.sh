#!/usr/bin/env bash
# coolify.sh — NUVE deploy + env yönetimi, tarayıcı olmadan, Coolify API üzerinden.
#
# Kurulum: .coolify.env dosyası repo kökünde olmalı (gitignore'lu). İçinde:
#   COOLIFY_API_TOKEN, COOLIFY_BASE_URL, COOLIFY_APP_UUID
#
# NOT: Coolify sertifikası macOS LibreSSL ile uyumsuz → curl -k (insecure) şart.
#
# Kullanım:
#   bash scripts/coolify.sh status              # uygulama durumu
#   bash scripts/coolify.sh env-list            # env anahtarları (değerler API'de maskeli)
#   bash scripts/coolify.sh env-set KEY VALUE   # env ekle/güncelle (NEXT_PUBLIC_* otomatik build-time)
#   bash scripts/coolify.sh deploy              # deploy tetikle + bitene kadar izle
#   bash scripts/coolify.sh deploy force        # cache'siz yeniden kur
#   bash scripts/coolify.sh watch <dep_uuid>    # belirli bir deployment'ı izle
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.coolify.env"
[ -f "$ENV_FILE" ] || { echo "✗ $ENV_FILE yok. Token dosyasını oluştur."; exit 1; }
# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a

: "${COOLIFY_API_TOKEN:?.coolify.env içinde COOLIFY_API_TOKEN eksik}"
: "${COOLIFY_BASE_URL:?.coolify.env içinde COOLIFY_BASE_URL eksik}"
: "${COOLIFY_APP_UUID:?.coolify.env içinde COOLIFY_APP_UUID eksik}"

API="${COOLIFY_BASE_URL%/}/api/v1"
AUTH=(-H "Authorization: Bearer $COOLIFY_API_TOKEN")
CURL=(curl -sk -m 40 "${AUTH[@]}")

json() { python3 -c "import sys,json; d=json.load(sys.stdin); print($1)" 2>/dev/null; }

cmd_status() {
  echo "→ Uygulama durumu:"
  "${CURL[@]}" "$API/applications/$COOLIFY_APP_UUID" | python3 -c '
import sys,json
d=json.load(sys.stdin)
for k in ["name","status","fqdn","git_repository","git_branch","build_pack","last_online_at"]:
    print(f"  {k:16}: {d.get(k)}")'
  echo "→ Canlı HTTP kontrolü:"
  local url; url=$("${CURL[@]}" "$API/applications/$COOLIFY_APP_UUID" | json "d.get('fqdn','')")
  [ -n "$url" ] && curl -sk -m 20 -o /dev/null -w "  $url → HTTP %{http_code}\n" "$url" || echo "  (fqdn yok)"
}

cmd_env_list() {
  echo "→ Env değişkenleri (değerler API tarafından maskeli):"
  "${CURL[@]}" "$API/applications/$COOLIFY_APP_UUID/envs" | python3 -c '
import sys,json
for e in json.load(sys.stdin):
    bt="build+run" if e.get("is_buildtime") else "runtime"
    key=e.get("key","")
    print(f"  {key:32} [{bt}]")'
}

cmd_env_set() {
  local key="$1" val="$2"
  [ -n "$key" ] || { echo "Kullanım: env-set KEY VALUE"; exit 1; }
  # NEXT_PUBLIC_* değişkenleri client bundle'a build sırasında gömülür → build-time şart.
  local bt=false
  [[ "$key" == NEXT_PUBLIC_* ]] && bt=true
  local body
  body=$(python3 -c "import json,sys; print(json.dumps({'key':sys.argv[1],'value':sys.argv[2],'is_preview':False,'is_build_time':$([ $bt = true ] && echo True || echo False),'is_literal':False}))" "$key" "$val")
  echo "→ '$key' güncelleniyor (build-time=$bt) ..."
  # Önce PATCH (güncelle); yoksa POST (oluştur).
  local code
  code=$(curl -sk -m 30 "${AUTH[@]}" -X PATCH -H "Content-Type: application/json" \
    -d "$body" -o /tmp/coolify-env.out -w "%{http_code}" "$API/applications/$COOLIFY_APP_UUID/envs")
  if [ "$code" -ge 400 ]; then
    code=$(curl -sk -m 30 "${AUTH[@]}" -X POST -H "Content-Type: application/json" \
      -d "$body" -o /tmp/coolify-env.out -w "%{http_code}" "$API/applications/$COOLIFY_APP_UUID/envs")
  fi
  echo "  HTTP $code — $(cat /tmp/coolify-env.out | head -c 200)"
}

cmd_watch() {
  local dep="$1"
  [ -n "$dep" ] || { echo "Kullanım: watch <deployment_uuid>"; exit 1; }
  echo "→ Deployment $dep izleniyor..."
  local i=0
  while [ $i -lt 120 ]; do
    local st; st=$("${CURL[@]}" "$API/deployments/$dep" | json "d.get('status','?')")
    printf "\r  [%3ds] durum: %-14s" "$((i*5))" "$st"
    case "$st" in
      finished) echo ""; echo "  ✓ Deploy bitti."; return 0 ;;
      failed|error|cancelled) echo ""; echo "  ✗ Deploy başarısız ($st). Loglar için Coolify panel."; return 1 ;;
    esac
    sleep 5; i=$((i+1))
  done
  echo ""; echo "  ⚠ 10 dk doldu, hâlâ bitmedi. Panelden takip et."
}

cmd_deploy() {
  local force=false
  [ "${1:-}" = "force" ] && force=true
  echo "→ Deploy tetikleniyor (force=$force) ..."
  local resp dep
  resp=$("${CURL[@]}" "$API/deploy?uuid=$COOLIFY_APP_UUID&force=$force")
  echo "  yanıt: $(echo "$resp" | head -c 240)"
  dep=$(echo "$resp" | json "d['deployments'][0]['deployment_uuid']")
  [ -n "${dep:-}" ] && cmd_watch "$dep" || echo "  (deployment_uuid alınamadı; panelden kontrol et)"
}

case "${1:-status}" in
  status)   cmd_status ;;
  env-list) cmd_env_list ;;
  env-set)  cmd_env_set "${2:-}" "${3:-}" ;;
  deploy)   cmd_deploy "${2:-}" ;;
  watch)    cmd_watch "${2:-}" ;;
  *) echo "Komutlar: status | env-list | env-set KEY VALUE | deploy [force] | watch <uuid>"; exit 1 ;;
esac
