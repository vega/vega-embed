import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'build/index.js',
  output: {
    file: 'build/vega-embed.js',
    format: 'umd',
    sourcemap: true,
    name: 'vegaEmbed',
    globals: {
      vega: 'vega',
      'vega-lib': 'vega',
      'vega-lite': 'vl'
    }
  },
  plugins: [
    nodeResolve(),
    json(),
    commonjs()
  ],
  external: ['vega', 'vega-lib', 'vega-lite']
};

