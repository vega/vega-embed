import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import bundleSize from "rollup-plugin-bundle-size";
import { terser } from "rollup-plugin-terser";

const pkg = require("./package.json");

const extensions = [".js", ".ts"];

const plugins = [
  resolve({ extensions }),
  commonjs(),
  babel({
    presets: [
      "@babel/preset-typescript",
      [
        "@babel/preset-env",
        {
          targets: "defaults and not IE 11",
          debug: true
        }
      ]
    ],
    extensions: [".js", ".ts"],
    babelHelpers: "bundled"
  }),
  json(),
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
