#!/bin/bash

set -euo pipefail

# Author : Bponi Founder
# Copyright (c) bponi.com
# Script follows here:

echo "File uploading..."

if npx --yes tw-patch --help >/dev/null 2>&1; then
    npx --yes tw-patch
else
    echo "[Build] tw-patch not available, continuing without it"
fi

npm run build
node foot-code.js
node head-code.js

script_to_execute="./copy.sh"
source "$script_to_execute"
