import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "build/src/index.js",
  output: {
    file: "build/vega-embed.js",
    format: "umd",
    sourcemap: true,
    name: "vegaEmbed",
    globals: {
      vega: "vega",
      "vega-lite": "vegaLite"
    }
  },
  plugins: [nodeResolve(), json(), commonjs()],
  external: ["vega", "vega-lite"]
};
