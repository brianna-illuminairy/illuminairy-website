#!/usr/bin/env bash
set -euo pipefail

ARCHIVE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Fetching marketing sitemap..."
curl -sL "https://curiouscardinals.com/sitemap.xml" \
  | tr '<' '\n' | grep '^loc>' | sed 's/^loc>//' \
  > "$ARCHIVE_DIR/scripts/urls-marketing.txt"
echo "    $(wc -l < "$ARCHIVE_DIR/scripts/urls-marketing.txt") URLs"

echo "==> Fetching blog sitemap..."
curl -sL "https://blog.curiouscardinals.com/sitemap.xml" \
  | tr '<' '\n' | grep '^loc>' | sed 's/^loc>//' \
  > "$ARCHIVE_DIR/scripts/urls-blog.txt"
echo "    $(wc -l < "$ARCHIVE_DIR/scripts/urls-blog.txt") URLs"

echo "==> Fetching app sitemap..."
curl -sL "https://app.curiouscardinals.com/sitemap.xml" \
  | tr '<' '\n' | grep '^loc>' | sed 's/^loc>//' \
  > "$ARCHIVE_DIR/scripts/urls-app.txt"
echo "    $(wc -l < "$ARCHIVE_DIR/scripts/urls-app.txt") URLs"

echo "==> Done. URL lists saved to $ARCHIVE_DIR/scripts/"
