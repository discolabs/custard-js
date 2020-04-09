import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';

const config = {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      indent: false
    },
    { file: pkg.module, format: 'es', indent: false },
    { file: 'dist/custard.mjs.js', format: 'es', indent: false, plugins: [terser()] },
    {
      file: pkg.unpkg,
      format: 'umd',
      name: 'CustardJS',
      indent: false
    },
    {
      file: 'dist/custard.min.js',
      format: 'umd',
      name: 'CustardJS',
      indent: false,
      plugins: [terser()]
    }
  ],
  plugins: [
    nodeResolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};

export default config;
