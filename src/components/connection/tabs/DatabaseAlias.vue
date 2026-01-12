<template>
  <div class="tab-content">
    <div class="form-group">
      <div class="alias-input-group">
        <input
            v-model="newAlias"
            type="text"
            placeholder="数据库别名"
            class="form-input"
            @keyup.enter="addAlias"
        />
        <button type="button" class="btn-add" @click="addAlias">+ 添加</button>
      </div>
      <div v-if="modelValue.aliases && modelValue.aliases.length > 0" class="alias-list">
        <div v-for="(alias, index) in modelValue.aliases" :key="index" class="alias-item">
          <span>{{ alias }}</span>
          <button type="button" class="alias-remove" @click="removeAlias(index)">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const newAlias = ref('')

function addAlias() {
  if (newAlias.value.trim()) {
    const aliases = [...(props.modelValue.aliases || []), newAlias.value.trim()]
    emit('update:modelValue', {
      ...props.modelValue,
      aliases
    })
    newAlias.value = ''
  }
}

function removeAlias(index) {
  const aliases = [...props.modelValue.aliases]
  aliases.splice(index, 1)
  emit('update:modelValue', {
    ...props.modelValue,
    aliases
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

.alias-input-group {
  display: flex;
  gap: 8px;
}

.alias-input-group .form-input {
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

.btn-add {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  white-space: nowrap;
}

.btn-add:hover {
  border-color: #999;
  background: #f5f5f5;
}

.alias-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alias-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 14px;
}

.alias-remove {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 20px;
  line-height: 1;
}

.alias-remove:hover {
  background: #e0e0e0;
  color: #f44336;
}
</style>
