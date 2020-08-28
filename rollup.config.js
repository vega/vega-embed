import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const pkg = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "build/vega-embed.js",
        format: "iife",
        sourcemap: true,
        name: "vegaEmbed",
        globals: {
          vega: "vega",
          "vega-lite": "vegaLite"
        }
      },
      {
        file: "build/vega-embed.js",
        format: "iife",
        sourcemap: true,
        name: "vegaEmbed",
        globals: {
          vega: "vega",
          "vega-lite": "vegaLite"
        },
        plugins: [terser()]
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: "tsconfig.src.json"
      }),
      json()
    ],
    external: ["vega", "vega-lite"]
  },
  {
    input: "src/index.ts",
    output: {
      file: "build/vega-embed.module.js",
      format: "esm",
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: "tsconfig.src.json"
      }),
      json()
    ],
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]
  }
];
