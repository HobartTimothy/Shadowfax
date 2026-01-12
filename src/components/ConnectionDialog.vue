<template>
  <div v-if="visible" class="dialog-overlay" @click.self="cancelForm">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ isEdit ? '编辑连接' : '新建连接' }}</h3>
        <button class="dialog-close" @click="cancelForm" title="关闭">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4 L4 12 M4 4 L12 12"/>
          </svg>
        </button>
      </div>

      <div class="dialog-body">
        <div class="dialog-content-wrapper">
          <!-- 左侧导航菜单 -->
          <nav class="nav-sidebar" role="tablist">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                class="nav-item"
                :class="{ active: activeTab === tab.id }"
                :aria-selected="activeTab === tab.id"
                role="tab"
                @click="switchTab(tab.id)"
            >
              {{ tab.label }}
            </button>
          </nav>

          <!-- 右侧内容区域 -->
          <div class="content-area" role="tabpanel">
            <component
                :is="componentMap[currentTab.component]"
                :model-value="formData"
                @update:model-value="updateFormData"
                @browse="handleBrowse"
                @auto-query="handleAutoQuery"
            />
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="dialog-footer">
          <button
              type="button"
              class="btn btn-secondary"
              @click="testConnection(formData)"
          >
            测试连接
          </button>
          <button
              type="button"
              class="btn btn-secondary"
              @click="parseClipboardUrl(updateFormData)"
          >
            解析剪切板中的URL
          </button>
          <button type="button" class="btn btn-cancel" @click="cancelForm">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="submitForm">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
import {useConnectionForm} from './connection/composables/useConnectionForm.js'
import {useConnectionActions} from './connection/composables/useConnectionActions.js'

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

// 组件映射表
const componentMap = {
  GeneralConfig,
  AdvancedConfig,
  DatabaseAlias,
  SslConfig,
  SshConfig,
  SentinelConfig,
  ClusterConfig,
  ProxyConfig
}

// 使用组合式函数
const {
  activeTab,
  isEdit,
  formData,
  currentTab,
  tabs,
  updateFormData,
  switchTab,
  submitForm,
  cancelForm
} = useConnectionForm(props, emit)

const {
  handleBrowse,
  handleAutoQuery,
  testConnection,
  parseClipboardUrl
} = useConnectionActions()
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
