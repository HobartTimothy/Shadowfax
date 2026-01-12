<template>
  <div class="tab-content">
    <div class="form-group">
      <label>默认键过滤表达式</label>
      <input
          :value="modelValue.keyFilter"
          type="text"
          placeholder="*"
          class="form-input"
          @input="update('keyFilter', $event.target.value)"
      />
    </div>

    <div class="form-group">
      <label>键分隔符</label>
      <input
          :value="modelValue.keySeparator"
          type="text"
          placeholder=":"
          class="form-input"
          @input="update('keySeparator', $event.target.value)"
      />
    </div>

    <div class="form-group">
      <label>连接超时</label>
      <div class="timeout-input-group">
        <input
            :value="modelValue.connectTimeout"
            type="number"
            placeholder="60"
            class="form-input"
            @input="update('connectTimeout', parseInt($event.target.value) || 0)"
        />
        <span class="timeout-unit">秒</span>
      </div>
    </div>

    <div class="form-group">
      <label>执行超时</label>
      <div class="timeout-input-group">
        <input
            :value="modelValue.executeTimeout"
            type="number"
            placeholder="60"
            class="form-input"
            @input="update('executeTimeout', parseInt($event.target.value) || 0)"
        />
        <span class="timeout-unit">秒</span>
      </div>
    </div>

    <div class="form-group">
      <label>默认键视图</label>
      <ToggleGroup
          :model-value="modelValue.keyView"
          :options="keyViewOptions"
          @update:model-value="update('keyView', $event)"
      />
    </div>

    <div class="form-group">
      <label>单次加载键数量</label>
      <input
          :value="modelValue.keysPerLoad"
          type="number"
          placeholder="10000"
          class="form-input"
          @input="update('keysPerLoad', parseInt($event.target.value) || 0)"
      />
    </div>

    <div class="form-group">
      <label>数据库过滤方式</label>
      <ToggleGroup
          :model-value="modelValue.dbFilter"
          :options="dbFilterOptions"
          @update:model-value="update('dbFilter', $event)"
      />
    </div>

    <div class="form-group">
      <label>标记颜色</label>
      <ColorPicker
          :model-value="modelValue.tagColor"
          @update:model-value="update('tagColor', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import ToggleGroup from '../shared/ToggleGroup.vue'
import ColorPicker from '../shared/ColorPicker.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const keyViewOptions = [
  {value: 'tree', label: '树形列表'},
  {value: 'flat', label: '平铺列表'}
]

const dbFilterOptions = [
  {value: 'all', label: '显示所有'},
  {value: 'include', label: '显示指定'},
  {value: 'exclude', label: '隐藏指定'}
]

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

.timeout-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeout-input-group .form-input {
  flex: 1;
}

.timeout-unit {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}
</style>
