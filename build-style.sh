#!/usr/bin/env bash

style=$(cat vega-embed.css)

printf "// generated with build-style.sh\nexport default \`${style}\`" > src/style.ts
