import {app, BrowserWindow, ipcMain} from 'electron'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 保持对窗口对象的全局引用，否则窗口会被自动关闭
let mainWindow

function createWindow() {
    // 获取图标路径
    const iconPath = join(__dirname, '../resources/icon/redis.jpg')

    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false, // 无边框窗口，支持自定义标题栏
        titleBarStyle: 'hidden',
        icon: iconPath, // 设置应用图标
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.js'),
        },
    })

    // 加载应用
    // 使用 app.isPackaged 检测是否为开发环境（更可靠，不依赖环境变量）
    const isDev = !app.isPackaged

    if (isDev) {
        // 开发环境：连接到 Vite 开发服务器
        const devServerUrl = 'http://localhost:5173'
        console.log('开发模式：连接到', devServerUrl)
        mainWindow.loadURL(devServerUrl).catch(err => {
            console.error('无法连接到开发服务器:', err)
            // 如果连接失败，尝试加载本地文件
            mainWindow.loadFile(join(__dirname, '../dist/index.html')).catch(loadErr => {
                console.error('无法加载本地文件:', loadErr)
            })
        })
        // 开发环境下打开开发者工具
        mainWindow.webContents.openDevTools()
    } else {
        // 生产环境：加载打包后的文件
        mainWindow.loadFile(join(__dirname, '../dist/index.html'))
    }

    // 当窗口被关闭时发出
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

// IPC 处理示例
ipcMain.handle('send-message', async (event, message) => {
    console.log('收到来自渲染进程的消息:', message)
    // 可以发送消息回渲染进程
    if (mainWindow) {
        mainWindow.webContents.send('message-from-main', {
            response: '主进程已收到消息: ' + message,
            timestamp: new Date().toISOString(),
        })
    }
    return '消息已处理'
})

// 窗口控制 IPC 处理
ipcMain.handle('window-minimize', () => {
    if (mainWindow) {
        mainWindow.minimize()
    }
})

ipcMain.handle('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize()
        } else {
            mainWindow.maximize()
        }
    }
})

ipcMain.handle('window-close', () => {
    if (mainWindow) {
        mainWindow.close()
    }
})

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // 在 macOS 上，当单击 dock 图标并且没有其他窗口打开时，
        // 通常在应用程序中重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// 当所有窗口都被关闭时退出应用
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用程序及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
