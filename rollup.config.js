import 'rollup'
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
      file: 'lib/cjs/index.js',
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
        outDir: 'lib/types',
        emitDeclarationOnly: true,
      }),
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/es/index.js',
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
        outDir: 'lib/types',
        emitDeclarationOnly: true,
      }),
    ]
  }
]
