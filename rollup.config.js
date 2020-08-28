import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import ts from "@wessberg/rollup-plugin-ts";
import bundleSize from "rollup-plugin-bundle-size";
import { terser } from "rollup-plugin-terser";

const pkg = require("./package.json");

const extensions = [".js", ".ts"];

const plugins = [
  resolve({ extensions }),
  commonjs(),
  json(),
  ts({
    browserslist: ["defaults", "not IE 11"]
  }),
  bundleSize()
];

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
        file: "build/vega-embed.min.js",
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
    plugins,
    external: ["vega", "vega-lite"]
  },
  {
    input: "src/index.ts",
    output: {
      file: "build/vega-embed.module.js",
      format: "esm",
      sourcemap: true
    },
    plugins,
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]
  }
];
