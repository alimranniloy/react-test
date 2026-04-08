#!/bin/bash

# Author : Bponi Founder
# Copyright (c) bponi.com
# Script follows here:

## star
echo "File uploadig..."
## build script
npx tw-patch
npm run build
# Specify the path of the script you want to execute
script_to_execute="./copy.sh"
# Execute the script using the source command or the dot company
source "$script_to_execute"