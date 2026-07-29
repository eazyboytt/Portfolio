#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.." || exit 1
git add -A
git diff --cached --quiet && echo 'Nothing to commit.' && exit 0
git commit -m "chore: update portfolio"
git push
