<template>
  <div class="tab-content">
    <div class="form-group">
      <label class="checkbox-label">
        <input
            :checked="modelValue.cluster.enabled"
            type="checkbox"
            class="checkbox-input"
            @change="updateCluster('enabled', $event.target.checked)"
        />
        <span>当前为集群节点</span>
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

function updateCluster(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    cluster: {
      ...props.modelValue.cluster,
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
</style>
