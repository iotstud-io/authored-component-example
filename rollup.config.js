import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
    input: {
        GenericClimateSensor: 'src/GenericClimateSensor.jsx',
        // Add more entries here, e.g. OtherComponent: 'src/OtherComponent.jsx'
    },
    output: {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].esm.js'
    },
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
        terser(),
        // copy exposes.json into dist/ so the published bundle includes the manifest
        copy({
            targets: [
                { src: 'exposes.json', dest: 'dist' }
            ],
            verbose: true
        })
    ]
};
