#!/bin/sh
# Renders the site's generated images with headless Chrome:
#   scripts/demo-samples/*.html -> public/demo/*.webp  (synthetic demo documents)
#                                  public/demo/thumbs/*.webp (400px-wide previews)
#   scripts/og-image.html       -> public/og-image.png (link preview image)
# Needs Google Chrome and cwebp (brew install webp).
set -e

cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
mkdir -p public/demo/thumbs

shot() { # html, width, height, png
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --allow-file-access-from-files --window-size="$2,$3" --virtual-time-budget=5000 \
    --screenshot="$4" "file://$PWD/$1" 2>/dev/null
}

for html in scripts/demo-samples/*.html; do
  name="$(basename "$html" .html)"
  shot "$html" 1000 1294 "$TMP/$name.png"
  cwebp -quiet -q 82 "$TMP/$name.png" -o "public/demo/$name.webp"
  cwebp -quiet -q 80 -resize 400 0 "$TMP/$name.png" -o "public/demo/thumbs/$name.webp"
  echo "public/demo/$name.webp"
done

shot scripts/og-image.html 1200 630 public/og-image.png
echo "public/og-image.png"

rm -rf "$TMP"
