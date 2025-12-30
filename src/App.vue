<template>
  <div id="app">
    <header class="app-header">
      <h1>Shadowfax</h1>
      <p class="subtitle">Vue + Electron 应用程序</p>
    </header>

    <main class="app-main">
      <div class="info-card">
        <h2>欢迎使用 Shadowfax</h2>
        <p>这是一个基于 Vue 3 和 Electron 的桌面应用程序模板。</p>

        <div class="info-section">
          <h3>系统信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">平台:</span>
              <span class="value">{{ platform }}</span>
            </div>
            <div class="info-item">
              <span class="label">Node.js:</span>
              <span class="value">{{ versions.node }}</span>
            </div>
            <div class="info-item">
              <span class="label">Chrome:</span>
              <span class="value">{{ versions.chrome }}</span>
            </div>
            <div class="info-item">
              <span class="label">Electron:</span>
              <span class="value">{{ versions.electron }}</span>
            </div>
          </div>
        </div>

        <div class="action-section">
          <button @click="handleClick" class="action-button">
            点击测试
          </button>
          <p v-if="message" class="message">{{ message }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'

const platform = ref('未知')
const versions = ref({
  node: '未知',
  chrome: '未知',
  electron: '未知',
})
const message = ref('')

// 消息处理函数
const handleMessage = (data) => {
  message.value = `收到主进程消息: ${data.response} (${data.timestamp})`
}

onMounted(() => {
  // 从 Electron 预加载脚本获取信息
  if (window.electronAPI) {
    platform.value = window.electronAPI.platform
    versions.value = window.electronAPI.versions

    // 监听来自主进程的消息
    window.electronAPI.onMessage(handleMessage)
  }
})

onUnmounted(() => {
  // 清理监听器（如果需要）
  // 注意：ipcRenderer.on 的监听器在组件卸载时应该被移除
  // 但在这个简单的示例中，我们保持监听器活跃
})

const handleClick = async () => {
  if (window.electronAPI) {
    try {
      const response = await window.electronAPI.sendMessage('Hello from Vue!')
      message.value = response || '消息已发送到 Electron 主进程'
    } catch (error) {
      message.value = '错误: ' + error.message
    }
  } else {
    message.value = 'Electron API 不可用（可能在浏览器中运行）'
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  padding: 2rem;
  text-align: center;
  color: white;
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.info-card h2 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.8rem;
}

.info-card > p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section h3 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.value {
  font-size: 1rem;
  color: #333;
  font-weight: 600;
}

.action-section {
  text-align: center;
}

.action-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.action-button:active {
  transform: translateY(0);
}

.message {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}
</style>

