#!/bin/bash
# Generate the review UI from explorations data
# Usage: ./generate-review.sh <explorations.json> <output.html> [brief-title]
#
# explorations.json format:
# [{ "id": 1, "name": "...", "concept": "...", "axes": [...], "preview": "path", "previewType": "iframe"|"image" }]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATE="$SKILL_DIR/assets/review-template.html"

if [ $# -lt 2 ]; then
  echo "Usage: $0 <explorations.json> <output.html> [brief-title]"
  exit 1
fi

EXPLORATIONS_JSON="$1"
OUTPUT="$2"
BRIEF="${3:-Untitled Brief}"

if [ ! -f "$TEMPLATE" ]; then
  echo "Error: Template not found at $TEMPLATE"
  exit 1
fi

if [ ! -f "$EXPLORATIONS_JSON" ]; then
  echo "Error: Explorations JSON not found at $EXPLORATIONS_JSON"
  exit 1
fi

EXPLORATIONS=$(cat "$EXPLORATIONS_JSON")

# Use node for reliable JSON injection (avoids sed issues with special chars)
node -e "
  const fs = require('fs');
  let html = fs.readFileSync('$TEMPLATE', 'utf8');
  const data = fs.readFileSync('$EXPLORATIONS_JSON', 'utf8');
  html = html.replace('__BRIEF_PLACEHOLDER__', $(printf '%s' "$BRIEF" | node -e "process.stdout.write(JSON.stringify(require('fs').readFileSync('/dev/stdin','utf8')))"));
  html = html.replace('__EXPLORATIONS_PLACEHOLDER__', data.trim());
  fs.writeFileSync('$OUTPUT', html);
" 2>/dev/null || {
  # Fallback: simple sed replacement
  sed \
    -e "s|__BRIEF_PLACEHOLDER__|${BRIEF}|g" \
    "$TEMPLATE" | sed "s|__EXPLORATIONS_PLACEHOLDER__|$(cat "$EXPLORATIONS_JSON")|g" > "$OUTPUT"
}

echo "Review UI generated: $OUTPUT"
