<template>
  <div v-if="visible" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ isEdit ? '编辑连接' : '新建连接' }}</h3>
        <button class="dialog-close" @click="handleCancel" title="关闭">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4 L4 12 M4 4 L12 12"/>
          </svg>
        </button>
      </div>

      <div class="dialog-body">
        <div class="dialog-content-wrapper">
          <!-- 左侧导航菜单 -->
          <div class="nav-sidebar">
            <div
                v-for="tab in tabs"
                :key="tab.id"
                class="nav-item"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </div>
          </div>

          <!-- 右侧内容区域 -->
          <div class="content-area">
            <!-- 常规配置 -->
            <GeneralConfig
                v-if="activeTab === 'general'"
                :model-value="formData"
                @update:model-value="formData = $event"
            />

            <!-- 高级配置 -->
            <AdvancedConfig
                v-if="activeTab === 'advanced'"
                :model-value="formData"
                @update:model-value="formData = $event"
            />

            <!-- 数据库别名 -->
            <DatabaseAlias
                v-if="activeTab === 'alias'"
                :model-value="formData"
                @update:model-value="formData = $event"
            />

            <!-- SSL/TLS -->
            <SslConfig
                v-if="activeTab === 'ssl'"
                :model-value="formData"
                @update:model-value="formData = $event"
                @browse="handleBrowse"
            />

            <!-- SSH隧道 -->
            <SshConfig
                v-if="activeTab === 'ssh'"
                :model-value="formData"
                @update:model-value="formData = $event"
                @browse="handleBrowse"
            />

            <!-- 哨兵模式 -->
            <SentinelConfig
                v-if="activeTab === 'sentinel'"
                :model-value="formData"
                @update:model-value="formData = $event"
                @auto-query="handleAutoQuery"
            />

            <!-- 集群模式 -->
            <ClusterConfig
                v-if="activeTab === 'cluster'"
                :model-value="formData"
                @update:model-value="formData = $event"
            />

            <!-- 网络代理 -->
            <ProxyConfig
                v-if="activeTab === 'proxy'"
                :model-value="formData"
                @update:model-value="formData = $event"
            />
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="dialog-footer">
          <button type="button" class="btn btn-secondary" @click="testConnection">
            测试连接
          </button>
          <button type="button" class="btn btn-secondary" @click="parseClipboardUrl">
            解析剪切板中的URL
          </button>
          <button type="button" class="btn btn-cancel" @click="handleCancel">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {
  GeneralConfig,
  AdvancedConfig,
  DatabaseAlias,
  SslConfig,
  SshConfig,
  SentinelConfig,
  ClusterConfig,
  ProxyConfig
} from './connection'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  connection: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'submit', 'cancel'])

const activeTab = ref('general')
const isEdit = ref(false)

const tabs = [
  {id: 'general', label: '常规配置'},
  {id: 'advanced', label: '高级配置'},
  {id: 'alias', label: '数据库别名'},
  {id: 'ssl', label: 'SSL/TLS'},
  {id: 'ssh', label: 'SSH隧道'},
  {id: 'sentinel', label: '哨兵模式'},
  {id: 'cluster', label: '集群模式'},
  {id: 'proxy', label: '网络代理'}
]

const defaultFormData = () => ({
  name: '',
  groupId: null,
  protocol: 'tcp',
  host: '127.0.0.1',
  port: 6379,
  password: '',
  username: '',
  keyFilter: '*',
  keySeparator: ':',
  connectTimeout: 60,
  executeTimeout: 60,
  keyView: 'tree',
  keysPerLoad: 10000,
  dbFilter: 'all',
  tagColor: 'none',
  aliases: [],
  ssl: {
    enabled: false,
    certFile: '',
    keyFile: '',
    caFile: '',
    rejectUnauthorized: false,
    servername: ''
  },
  ssh: {
    enabled: false,
    host: '',
    port: 22,
    authType: 'password',
    username: '',
    password: '',
    privateKeyFile: ''
  },
  sentinel: {
    enabled: false,
    masterGroup: 'mymaster',
    masterPassword: '',
    masterUsername: ''
  },
  cluster: {
    enabled: false
  },
  proxy: {
    type: 'none',
    protocol: 'http',
    host: '',
    port: 0,
    authEnabled: false,
    username: '',
    password: ''
  }
})

const formData = ref(defaultFormData())

// 监听 connection 变化，填充表单
watch(() => props.connection, (newConnection) => {
  if (newConnection) {
    isEdit.value = true
    formData.value = {
      name: newConnection.name || '',
      groupId: newConnection.groupId || null,
      protocol: newConnection.protocol || 'tcp',
      host: newConnection.host || '127.0.0.1',
      port: newConnection.port || 6379,
      password: newConnection.password || '',
      username: newConnection.username || '',
      keyFilter: newConnection.keyFilter || '*',
      keySeparator: newConnection.keySeparator || ':',
      connectTimeout: newConnection.connectTimeout || 60,
      executeTimeout: newConnection.executeTimeout || 60,
      keyView: newConnection.keyView || 'tree',
      keysPerLoad: newConnection.keysPerLoad || 10000,
      dbFilter: newConnection.dbFilter || 'all',
      tagColor: newConnection.tagColor || 'none',
      aliases: newConnection.aliases || [],
      ssl: newConnection.ssl || {
        enabled: false,
        certFile: '',
        keyFile: '',
        caFile: '',
        rejectUnauthorized: false,
        servername: ''
      },
      ssh: newConnection.ssh || {
        enabled: false,
        host: '',
        port: 22,
        authType: 'password',
        username: '',
        password: '',
        privateKeyFile: ''
      },
      sentinel: newConnection.sentinel || {
        enabled: false,
        masterGroup: 'mymaster',
        masterPassword: '',
        masterUsername: ''
      },
      cluster: newConnection.cluster || {
        enabled: false
      },
      proxy: newConnection.proxy || {
        type: 'none',
        protocol: 'http',
        host: '',
        port: 0,
        authEnabled: false,
        username: '',
        password: ''
      }
    }
  } else {
    isEdit.value = false
    resetForm()
  }
}, {immediate: true})

// 监听 visible 变化，重置表单
watch(() => props.visible, (newVisible) => {
  if (!newVisible) {
    resetForm()
    isEdit.value = false
  } else {
    activeTab.value = 'general'
  }
})

function resetForm() {
  formData.value = defaultFormData()
}

function handleBrowse(type) {
  // TODO: 实现文件选择对话框
  console.log('浏览文件:', type)
}

function handleAutoQuery() {
  // TODO: 实现自动查询组名功能
  console.log('自动查询组名')
}

function testConnection() {
  // TODO: 实现测试连接功能
  console.log('测试连接:', formData.value)
}

function parseClipboardUrl() {
  // TODO: 实现解析剪切板URL功能
  console.log('解析剪切板URL')
}

function handleSubmit() {
  emit('submit', {...formData.value})
  emit('update:visible', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dialog-container {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dialog-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
}

.dialog-close:hover {
  background: #f0f0f0;
  color: #333;
}

.dialog-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.nav-sidebar {
  width: 180px;
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  padding: 16px 0;
  overflow-y: auto;
}

.nav-item {
  padding: 12px 20px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #eeeeee;
  color: #333;
}

.nav-item.active {
  background: #fff;
  color: #e53935;
  border-left-color: #e53935;
  font-weight: 500;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
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

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f5f5f5;
  border-color: #999;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #f5f5f5;
  border-color: #999;
}

.btn-primary {
  background: #e53935;
  color: white;
}

.btn-primary:hover {
  background: #c62828;
  box-shadow: 0 2px 8px rgba(229, 57, 53, 0.3);
}
</style>
