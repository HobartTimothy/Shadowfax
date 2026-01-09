import {exec} from 'child_process'
import {promisify} from 'util'

const execAsync = promisify(exec)

async function killPort(port) {
    try {
        // Windows 命令：查找占用端口的进程
        const {stdout} = await execAsync(`netstat -ano | findstr :${port}`)

        if (!stdout) {
            console.log(`端口 ${port} 未被占用`)
            return
        }

        // 提取进程 ID
        const lines = stdout.trim().split('\n')
        const pids = new Set()

        for (const line of lines) {
            const match = line.match(/\s+(\d+)\s*$/)
            if (match) {
                pids.add(match[1])
            }
        }

        // 杀死所有占用端口的进程
        for (const pid of pids) {
            try {
                await execAsync(`taskkill /F /PID ${pid}`)
                console.log(`已终止进程 ${pid} (占用端口 ${port})`)
            } catch (error) {
                // 进程可能已经不存在了
                console.log(`无法终止进程 ${pid}: ${error.message}`)
            }
        }
    } catch (error) {
        // 如果没有找到占用端口的进程，这是正常的
        if (!error.message.includes('findstr')) {
            console.error(`检查端口 ${port} 时出错:`, error.message)
        }
    }
}

const port = process.argv[2] || '5173'
killPort(port)
