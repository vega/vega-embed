#!/usr/bin/env bash

printf "// generated with build-style.sh\nexport default \`" > src/style.ts
node-sass vega-embed.scss >> src/style.ts
echo "\`" >> src/style.ts
