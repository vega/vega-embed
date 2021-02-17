import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import bundleSize from 'rollup-plugin-bundle-size';
import esbuild from 'rollup-plugin-esbuild';

const pkg = require('./package.json');

const plugins = (target, minify, declaration) => [
  resolve(),
  commonjs(),
  json(),
  esbuild({
    sourceMap: true,
    minify,
    target,
    tsconfig: 'tsconfig.json',
    loaders: {
      json: 'json',
    },
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
    plugins: plugins(undefined, false, true),
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
  },
];

const globals = {
  vega: 'vega',
  'vega-lite': 'vegaLite',
};

const external = ['vega', 'vega-lite'];

for (const build of ['es5', 'es6']) {
  const buildFolder = build === 'es5' ? 'build-es5' : 'build';
  outputs.push(
    ...[
      {
        input: 'src/index.ts',
        output: [
          {
            file: `${buildFolder}/vega-embed.js`,
            format: 'umd',
            sourcemap: true,
            name: 'vegaEmbed',
            globals,
          },
        ],
        plugins: plugins(build === 'es5' ? 'es2020' : 'es2015', false, false),
        external,
      },
      {
        input: 'src/index.ts',
        output: [
          {
            file: `${buildFolder}/vega-embed.min.js`,
            format: 'umd', // cannot do iife because rollup generates code that expects Vega-Lite to be present
            sourcemap: true,
            name: 'vegaEmbed',
            globals,
          },
        ],
        plugins: plugins(build === 'es5' ? 'es2020' : 'es2015', true, false),
        external,
      },
    ]
  );
}

export default outputs;
