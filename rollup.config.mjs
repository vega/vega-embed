import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import bundleSize from "rollup-plugin-bundle-size";

import pkg from "./package.json" with { type: "json" };

const plugins = (declaration) => [
  resolve(),
  commonjs(),
  json(),
  typescript({
    compilerOptions: {
      declaration,
      declarationMap: declaration,
    },
  }),
  bundleSize(),
];

export default [
  {
    input: "src/embed.ts",
    output: {
      file: "build/vega-embed.module.mjs",
      format: "esm",
      sourcemap: true,
    },
    plugins: plugins(true),
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
    plugins: plugins(false),
    external: ["vega", "vega-lite"],
  },
];
