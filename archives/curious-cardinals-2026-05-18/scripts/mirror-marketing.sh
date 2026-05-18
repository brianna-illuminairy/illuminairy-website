#!/usr/bin/env bash
set -euo pipefail

ARCHIVE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
URL_FILE="$ARCHIVE_DIR/scripts/urls-marketing.txt"
DEST="$ARCHIVE_DIR/marketing"

if [ ! -f "$URL_FILE" ]; then
  echo "ERROR: $URL_FILE not found. Run extract-sitemap-urls.sh first."
  exit 1
fi

echo "==> Mirroring marketing site ($(wc -l < "$URL_FILE") URLs)..."
wget \
  --input-file="$URL_FILE" \
  --directory-prefix="$DEST" \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --span-hosts \
  --domains=curiouscardinals.com,www.curiouscardinals.com,cdn.prod.website-files.com,fonts.googleapis.com,fonts.gstatic.com,ajax.googleapis.com \
  --wait=0.3 \
  --random-wait \
  --tries=3 \
  --timeout=30 \
  --no-parent \
  -e robots=off \
  --no-verbose \
  2>&1 | tee "$ARCHIVE_DIR/scripts/mirror-marketing.log"

echo "==> Marketing mirror complete."
