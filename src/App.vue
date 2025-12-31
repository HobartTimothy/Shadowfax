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
              @contextmenu.prevent="showContextMenu($event, connection)"
            >
              <div class="connection-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div class="connection-info">
                <div class="connection-name">{{ connection.name }}</div>
                <div class="connection-details">
                  <span class="connection-host">{{ connection.host }}:{{ connection.port }}</span>
                </div>
                <div class="connection-status" :class="connection.status">
                  <span class="status-dot"></span>
                  {{ getStatusText(connection.status) }}
                </div>
              </div>
              <div class="connection-actions" @click.stop>
                <button 
                  class="action-btn edit-btn" 
                  @click="editConnection(connection)"
                  title="编辑"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button 
                  class="action-btn delete-btn" 
                  @click="confirmDeleteConnection(connection)"
                  title="删除"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="connections.length === 0" class="empty-connections">
              <p>暂无连接</p>
              <p class="empty-hint">点击下方按钮添加新连接</p>
            </div>
          </div>
        </div>

        <!-- 主要操作区域 -->
        <div class="content-area">
          <div v-if="!selectedConnection" class="empty-state">
            <div class="empty-state-icon">
              <svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <svg class="close-badge" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="7" fill="white" stroke="currentColor" stroke-width="1"/>
                <path d="M5 5 L11 11 M11 5 L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="empty-state-text">可以从左边选择并打开连接</p>
            <button class="add-connection-button" @click="showAddDialog">
              <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>添加新连接</span>
            </button>
          </div>
          <div v-else class="connection-detail">
            <div class="detail-header">
              <h3>{{ selectedConnection.name }}</h3>
              <button class="close-detail-btn" @click="selectedConnection = null" title="关闭">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 4 L4 12 M4 4 L12 12"/>
                </svg>
              </button>
            </div>
            <div class="detail-content">
              <div class="detail-item">
                <label>主机地址：</label>
                <span>{{ selectedConnection.host }}</span>
              </div>
              <div class="detail-item">
                <label>端口：</label>
                <span>{{ selectedConnection.port }}</span>
              </div>
              <div class="detail-item">
                <label>数据库索引：</label>
                <span>{{ selectedConnection.database || 0 }}</span>
              </div>
              <div class="detail-item">
                <label>状态：</label>
                <span :class="['status-badge', selectedConnection.status]">
                  {{ getStatusText(selectedConnection.status) }}
                </span>
              </div>
              <div class="detail-actions">
                <button class="btn btn-connect" @click="connectToRedis(selectedConnection)">
                  {{ selectedConnection.status === 'connected' ? '断开连接' : '连接' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 连接配置对话框 -->
        <ConnectionDialog
          v-model:visible="dialogVisible"
          :connection="editingConnection"
          @submit="handleConnectionSubmit"
          @cancel="handleDialogCancel"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConnectionDialog from './components/ConnectionDialog.vue'
import { 
  getConnections, 
  addConnection, 
  updateConnection, 
  deleteConnection 
} from './utils/storage.js'

// 侧边栏折叠状态
const isSidebarCollapsed = ref(false)

// 当前激活的导航项
const activeNav = ref('connections')

// 连接列表数据（从本地存储加载）
const connections = ref([])

// 选中的连接
const selectedConnection = ref(null)

// 对话框状态
const dialogVisible = ref(false)
const editingConnection = ref(null)

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

// 加载连接列表
const loadConnections = () => {
  connections.value = getConnections()
}

// 显示添加对话框
const showAddDialog = () => {
  editingConnection.value = null
  dialogVisible.value = true
}

// 编辑连接
const editConnection = (connection) => {
  editingConnection.value = connection
  dialogVisible.value = true
}

// 处理连接提交（添加或更新）
const handleConnectionSubmit = (formData) => {
  if (editingConnection.value) {
    // 更新现有连接
    const updated = updateConnection(editingConnection.value.id, formData)
    if (updated) {
      loadConnections()
      // 如果正在编辑的连接是当前选中的，更新选中状态
      if (selectedConnection.value?.id === updated.id) {
        selectedConnection.value = updated
      }
    }
  } else {
    // 添加新连接
    const newConnection = addConnection(formData)
    loadConnections()
    // 自动选中新添加的连接
    selectedConnection.value = newConnection
  }
}

// 处理对话框取消
const handleDialogCancel = () => {
  editingConnection.value = null
}

// 确认删除连接
const confirmDeleteConnection = (connection) => {
  if (confirm(`确定要删除连接 "${connection.name}" 吗？`)) {
    deleteConnection(connection.id)
    loadConnections()
    // 如果删除的是当前选中的连接，清空选中状态
    if (selectedConnection.value?.id === connection.id) {
      selectedConnection.value = null
    }
  }
}

// 显示右键菜单（可以后续扩展）
const showContextMenu = (event, connection) => {
  // 可以在这里实现右键菜单
  console.log('右键菜单:', connection)
}

// 连接到 Redis（占位函数，后续实现）
const connectToRedis = (connection) => {
  console.log('连接到 Redis:', connection)
  // TODO: 实现实际的 Redis 连接逻辑
  if (connection.status === 'connected') {
    updateConnection(connection.id, { status: 'disconnected' })
  } else {
    updateConnection(connection.id, { status: 'connecting' })
    // 模拟连接过程
    setTimeout(() => {
      updateConnection(connection.id, { status: 'connected' })
      loadConnections()
    }, 1000)
  }
  loadConnections()
}

// 组件挂载时加载连接
onMounted(() => {
  loadConnections()
})

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

.connection-details {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.connection-host {
  font-family: monospace;
}

.connection-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.connection-item:hover .connection-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #666;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
}

.edit-btn:hover {
  color: #2196f3;
  background: #e3f2fd;
}

.delete-btn:hover {
  color: #f44336;
  background: #ffebee;
}

.empty-connections {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.empty-connections p {
  margin: 8px 0;
  font-size: 14px;
}

.empty-hint {
  font-size: 12px;
  color: #bbb;
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
  background: #ffffff;
}

.empty-state {
  text-align: center;
  max-width: 400px;
}

.empty-state-icon {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.folder-icon {
  width: 64px;
  height: 64px;
  color: #d0d0d0;
}

.close-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  color: #d0d0d0;
}

.empty-state-text {
  font-size: 14px;
  color: #d0d0d0;
  margin-bottom: 24px;
  line-height: 1.6;
}

.add-connection-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #ffffff;
  color: #666;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
}

.add-connection-button:hover {
  border-color: #999;
  color: #333;
  background: #fafafa;
}

.add-connection-button:active {
  background: #f5f5f5;
}

.add-icon {
  width: 16px;
  height: 16px;
  color: currentColor;
}

/* 连接详情样式 */
.connection-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-detail-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #666;
  transition: all 0.2s;
}

.close-detail-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.detail-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-item label {
  font-weight: 500;
  color: #666;
  min-width: 100px;
  font-size: 14px;
}

.detail-item span {
  color: #333;
  font-size: 14px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.connected {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.disconnected {
  background: #f5f5f5;
  color: #757575;
}

.status-badge.connecting {
  background: #fff3e0;
  color: #e65100;
}

.detail-actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-connect {
  background: #4caf50;
  color: white;
}

.btn-connect:hover {
  background: #45a049;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}
</style>
