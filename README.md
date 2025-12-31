# Shadowfax

一个基于 Vue 3 和 Electron 的桌面应用程序模板。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Electron** - 使用 Web 技术构建跨平台桌面应用
- **Vite** - 下一代前端构建工具
- **electron-builder** - 打包和分发 Electron 应用

## 项目结构

```
Shadowfax/
├── electron/          # Electron 主进程文件
│   ├── main.js       # 主进程入口
│   ├── preload.js    # 预加载脚本
│   └── vite.config.js # Electron 构建配置
├── src/              # Vue 应用源码
│   ├── App.vue       # 主组件
│   ├── main.js       # Vue 应用入口
│   └── style.css     # 全局样式
├── index.html        # HTML 模板
├── vite.config.js    # Vite 配置
└── package.json      # 项目配置
```

## 开发

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器（Vue 应用 + Electron）：

```bash
npm run electron:dev
```

或者分别启动：

```bash
# 终端 1: 启动 Vite 开发服务器
npm run dev

# 终端 2: 启动 Electron
npm run electron:dev
```

### 构建应用

#### 准备图标文件

在打包前，需要准备图标文件（可选，但强烈推荐）：

1. 准备一个 512x512 或更大的 PNG 图标源文件
2. 转换为各平台所需格式：
   - **Windows**: `build/icon.ico`
   - **macOS**: `build/icon.icns`
   - **Linux**: `build/icon.png`

详细说明请参考 `build/README.md`

#### 打包命令

**构建所有平台：**
```bash
npm run build:all
```

**构建特定平台：**
```bash
# Windows (包含 x64 和 ia32，生成 NSIS 安装程序和便携版)
npm run build:win

# macOS (包含 x64 和 arm64，生成 DMG 和 ZIP)
npm run build:mac

# Linux (包含 x64 和 arm64，生成 AppImage、DEB 和 RPM)
npm run build:linux
```

**构建特定架构：**
```bash
# Windows x64
npm run build:win64

# Windows 32位
npm run build:win32

# macOS Intel
npm run build:mac64

# macOS Apple Silicon
npm run build:macarm

# Linux x64
npm run build:linux64

# Linux ARM64
npm run build:linuxarm
```

**默认构建（当前平台）：**
```bash
npm run build
```

#### 打包输出

所有构建产物将输出到 `release` 目录：

- **Windows**: 
  - `Shadowfax-{version}-x64.exe` (NSIS 安装程序)
  - `Shadowfax-{version}-x64-portable.exe` (便携版)
- **macOS**: 
  - `Shadowfax-{version}-x64.dmg` / `Shadowfax-{version}-arm64.dmg`
  - `Shadowfax-{version}-x64.zip` / `Shadowfax-{version}-arm64.zip`
- **Linux**: 
  - `Shadowfax-{version}-x64.AppImage` / `Shadowfax-{version}-arm64.AppImage`
  - `Shadowfax-{version}-x64.deb` / `Shadowfax-{version}-arm64.deb`
  - `Shadowfax-{version}-x64.rpm`

## 功能特性

- ✅ Vue 3 Composition API
- ✅ Electron 主进程和渲染进程通信
- ✅ 现代化的 UI 设计
- ✅ 跨平台支持（Windows、macOS、Linux）
- ✅ 热重载开发体验
- ✅ 自动打包和分发

## 开发说明

### Electron 主进程

主进程文件位于 `electron/main.js`，负责创建和管理应用窗口。

### 预加载脚本

`electron/preload.js` 用于安全地暴露 Electron API 给渲染进程使用。

### Vue 应用

Vue 应用位于 `src/` 目录，使用 Composition API 编写。

### 进程间通信

示例代码展示了如何在 Vue 组件中调用 Electron API：

```javascript
// 在 Vue 组件中
if (window.electronAPI) {
  const response = await window.electronAPI.sendMessage('Hello')
}
```

## 许可证

Apache License 2.0

