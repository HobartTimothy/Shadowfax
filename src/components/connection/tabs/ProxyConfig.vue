<template>
  <div class="tab-content">
    <div class="form-group">
      <label>代理配置</label>
      <div class="radio-group">
        <label class="radio-label">
          <input
              :checked="modelValue.proxy.type === 'none'"
              type="radio"
              value="none"
              class="radio-input"
              @change="updateProxy('type', 'none')"
          />
          <span>不使用代理</span>
        </label>
        <label class="radio-label">
          <input
              :checked="modelValue.proxy.type === 'system'"
              type="radio"
              value="system"
              class="radio-input"
              @change="updateProxy('type', 'system')"
          />
          <span>使用系统代理设置</span>
        </label>
        <label class="radio-label">
          <input
              :checked="modelValue.proxy.type === 'manual'"
              type="radio"
              value="manual"
              class="radio-input"
              @change="updateProxy('type', 'manual')"
          />
          <span>手动配置代理</span>
        </label>
      </div>
    </div>

    <template v-if="modelValue.proxy.type === 'manual'">
      <div class="form-group">
        <label>代理类型</label>
        <select :value="modelValue.proxy.protocol" class="form-input" @change="updateProxy('protocol', $event.target.value)">
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
          <option value="socks4">SOCKS4</option>
          <option value="socks5">SOCKS5</option>
        </select>
      </div>

      <div class="form-group">
        <label>主机名</label>
        <div class="address-input-group">
          <input
              :value="modelValue.proxy.host"
              type="text"
              placeholder="代理主机名"
              class="form-input address-input"
              @input="updateProxy('host', $event.target.value)"
          />
          <span class="address-separator">:</span>
          <input
              :value="modelValue.proxy.port"
              type="number"
              placeholder="0"
              class="form-input port-input"
              @input="updateProxy('port', parseInt($event.target.value) || 0)"
          />
        </div>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
              :checked="modelValue.proxy.authEnabled"
              type="checkbox"
              class="checkbox-input"
              @change="updateProxy('authEnabled', $event.target.checked)"
          />
          <span>使用身份验证</span>
        </label>
      </div>

      <template v-if="modelValue.proxy.authEnabled">
        <div class="form-group">
          <label>用户名</label>
          <input
              :value="modelValue.proxy.username"
              type="text"
              placeholder="代理授权用户名"
              class="form-input"
              @input="updateProxy('username', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <label>密码</label>
          <PasswordInput
              :model-value="modelValue.proxy.password"
              placeholder="代理授权密码"
              @update:model-value="updateProxy('password', $event)"
          />
        </div>
      </template>
    </template>
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

const emit = defineEmits(['update:modelValue'])

function updateProxy(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    proxy: {
      ...props.modelValue.proxy,
      [key]: value
    }
  })
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

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.radio-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
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
