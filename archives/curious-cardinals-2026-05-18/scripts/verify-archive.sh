#!/usr/bin/env bash
set -euo pipefail

ARCHIVE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ARCHIVE_DIR/manifest.json"

count_html() {
  find "$1" -type f \( -name '*.html' -o -name '*.htm' \) 2>/dev/null | wc -l | tr -d ' '
}

count_all() {
  find "$1" -type f 2>/dev/null | wc -l | tr -d ' '
}

count_zero_byte() {
  find "$1" -type f -empty 2>/dev/null | wc -l | tr -d ' '
}

url_count() {
  if [ -f "$1" ]; then wc -l < "$1" | tr -d ' '; else echo 0; fi
}

MKT_URLS=$(url_count "$ARCHIVE_DIR/scripts/urls-marketing.txt")
BLOG_URLS=$(url_count "$ARCHIVE_DIR/scripts/urls-blog.txt")
APP_URLS=$(url_count "$ARCHIVE_DIR/scripts/urls-app.txt")

MKT_HTML=$(count_html "$ARCHIVE_DIR/marketing")
BLOG_HTML=$(count_html "$ARCHIVE_DIR/blog")
APP_HTML=$(count_html "$ARCHIVE_DIR/app-mentors")

MKT_ALL=$(count_all "$ARCHIVE_DIR/marketing")
BLOG_ALL=$(count_all "$ARCHIVE_DIR/blog")
APP_ALL=$(count_all "$ARCHIVE_DIR/app-mentors")

MKT_ZERO=$(count_zero_byte "$ARCHIVE_DIR/marketing")
BLOG_ZERO=$(count_zero_byte "$ARCHIVE_DIR/blog")
APP_ZERO=$(count_zero_byte "$ARCHIVE_DIR/app-mentors")

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$MANIFEST" <<EOJSON
{
  "archived_at": "$TIMESTAMP",
  "tool": "GNU wget 1.25",
  "sections": {
    "marketing": {
      "sitemap_urls": $MKT_URLS,
      "html_files": $MKT_HTML,
      "total_files": $MKT_ALL,
      "zero_byte_files": $MKT_ZERO
    },
    "blog": {
      "sitemap_urls": $BLOG_URLS,
      "html_files": $BLOG_HTML,
      "total_files": $BLOG_ALL,
      "zero_byte_files": $BLOG_ZERO
    },
    "app_mentors": {
      "sitemap_urls": $APP_URLS,
      "html_files": $APP_HTML,
      "total_files": $APP_ALL,
      "zero_byte_files": $APP_ZERO
    }
  }
}
EOJSON

echo "=== Archive Verification ==="
echo ""
echo "Marketing:   $MKT_HTML HTML / $MKT_ALL total files (expected ~$MKT_URLS pages, $MKT_ZERO zero-byte)"
echo "Blog:        $BLOG_HTML HTML / $BLOG_ALL total files (expected ~$BLOG_URLS pages, $BLOG_ZERO zero-byte)"
echo "App Mentors: $APP_HTML HTML / $APP_ALL total files (expected ~$APP_URLS pages, $APP_ZERO zero-byte)"
echo ""
echo "Manifest written to $MANIFEST"
