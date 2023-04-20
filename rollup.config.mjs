import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import bundleSize from "rollup-plugin-bundle-size";
import ts from "rollup-plugin-ts";

import pkg from "./package.json" assert { type: "json" };

const plugins = (browserslist, declaration) => [
  resolve(),
  commonjs(),
  json(),
  ts({
    tsconfig: (resolvedConfig) => ({
      ...resolvedConfig,
      declaration,
      declarationMap: declaration,
    }),
    transpiler: "babel",
    browserslist,
  }),
  bundleSize(),
];

export default [
  {
    input: "src/embed.ts",
    output: {
      file: "build/vega-embed.module.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: plugins(false, true),
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "build/vega-embed.js",
        format: "umd",
        sourcemap: true,
        name: "vegaEmbed",
        globals: {
          vega: "vega",
          "vega-lite": "vegaLite",
        },
      },
      {
        file: "build/vega-embed.min.js",
        format: "umd", // cannot do iife because rollup generates code that expects Vega-Lite to be present
        sourcemap: true,
        name: "vegaEmbed",
        globals: {
          vega: "vega",
          "vega-lite": "vegaLite",
        },
        plugins: [terser()],
      },
    ],
    plugins: plugins("defaults", false),
    external: ["vega", "vega-lite"],
  },
];
