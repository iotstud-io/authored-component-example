import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(() => ({
    plugins: [
        react({ fastRefresh: false }),
        viteStaticCopy({
            targets: [
                { src: 'exposes.json', dest: '' }
            ]
        })
    ],
    publicDir: 'public',
    server: {
        port: 5173,
        cors: true,
        hmr: false
    },
    build: {
        lib: {
            entry: 'src/GenericClimateSensor.jsx',
            formats: ['es'],
            fileName: () => 'GenericClimateSensor.esm.js'
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom/client',
                'react/jsx-runtime',
                'react/jsx-dev-runtime'
            ],
            output: {
                dir: 'dist'
            },
            preserveEntrySignatures: 'strict'
        }
    }
}))
