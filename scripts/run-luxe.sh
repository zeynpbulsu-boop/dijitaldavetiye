#!/bin/bash
# Helper for osascript — runs render-luxe-assets.py in background, logs to /tmp.
cd "$(dirname "$0")/.."
nohup /usr/bin/python3 scripts/render-luxe-assets.py > /tmp/luxe-render.log 2>&1 &
echo "started pid=$!"
