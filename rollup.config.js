import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';

const pkg = require('./package.json');

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
    browserslist,
  }),
  bundleSize(),
];

const outputs = [
  {
    input: 'src/embed.ts',
    output: {
      file: 'build/vega-embed.module.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: plugins(undefined, true),
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
        format: 'umd',
        sourcemap: true,
        name: 'vegaEmbed',
        globals: {
          vega: 'vega',
          'vega-lite': 'vegaLite',
        },
      },
      {
        file: `${buildFolder}/vega-embed.min.js`,
        format: 'umd', // cannot do iife because rollup generates code that expects Vega-Lite to be present
        sourcemap: true,
        name: 'vegaEmbed',
        globals: {
          vega: 'vega',
          'vega-lite': 'vegaLite',
        },
        plugins: [terser()],
      },
    ],
    plugins: plugins(build === 'es5' ? 'defaults' : 'defaults and not IE 11', false),
    external: ['vega', 'vega-lite'],
  });
}

export default outputs;
