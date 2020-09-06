import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';

const pkg = require('./package.json');

const extensions = ['.js', '.ts'];

const plugins = (browserslist) => [
  resolve({extensions}),
  commonjs(),
  json(),
  ts({
    browserslist: browserslist || 'defaults and not IE 11',
  }),
  bundleSize(),
];

const outputs = [
  {
    input: 'src/index.ts',
    output: {
      file: 'build/vega-embed.module.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: plugins(),
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
  },
];

for (const build of ['es5', 'es6']) {
  const buildFolder = build === 'es5' ? 'build-es5' : 'build';
  outputs.push({
    input: 'src/index.ts',
    output: [
      {
        file: `${buildFolder}/vega-embed.js`,
        format: 'umd', // cannot do iife because rollup generates code that expects Vega-Lite to be present
        sourcemap: true,
        name: 'vegaEmbed',
        globals: {
          'vega-lite': 'vegaLite',
        },
      },
      {
        file: `${buildFolder}/vega-embed.min.js`,
        format: 'umd', // cannot do iife because rollup generates code that expects Vega-Lite to be present
        sourcemap: true,
        name: 'vegaEmbed',
        globals: {
          'vega-lite': 'vegaLite',
        },
        plugins: [terser()],
      },
    ],
    plugins: plugins(build === 'es5' ? 'defaults' : null),
    external: ['vega', 'vega-lite'],
  });
}

export default outputs;
