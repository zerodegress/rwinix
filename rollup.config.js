import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/rwinix-cjs.js',
      format: 'cjs',
      name: 'rwinix',
      exports: 'named'
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
      }),
      typescript({
        declaration: true,
        outDir: 'types',
        emitDeclarationOnly: true,
      }),
    ]
  },
  {
    input: 'dist/rwinix-cjs.js',
    output: {
      file: 'dist/rwinix-cjs.min.js',
      format: 'cjs',
      name: 'rwinix',
      exports: 'named'
    },
    plugins: [terser()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/rwinix-es.js',
      format: 'es',
      name: 'rwinix',
      exports: 'named'
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
      }),
      typescript({
        declaration: true,
        outDir: 'types',
        emitDeclarationOnly: true,
      }),
    ]
  },
  {
    input: 'dist/rwinix-es.js',
    output: {
      file: 'dist/rwinix-es.min.js',
      format: 'es',
      name: 'rwinix',
      exports: 'named'
    },
    plugins: [terser()]
  },
]
