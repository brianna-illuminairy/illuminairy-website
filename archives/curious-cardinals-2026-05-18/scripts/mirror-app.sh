#!/usr/bin/env bash
set -euo pipefail

ARCHIVE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
URL_FILE="$ARCHIVE_DIR/scripts/urls-app.txt"
DEST="$ARCHIVE_DIR/app-mentors"

if [ ! -f "$URL_FILE" ]; then
  echo "ERROR: $URL_FILE not found. Run extract-sitemap-urls.sh first."
  exit 1
fi

echo "==> Mirroring app mentor pages ($(wc -l < "$URL_FILE") URLs)..."
wget \
  --input-file="$URL_FILE" \
  --directory-prefix="$DEST" \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --span-hosts \
  --domains=app.curiouscardinals.com,ucarecdn.com,rsms.me \
  --wait=0.3 \
  --random-wait \
  --tries=3 \
  --timeout=30 \
  --no-parent \
  -e robots=off \
  --no-verbose \
  2>&1 | tee "$ARCHIVE_DIR/scripts/mirror-app.log"

echo "==> App mentors mirror complete."
