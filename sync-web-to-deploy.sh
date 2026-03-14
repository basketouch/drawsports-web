#!/bin/bash
# Sincroniza Web/ → drawsports-web-deploy/Web/
# Úsalo cuando edites en Web/ y quieras preparar el deploy

set -e
cd "$(dirname "$0")"

echo "Sincronizando Web/ → drawsports-web-deploy/Web/..."
rm -rf drawsports-web-deploy/Web/*
cp -R Web/* drawsports-web-deploy/Web/
rm -rf drawsports-web-deploy/Web/.DS_Store 2>/dev/null || true
rm -f drawsports-web-deploy/Web/DEPLOY_VERCEL.md 2>/dev/null || true

echo "✓ Listo. Ahora haz commit en drawsports-web-deploy:"
echo "  cd drawsports-web-deploy && git add -A && git status"
