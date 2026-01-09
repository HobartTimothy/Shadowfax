<template>
  <div v-if="visible" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ isEdit ? '编辑分组' : '新建分组' }}</h3>
        <button class="dialog-close" @click="handleCancel" title="关闭">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4 L4 12 M4 4 L12 12"/>
          </svg>
        </button>
      </div>

      <div class="dialog-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">分组名称 *</label>
            <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="例如：生产环境"
                required
                class="form-input"
            />
          </div>

          <div v-if="showParentSelect" class="form-group">
            <label for="parentId">父分组</label>
            <select
                v-if="!fixedParentId"
                id="parentId"
                v-model="formData.parentId"
                class="form-input"
            >
              <option :value="null">无（根分组）</option>
              <option
                  v-for="group in availableParents"
                  :key="group.id"
                  :value="group.id"
              >
                {{ group.name }}
              </option>
            </select>
            <input
                v-else
                id="parentId"
                :value="parentGroupName"
                class="form-input form-input-disabled"
                readonly
                disabled
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-cancel" @click="handleCancel">
              取消
            </button>
            <button type="submit" class="btn btn-submit">
              {{ isEdit ? '保存' : '创建' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, computed} from 'vue'
import {getGroups} from '../utils/storage.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  group: {
    type: Object,
    default: null
  },
  excludeGroupId: {
    type: String,
    default: null
  },
  showParentSelect: {
    type: Boolean,
    default: true
  },
  fixedParentId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'submit', 'cancel'])

const isEdit = ref(false)
const formData = ref({
  name: '',
  parentId: null
})

// 计算分组的层数（从根到该分组的深度，根分组为1）
function getGroupDepth(groupId) {
  const groups = getGroups()
  const group = groups.find(g => g.id === groupId)
  if (!group) return 0
  if (!group.parentId) return 1
  return 1 + getGroupDepth(group.parentId)
}

const availableParents = computed(() => {
  const groups = getGroups()
  // 排除当前编辑的分组及其子分组（避免循环引用）
  // 同时排除已经达到最大层数（3层）的分组
  return groups.filter(g => {
    if (g.id === props.excludeGroupId) return false
    if (props.excludeGroupId && isDescendantOf(g, props.excludeGroupId)) return false
    // 如果选择该分组作为父分组会导致超过3层，则排除
    const currentDepth = getGroupDepth(g.id)
    if (currentDepth >= 3) return false
    return true
  })
})

const parentGroupName = computed(() => {
  if (!props.fixedParentId) return ''
  const groups = getGroups()
  const parent = groups.find(g => g.id === props.fixedParentId)
  return parent ? parent.name : ''
})

function isDescendantOf(group, ancestorId) {
  if (group.parentId === ancestorId) return true
  if (!group.parentId) return false
  const parent = getGroups().find(g => g.id === group.parentId)
  return parent ? isDescendantOf(parent, ancestorId) : false
}

// 监听 visible 变化，打开时初始化表单
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    // 对话框打开时，根据 group prop 初始化表单
    if (props.group && props.group.id) {
      // 编辑模式
      isEdit.value = true
      formData.value = {
        name: props.group.name || '',
        parentId: props.group.parentId || null
      }
    } else if (props.group && props.group.parentId) {
      // 新建子分组模式
      isEdit.value = false
      formData.value = {
        name: '',
        parentId: props.group.parentId
      }
    } else {
      // 新建根分组模式
      isEdit.value = false
      resetForm()
    }
  } else {
    // 对话框关闭时重置表单
    resetForm()
  }
})

function resetForm() {
  formData.value = {
    name: '',
    parentId: null
  }
  isEdit.value = false
}

function handleSubmit() {
  // 验证层数限制
  if (formData.value.parentId) {
    const parentDepth = getGroupDepth(formData.value.parentId)
    if (parentDepth >= 3) {
      alert('分组层数最多为3层，无法在该分组下创建子分组')
      return
    }
  }

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
  max-width: 400px;
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

.form-input-disabled {
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
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

