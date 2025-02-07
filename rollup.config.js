import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';

import pkg from './package.json' with {type: 'json'};

const outputs = [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.exports,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [nodeResolve(), json(), typescript()],
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'vegaEmbed',
      exports: 'named',
      sourcemap: true,
      globals: {
        vega: 'vega',
        'vega-lite': 'vegaLite',
      },
    },
    plugins: [nodeResolve(), json(), typescript(), terser(), bundleSize()],
    external: ['vega', 'vega-lite'],
  },
];

export default outputs;
