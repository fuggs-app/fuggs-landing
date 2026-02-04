#!/bin/bash
# Fuggs Landing Page - Development Server Wrapper
# This script calls the actual dev.sh in the site/ directory

cd "$(dirname "$0")/site" && exec ./dev.sh "$@"
