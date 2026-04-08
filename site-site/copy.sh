#!/bin/bash

# Author : Bponi Founder
# Copyright (c) bponi.com
# Script follows here:

# Specify the paths and filenames
current_dir="$(pwd)/dist/assets"
original_file="./dist/index.html"
replacement_files=(
    "site-site.html"
)

destination_dir="./../../../backend/templates/site"
# Rename the original file and move the replacement files
for file in "${replacement_files[@]}"; do
    cp "$original_file" "$(dirname "$original_file")/$file"
    cp "./dist/$file" "$destination_dir/$file"
done

echo "[Phase 1] Sync everything"

s3cmd sync ./dist/assets/ s3://bponi/asset/site/site-site/assets/ --acl-public -M --guess-mime-type --no-mime-magic