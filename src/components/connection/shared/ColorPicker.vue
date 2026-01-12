<template>
  <div class="color-picker">
    <button
        v-for="color in colors"
        :key="color.value"
        type="button"
        class="color-btn"
        :class="{ active: modelValue === color.value }"
        :style="{ backgroundColor: color.bg }"
        @click="$emit('update:modelValue', color.value)"
    >
      <svg v-if="color.value === 'none'" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="2" y1="2" x2="10" y2="10"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
const colors = [
  {value: 'none', bg: '#000000'},
  {value: 'red', bg: '#f44336'},
  {value: 'orange', bg: '#ff9800'},
  {value: 'yellow', bg: '#ffeb3b'},
  {value: 'green', bg: '#4caf50'},
  {value: 'blue', bg: '#2196f3'},
  {value: 'purple', bg: '#9c27b0'}
]

defineProps({
  modelValue: {
    type: String,
    default: 'none'
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.color-picker {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: #000;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: #e53935;
  border-width: 3px;
}
</style>
