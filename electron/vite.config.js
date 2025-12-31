import {defineConfig} from 'vite'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

// 在 ESM 模式下模拟 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 共享的外部依赖配置
const external = [
    'electron',
    'path',
    'url',
    'fs',
    'os',
    'child_process'
]

// 从环境变量获取要构建的目标（main 或 preload）
const buildTarget = process.env.BUILD_TARGET || 'main'

export default defineConfig({
    build: {
        outDir: 'dist-electron',
        emptyOutDir: buildTarget === 'main', // 只在构建 main 时清空
        target: 'node18',
        rollupOptions: {
            input: buildTarget === 'preload' 
                ? { preload: resolve(__dirname, 'preload.js') }
                : { main: resolve(__dirname, 'main.js') },
            output: {
                entryFileNames: '[name].js',
                // preload 使用 CommonJS，main 使用 ES 模块
                format: buildTarget === 'preload' ? 'cjs' : 'es',
            },
            external,
        },
        minify: false,
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
});
