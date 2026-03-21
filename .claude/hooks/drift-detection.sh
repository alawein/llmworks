#!/usr/bin/env bash
set -e

# Drift detection (I-2)
# Compare CLAUDE.md, AGENTS.md, GUIDELINES.md against tier-1 template
# Ignore sections marked <!-- CUSTOM OVERRIDE: [section] -->

template_source=${1:-../../../_pkos}

for file in CLAUDE.md AGENTS.md GUIDELINES.md; do
  if [ ! -f "$file" ]; then continue; fi

  # Extract non-custom sections and compare
  grep -v "<!-- CUSTOM OVERRIDE" "$file" > /tmp/"$file".filtered 2>/dev/null || true
  grep -v "<!-- CUSTOM OVERRIDE" "$template_source/$file" > /tmp/"$file".template.filtered 2>/dev/null || true

  if ! diff -q /tmp/"$file".filtered /tmp/"$file".template.filtered > /dev/null 2>&1; then
    echo "DRIFT DETECTED in $file (non-custom sections differ from template)"
    echo "  Run: npx morphism sync-template --dry-run"
  fi
done
