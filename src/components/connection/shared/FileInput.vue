<template>
  <div class="file-input-group">
    <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="form-input"
        @input="$emit('update:modelValue', $event.target.value)"
    />
    <button type="button" class="btn-browse" @click="handleBrowse">
      ...
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'browse'])

function handleBrowse() {
  emit('browse')
}
</script>

<style scoped>
.file-input-group {
  display: flex;
  gap: 8px;
}

.file-input-group .form-input {
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

.btn-browse {
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

.btn-browse:hover {
  border-color: #999;
  background: #f5f5f5;
}
</style>
