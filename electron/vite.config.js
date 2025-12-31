import {defineConfig} from 'vite'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

// 在 ESM 模式下模拟 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    build: {
        outDir: 'dist-electron',
        emptyOutDir: true,
        // 关键修复 1: 设置构建目标为 Node.js 环境，而不是浏览器
        target: 'node18',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'main.js'),
                preload: resolve(__dirname, 'preload.js'),
            },
            output: {
                entryFileNames: '[name].js',
                // 保持 ESM 格式，因为你的 package.json 是 type: module
                format: 'es',
            },
            // 关键修复 2: 显式将 Electron 和 Node 内置模块设为外部依赖
            // 防止 Vite 尝试将它们打包成浏览器代码
            external: [
                'electron',
                'path',
                'url',
                'fs',
                'os',
                'child_process'
            ],
        },
        // 可选: 关闭压缩以便于调试构建后的代码
        minify: false,
    },
});
