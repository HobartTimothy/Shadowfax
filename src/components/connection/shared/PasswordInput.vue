<template>
  <div class="password-input-group">
    <input
        :value="modelValue"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholder"
        class="form-input"
        @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
        type="button"
        class="password-toggle"
        @click="showPassword = !showPassword"
    >
      <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import {ref} from 'vue'

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

defineEmits(['update:modelValue'])

const showPassword = ref(false)
</script>

<style scoped>
.password-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-group .form-input {
  padding-right: 40px;
}

.password-toggle {
  position: absolute;
  right: 8px;
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

.password-toggle:hover {
  background: #f0f0f0;
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
