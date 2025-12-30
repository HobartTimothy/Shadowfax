// Electron API 类型定义
export interface ElectronAPI {
    sendMessage: (message: string) => Promise<string>
    onMessage: (callback: (data: { response: string; timestamp: string }) => void) => void
    platform: string
    versions: {
        node: string
        chrome: string
        electron: string
    }
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI
    }
}

export {}
