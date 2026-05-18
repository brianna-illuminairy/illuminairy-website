#!/usr/bin/env bash
set -euo pipefail

ARCHIVE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
URL_FILE="$ARCHIVE_DIR/scripts/urls-blog.txt"
DEST="$ARCHIVE_DIR/blog"

if [ ! -f "$URL_FILE" ]; then
  echo "ERROR: $URL_FILE not found. Run extract-sitemap-urls.sh first."
  exit 1
fi

echo "==> Mirroring blog ($(wc -l < "$URL_FILE") URLs)..."
wget \
  --input-file="$URL_FILE" \
  --directory-prefix="$DEST" \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --span-hosts \
  --domains=blog.curiouscardinals.com,21557089.fs1.hubspotusercontent-na2.net,7052064.fs1.hubspotusercontent-na1.net \
  --wait=0.3 \
  --random-wait \
  --tries=3 \
  --timeout=30 \
  --no-parent \
  -e robots=off \
  --no-verbose \
  2>&1 | tee "$ARCHIVE_DIR/scripts/mirror-blog.log"

echo "==> Blog mirror complete."
