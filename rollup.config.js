import 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default {
	input: 'src/index.ts',
	output: {
		file: 'lib/index.js',
		format: 'umd',
		name: 'rwinix',
		exports: 'named'
	},
  plugins: [
		resolve(),
		typescript(),
		babel({
			babelHelpers: 'bundled',
		}),
		terser()
	]
}