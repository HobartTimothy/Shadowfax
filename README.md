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

构建生产版本：

```bash
npm run build
```

构建特定平台：

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

构建产物将输出到 `release` 目录。

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

