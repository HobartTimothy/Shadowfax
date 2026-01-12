<template>
  <div class="tab-content">
    <div class="form-group">
      <label class="checkbox-label">
        <input
            :checked="modelValue.sentinel.enabled"
            type="checkbox"
            class="checkbox-input"
            @change="updateSentinel('enabled', $event.target.checked)"
        />
        <span>当前为哨兵节点</span>
      </label>
    </div>

    <div class="form-group">
      <label>主节点组名</label>
      <div class="master-group-input">
        <input
            :value="modelValue.sentinel.masterGroup"
            type="text"
            placeholder="mymaster"
            class="form-input"
            @input="updateSentinel('masterGroup', $event.target.value)"
        />
        <button type="button" class="btn-auto-query" @click="handleAutoQuery">
          自动查询组名
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>主节点密码</label>
      <PasswordInput
          :model-value="modelValue.sentinel.masterPassword"
          placeholder="(可选)主节点服务授权密码 (Redis > 6.0)"
          @update:model-value="updateSentinel('masterPassword', $event)"
      />
    </div>

    <div class="form-group">
      <label>主节点用户名</label>
      <input
          :value="modelValue.sentinel.masterUsername"
          type="text"
          placeholder="(可选)主节点服务授权用户名"
          class="form-input"
          @input="updateSentinel('masterUsername', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
import PasswordInput from '../shared/PasswordInput.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'autoQuery'])

function updateSentinel(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    sentinel: {
      ...props.modelValue.sentinel,
      [key]: value
    }
  })
}

function handleAutoQuery() {
  emit('autoQuery')
}
</script>

<style scoped>
.tab-content {
  max-width: 500px;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.master-group-input {
  display: flex;
  gap: 8px;
}

.master-group-input .form-input {
  flex: 1;
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

.btn-auto-query {
  padding: 10px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  white-space: nowrap;
}

.btn-auto-query:hover {
  border-color: #999;
  background: #f5f5f5;
}
</style>
