import {defineConfig} from 'vite'
import {resolve} from 'path'

export default defineConfig({
    build: {
        outDir: 'dist-electron',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'main.js'),
                preload: resolve(__dirname, 'preload.js'),
            },
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
})

