#!/bin/bash
cd "$(dirname "$0")/.."
nohup /usr/bin/python3 scripts/render-5-editions.py > /tmp/render-5.log 2>&1 &
echo "started pid=$!"
