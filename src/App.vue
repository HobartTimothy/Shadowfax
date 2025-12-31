<template>
  <div id="app">
    <!-- 自定义标题栏 -->
    <div class="title-bar">
      <div class="title-bar-drag-region"></div>
      <div class="title-bar-controls">
        <button class="title-bar-button minimize" @click="minimizeWindow" title="最小化">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="0" y="5" width="12" height="2" fill="currentColor"/>
          </svg>
        </button>
        <button class="title-bar-button maximize" @click="maximizeWindow" title="最大化/还原">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="1" y="1" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </button>
        <button class="title-bar-button close" @click="closeWindow" title="关闭">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 左侧侧边栏 -->
      <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
        <!-- 应用图标（折叠/展开触发器） -->
        <button class="app-icon-button" @click="toggleSidebar" title="折叠/展开侧边栏">
          <img class="app-icon" src="/icon.jpg" alt="应用图标" />
        </button>

        <!-- 导航菜单 -->
        <nav class="sidebar-nav">
          <button 
            class="nav-item" 
            :class="{ active: activeNav === 'connections' }"
            @click="setActiveNav('connections')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <span class="nav-label" v-show="!isSidebarCollapsed">我的连接</span>
          </button>
          
          <button 
            class="nav-item" 
            :class="{ active: activeNav === 'logs' }"
            @click="setActiveNav('logs')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span class="nav-label" v-show="!isSidebarCollapsed">日志</span>
          </button>
        </nav>

        <!-- 设置按钮（底部） -->
        <div class="sidebar-footer">
          <button 
            class="nav-item settings" 
            :class="{ active: activeNav === 'settings' }"
            @click="setActiveNav('settings')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
            </svg>
            <span class="nav-label" v-show="!isSidebarCollapsed">设置</span>
          </button>
        </div>
      </aside>

      <!-- 右侧主界面 -->
      <div class="main-content">
        <!-- 连接列表 -->
        <div class="connection-list">
          <h3 class="connection-list-title">连接列表</h3>
          <div class="connection-items">
            <div 
              v-for="connection in connections" 
              :key="connection.id"
              class="connection-item"
              :class="{ active: selectedConnection?.id === connection.id }"
              @click="selectConnection(connection)"
            >
              <div class="connection-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div class="connection-info">
                <div class="connection-name">{{ connection.name }}</div>
                <div class="connection-status" :class="connection.status">
                  <span class="status-dot"></span>
                  {{ getStatusText(connection.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 主要操作区域 -->
        <div class="content-area">
          <div class="empty-state">
            <p class="empty-state-text">可以从左边选择并打开连接</p>
            <button class="add-connection-button" @click="addConnection">
              <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>添加新连接</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 侧边栏折叠状态
const isSidebarCollapsed = ref(false)

// 当前激活的导航项
const activeNav = ref('connections')

// 连接列表数据
const connections = ref([
  { id: 1, name: '生产服务器', status: 'connected' },
  { id: 2, name: '测试数据库', status: 'disconnected' },
  { id: 3, name: '开发环境', status: 'connecting' },
])

// 选中的连接
const selectedConnection = ref(null)

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 设置激活的导航项
const setActiveNav = (nav) => {
  activeNav.value = nav
}

// 选择连接
const selectConnection = (connection) => {
  selectedConnection.value = connection
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    connected: '已连接',
    disconnected: '未连接',
    connecting: '连接中'
  }
  return statusMap[status] || '未知'
}

// 添加新连接
let isAddingConnection = false
const addConnection = () => {
  if (isAddingConnection) {
    return // 防止重复调用
  }
  isAddingConnection = true
  console.log('添加新连接')
  // TODO: 实现添加连接的逻辑
  // 使用 setTimeout 确保在下一个事件循环中重置标志
  setTimeout(() => {
    isAddingConnection = false
  }, 100)
}

// 窗口控制
const minimizeWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.windowMinimize()
  }
}

const maximizeWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.windowMaximize()
  }
}

const closeWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.windowClose()
  }
}
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  overflow: hidden;
}

/* 标题栏样式 */
.title-bar {
  height: 32px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  -webkit-app-region: drag;
  user-select: none;
}

.title-bar-drag-region {
  flex: 1;
  height: 100%;
}

.title-bar-controls {
  display: flex;
  -webkit-app-region: no-drag;
  height: 100%;
}

.title-bar-button {
  width: 46px;
  height: 32px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.title-bar-button:hover {
  background: #f0f0f0;
}

.title-bar-button.close:hover {
  background: #e81123;
  color: white;
}

/* 主容器 */
.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
  width: 240px;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  border-right: 1px solid #e0e0e0;
}

.sidebar.collapsed {
  width: 64px;
}

.app-icon-button {
  width: 100%;
  height: 64px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  border-bottom: 1px solid #e0e0e0;
}

.app-icon-button:hover {
  background: #e8e8e8;
}

.app-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}

/* 导航菜单 */
.sidebar-nav {
  flex: 1;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  width: 100%;
  height: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  color: #666;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: #e8e8e8;
  color: #333;
}

.nav-item.active {
  background: #e0e0e0;
  color: #333;
  font-weight: 500;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 14px;
  white-space: nowrap;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 16px 0;
  border-top: 1px solid #e0e0e0;
}

.nav-item.settings {
  margin: 0;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 连接列表 */
.connection-list {
  width: 280px;
  background: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.connection-list-title {
  padding: 20px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
}

.connection-items {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.connection-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 4px;
}

.connection-item:hover {
  background: #f5f5f5;
}

.connection-item.active {
  background: #e8f4f8;
}

.connection-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  flex-shrink: 0;
}

.connection-icon svg {
  width: 24px;
  height: 24px;
}

.connection-info {
  flex: 1;
  min-width: 0;
}

.connection-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.connection-status {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #999;
}

.connection-status.connected .status-dot {
  background: #4caf50;
}

.connection-status.connecting .status-dot {
  background: #ff9800;
}

.connection-status.disconnected .status-dot {
  background: #999;
}

/* 内容区域 */
.content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fafafa;
}

.empty-state {
  text-align: center;
  max-width: 400px;
}

.empty-state-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
  line-height: 1.6;
}

.add-connection-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
}

.add-connection-button:hover {
  background: #1976d2;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
  transform: translateY(-1px);
}

.add-connection-button:active {
  transform: translateY(0);
}

.add-icon {
  width: 18px;
  height: 18px;
}
</style>
