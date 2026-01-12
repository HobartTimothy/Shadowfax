<template>
  <div class="tab-content">
    <div class="form-group">
      <label class="checkbox-label">
        <input
            :checked="modelValue.ssh.enabled"
            type="checkbox"
            class="checkbox-input"
            @change="updateSsh('enabled', $event.target.checked)"
        />
        <span>启用SSH隧道</span>
      </label>
    </div>

    <div class="form-group">
      <label>连接地址</label>
      <div class="address-input-group">
        <input
            :value="modelValue.ssh.host"
            type="text"
            placeholder="SSH地址"
            class="form-input address-input"
            @input="updateSsh('host', $event.target.value)"
        />
        <span class="address-separator">:</span>
        <input
            :value="modelValue.ssh.port"
            type="number"
            placeholder="22"
            class="form-input port-input"
            @input="updateSsh('port', parseInt($event.target.value) || 22)"
        />
      </div>
    </div>

    <div class="form-group">
      <label>登录类型</label>
      <ToggleGroup
          :model-value="modelValue.ssh.authType"
          :options="authTypeOptions"
          @update:model-value="updateSsh('authType', $event)"
      />
    </div>

    <div class="form-group">
      <label>用户名</label>
      <input
          :value="modelValue.ssh.username"
          type="text"
          placeholder="SSH登录用户名"
          class="form-input"
          @input="updateSsh('username', $event.target.value)"
      />
    </div>

    <div v-if="modelValue.ssh.authType === 'password'" class="form-group">
      <label>密码</label>
      <PasswordInput
          :model-value="modelValue.ssh.password"
          placeholder="SSH登录密码"
          @update:model-value="updateSsh('password', $event)"
      />
    </div>

    <div v-if="modelValue.ssh.authType === 'key'" class="form-group">
      <label>私钥文件</label>
      <FileInput
          :model-value="modelValue.ssh.privateKeyFile"
          placeholder="SSH私钥文件路径"
          @update:model-value="updateSsh('privateKeyFile', $event)"
          @browse="handleBrowse"
      />
    </div>
  </div>
</template>

<script setup>
import ToggleGroup from '../shared/ToggleGroup.vue'
import PasswordInput from '../shared/PasswordInput.vue'
import FileInput from '../shared/FileInput.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'browse'])

const authTypeOptions = [
  {value: 'password', label: '密码'},
  {value: 'key', label: '私钥文件'}
]

function updateSsh(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    ssh: {
      ...props.modelValue.ssh,
      [key]: value
    }
  })
}

function handleBrowse() {
  emit('browse', 'sshKey')
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

.address-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-input {
  flex: 1;
}

.address-separator {
  color: #666;
  font-size: 14px;
}

.port-input {
  width: 100px;
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
</style>
