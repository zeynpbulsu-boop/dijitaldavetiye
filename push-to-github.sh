#!/usr/bin/env bash
# NUVE — push to github.com/zeynpbulsu-boop/dijitaldavetiye
# Run this from inside the nuve-nextjs/ directory on your Mac.

set -e

REPO_URL="https://github.com/zeynpbulsu-boop/dijitaldavetiye.git"

cd "$(dirname "$0")"

if [ ! -d .git ]; then
  echo "→ git init"
  git init
  git branch -M main
fi

# Make sure remote points at the dijitaldavetiye repo
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

echo "→ git add ."
git add .

echo "→ git commit"
git commit -m "NUVE — initial production push" || echo "(nothing to commit)"

echo "→ git push -u origin main"
git push -u origin main --force

echo
echo "✓ Pushed to $REPO_URL"
echo "  Now go to Coolify → Deployments → Deploy."
