<template>
  <div class="address-input-group">
    <select :value="protocol" class="protocol-select" @change="$emit('update:protocol', $event.target.value)">
      <option value="tcp">TCP</option>
      <option value="tls">TLS</option>
    </select>
    <input
        :value="host"
        type="text"
        placeholder="127.0.0.1"
        class="form-input address-input"
        @input="$emit('update:host', $event.target.value)"
    />
    <span class="address-separator">:</span>
    <input
        :value="port"
        type="number"
        placeholder="6379"
        class="form-input port-input"
        @input="$emit('update:port', parseInt($event.target.value) || 0)"
    />
  </div>
</template>

<script setup>
defineProps({
  protocol: {
    type: String,
    default: 'tcp'
  },
  host: {
    type: String,
    default: ''
  },
  port: {
    type: Number,
    default: 6379
  }
})

defineEmits(['update:protocol', 'update:host', 'update:port'])
</script>

<style scoped>
.address-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.protocol-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
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
