import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/MyComponent.jsx',
  output: [
    {
      file: 'dist/MyComponent.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/MyComponent.umd.js',
      format: 'umd',
      name: 'MyComponent',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      sourcemap: true,
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      extensions: ['.js', '.jsx'],
      exclude: 'node_modules/**',
    }),
    terser()
  ]
};
