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
    }
  ],
  // Only allow React family as externals so the host can provide a single shared React
  external: [
    'react',
    'react-dom/client',
    'react/jsx-runtime',
    'react/jsx-dev-runtime'
  ],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: '>0.2%, not dead, not op_mini all' }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ],
      extensions: ['.js', '.jsx'],
      exclude: 'node_modules/**',
    }),
    terser()
  ]
};
