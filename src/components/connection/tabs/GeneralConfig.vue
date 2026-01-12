<template>
  <div class="tab-content">
    <div class="form-group">
      <label>连接名</label>
      <input
          :value="modelValue.name"
          type="text"
          placeholder="连接名"
          class="form-input"
          @input="update('name', $event.target.value)"
      />
    </div>

    <div class="form-group">
      <label>分组</label>
      <select :value="modelValue.groupId" class="form-input" @change="update('groupId', $event.target.value === 'null' ? null : $event.target.value)">
        <option :value="null">无分组</option>
        <option v-for="group in groups" :key="group.id" :value="group.id">
          {{ group.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>连接地址</label>
      <AddressInput
          :protocol="modelValue.protocol"
          :host="modelValue.host"
          :port="modelValue.port"
          @update:protocol="update('protocol', $event)"
          @update:host="update('host', $event)"
          @update:port="update('port', $event)"
      />
    </div>

    <div class="form-group">
      <label>密码</label>
      <PasswordInput
          :model-value="modelValue.password"
          placeholder="(可选)Redis服务授权密码"
          @update:model-value="update('password', $event)"
      />
    </div>

    <div class="form-group">
      <label>用户名</label>
      <input
          :value="modelValue.username"
          type="text"
          placeholder="(可选)Redis服务授权用户名"
          class="form-input"
          @input="update('username', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {getGroups} from '../../../utils/storage.js'
import AddressInput from '../shared/AddressInput.vue'
import PasswordInput from '../shared/PasswordInput.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const groups = computed(() => getGroups())

function update(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
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
