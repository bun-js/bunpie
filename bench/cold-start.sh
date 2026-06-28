#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

mise exec -- hyperfine \
  -N \
  --warmup 3 \
  --runs 10 \
  --style full \
  'ht --version' \
  'http --version' \
  'xh --version' \
  'bin/bunpie --version'
