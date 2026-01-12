<template>
  <div class="tab-content">
    <div class="form-group">
      <label class="checkbox-label">
        <input
            :checked="modelValue.ssl.enabled"
            type="checkbox"
            class="checkbox-input"
            @change="updateSsl('enabled', $event.target.checked)"
        />
        <span>启用SSL</span>
      </label>
    </div>

    <div class="form-group">
      <label>公钥文件</label>
      <FileInput
          :model-value="modelValue.ssl.certFile"
          placeholder="PEM格式公钥文件(Cert)"
          @update:model-value="updateSsl('certFile', $event)"
          @browse="handleBrowse('cert')"
      />
    </div>

    <div class="form-group">
      <label>私钥文件</label>
      <FileInput
          :model-value="modelValue.ssl.keyFile"
          placeholder="PEM格式私钥文件(Key)"
          @update:model-value="updateSsl('keyFile', $event)"
          @browse="handleBrowse('key')"
      />
    </div>

    <div class="form-group">
      <label>授权文件</label>
      <FileInput
          :model-value="modelValue.ssl.caFile"
          placeholder="PEM格式授权文件(CA)"
          @update:model-value="updateSsl('caFile', $event)"
          @browse="handleBrowse('ca')"
      />
    </div>

    <div class="form-group">
      <label class="checkbox-label">
        <input
            :checked="modelValue.ssl.rejectUnauthorized"
            type="checkbox"
            class="checkbox-input"
            @change="updateSsl('rejectUnauthorized', $event.target.checked)"
        />
        <span>允许不安全连接</span>
      </label>
    </div>

    <div class="form-group">
      <label>服务器名(SNI)</label>
      <input
          :value="modelValue.ssl.servername"
          type="text"
          placeholder="服务器名(SNI)"
          class="form-input"
          @input="updateSsl('servername', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
import FileInput from '../shared/FileInput.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'browse'])

function updateSsl(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    ssl: {
      ...props.modelValue.ssl,
      [key]: value
    }
  })
}

function handleBrowse(type) {
  emit('browse', `ssl-${type}`)
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
