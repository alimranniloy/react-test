#!/bin/bash

set -euo pipefail

# Author : Bponi Founder
# Copyright (c) bponi.com
# Script follows here:

original_file="./dist/index.html"
replacement_file="./dist/site-app.html"
destination_dir="./../../../backend/templates/site"
release_dir="./dist/release/site-app"

mkdir -p "$release_dir/assets"

cp "$original_file" "$replacement_file"
cp "$replacement_file" "$release_dir/site-app.html"
cp -R ./dist/assets/. "$release_dir/assets/"

if [ -d "$destination_dir" ]; then
    cp "$replacement_file" "$destination_dir/site-app.html"
    echo "[Phase 1] Copied site-app.html into backend template directory"
else
    echo "[Phase 1] Backend template directory not found, skipped HTML copy"
fi

if command -v s3cmd >/dev/null 2>&1; then
    echo "[Phase 2] Syncing assets to DigitalOcean Spaces"
    s3cmd sync ./dist/assets/ s3://bponi/asset/site/site-app/assets/ --acl-public -M --guess-mime-type --no-mime-magic
else
    echo "[Phase 2] s3cmd not found, skipped CDN upload"
fi

echo "[Release] Prepared deploy-ready package at $release_dir"
