import {contextBridge, ipcRenderer} from 'electron'

// 暴露受保护的方法给渲染进程使用
contextBridge.exposeInMainWorld('electronAPI', {
    // 示例：发送消息到主进程
    sendMessage: (message) => ipcRenderer.invoke('send-message', message),

    // 示例：监听主进程消息
    onMessage: (callback) => {
        ipcRenderer.on('message-from-main', (event, data) => callback(data))
    },

    // 获取平台信息
    platform: process.platform,

    // 获取版本信息
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron,
    },

    // 窗口控制
    windowMinimize: () => ipcRenderer.invoke('window-minimize'),
    windowMaximize: () => ipcRenderer.invoke('window-maximize'),
    windowClose: () => ipcRenderer.invoke('window-close'),
})

