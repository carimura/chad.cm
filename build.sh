#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

java -jar tools/arc.jar
node tools/generate-bbs-posts.mjs
