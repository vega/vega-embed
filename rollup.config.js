import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json' with {type: 'json'};

const outputs = [
  {
    input: 'src/embed.ts',
    output: {
      file: pkg.exports.default,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [nodeResolve(), commonjs(), json(), typescript(), bundleSize()],
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'vegaEmbed',
      sourcemap: true,
      globals: {
        vega: 'vega',
        'vega-lite': 'vegaLite',
      },
    },
    plugins: [nodeResolve(), commonjs(), json(), typescript(), terser(), bundleSize()],
    external: ['vega', 'vega-lite'],
  },
];

export default outputs;
