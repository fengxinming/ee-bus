import { defineConfig } from 'rollup';
// import buble from '@rollup/plugin-buble';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
// import nodeResolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import { terser } from 'rollup-plugin-terser';
import empty from 'rollup-plugin-empty';
import copy from 'rollup-plugin-copy';
import importShaking from 'rollup-plugin-import-shaking';
import replaceImports from 'rollup-plugin-replace-imports';
import filesize from 'rollup-plugin-filesize';
// import camelCase from 'camelcase';
import pkg from './package.json';

// const moduleName = pkg.name.slice(7);
const dependencies = Object.keys(pkg.dependencies);

export default defineConfig({
  input: 'src/index.ts',
  external: dependencies.map((n) => new RegExp(`^${n}/?`)),
  plugins: [
    empty({
      silent: false,
      dir: 'dist'
    }),
    replace({
      preventAssignment: true,
      values: {
        __VERSION__: pkg.version
      }
    }),
    typescript(),
    // nodeResolve(),
    // commonjs(),
    importShaking({
      modules: [{
        name: dependencies,
        importModule(namedExport, packageName) {
          return `${packageName}/es/${namedExport}`;
        }
      }]
    }),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'NPM_README.md', dest: 'dist', rename: 'README.md' },
        { src: 'types', dest: 'dist' },
        { src: 'src', dest: 'dist' }
      ]
    }),
    filesize()
  ],
  output: [{
    file: 'dist/cjs.js',
    format: 'cjs',
    exports: 'auto',
    externalLiveBindings: false,
    plugins: [
      replaceImports((n) => n.replace('/es/', '/'))
    ]
  }, {
    file: 'dist/esm.js',
    format: 'esm',
    exports: 'auto'
  }]
});
