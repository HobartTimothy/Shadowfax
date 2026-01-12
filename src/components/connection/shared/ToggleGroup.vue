<template>
  <div class="toggle-group">
    <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="toggle-btn"
        :class="{ active: modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  options: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.toggle-group {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.toggle-btn:hover {
  border-color: #999;
  background: #f5f5f5;
}

.toggle-btn.active {
  background: #e53935;
  border-color: #e53935;
  color: white;
}
</style>
