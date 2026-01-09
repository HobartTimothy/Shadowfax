<template>
  <div v-if="visible" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ isEdit ? '编辑连接' : '添加连接' }}</h3>
        <button class="dialog-close" @click="handleCancel" title="关闭">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4 L4 12 M4 4 L12 12"/>
          </svg>
        </button>
      </div>

      <div class="dialog-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">连接名称 *</label>
            <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="例如：生产服务器"
                required
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="host">主机地址 *</label>
            <input
                id="host"
                v-model="formData.host"
                type="text"
                placeholder="127.0.0.1"
                required
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="port">端口 *</label>
            <input
                id="port"
                v-model.number="formData.port"
                type="number"
                placeholder="6379"
                required
                min="1"
                max="65535"
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="留空表示无密码"
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="username">用户名</label>
            <input
                id="username"
                v-model="formData.username"
                type="text"
                placeholder="Redis 6.0+ ACL 用户名（可选）"
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="database">数据库索引</label>
            <input
                id="database"
                v-model.number="formData.database"
                type="number"
                placeholder="0"
                min="0"
                max="15"
                class="form-input"
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-cancel" @click="handleCancel">
              取消
            </button>
            <button type="submit" class="btn btn-submit">
              {{ isEdit ? '保存' : '添加' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'

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

const isEdit = ref(false)
const formData = ref({
  name: '',
  host: '127.0.0.1',
  port: 6379,
  password: '',
  username: '',
  database: 0
})

// 监听 connection 变化，填充表单
watch(() => props.connection, (newConnection) => {
  if (newConnection) {
    isEdit.value = true
    formData.value = {
      name: newConnection.name || '',
      host: newConnection.host || '127.0.0.1',
      port: newConnection.port || 6379,
      password: newConnection.password || '',
      username: newConnection.username || '',
      database: newConnection.database || 0
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
  }
})

function resetForm() {
  formData.value = {
    name: '',
    host: '127.0.0.1',
    port: 6379,
    password: '',
    username: '',
    database: 0
  }
  isEdit.value = false
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
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
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
  padding: 20px 24px;
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
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
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

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e8e8e8;
  color: #333;
}

.btn-submit {
  background: #2196f3;
  color: white;
}

.btn-submit:hover {
  background: #1976d2;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.btn-submit:active {
  transform: translateY(1px);
}
</style>

