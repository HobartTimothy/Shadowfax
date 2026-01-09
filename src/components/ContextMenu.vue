<template>
  <div
      v-if="visible"
      class="context-menu"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
      @click.stop
  >
    <div
        v-for="item in menuItems"
        :key="item.id"
        class="context-menu-item"
        :class="{ disabled: item.disabled, divider: item.divider }"
        @click="handleItemClick(item)"
    >
      <svg v-if="item.icon === 'add'" class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      <svg v-else-if="item.icon === 'folder'" class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
      <svg v-else-if="item.icon === 'edit'" class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      <svg v-else-if="item.icon === 'delete'" class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
      <span class="menu-label">{{ item.label }}</span>
      <span v-if="item.shortcut" class="menu-shortcut">{{ item.shortcut }}</span>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, onMounted, onUnmounted, nextTick} from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  position: {
    type: Object,
    default: () => ({x: 0, y: 0})
  },
  menuItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select'])

let clickHandler = null
let keydownHandler = null

function handleItemClick(item) {
  if (item.disabled || item.divider) {
    return
  }
  emit('select', item)
  emit('close')
}

function createClickHandler() {
  return (event) => {
    if (props.visible) {
      const menu = event.target.closest('.context-menu')
      if (!menu) {
        emit('close')
      }
    }
  }
}

function createKeydownHandler() {
  return (event) => {
    if (event.key === 'Escape' && props.visible) {
      emit('close')
    }
  }
}

// 监听 visible 变化，动态添加/移除事件监听器
watch(() => props.visible, async (newVal) => {
  if (newVal) {
    // 菜单显示时，等待 DOM 更新后添加事件监听器
    await nextTick()
    // 再延迟一点，确保菜单已完全渲染
    setTimeout(() => {
      if (props.visible) {
        clickHandler = createClickHandler()
        keydownHandler = createKeydownHandler()
        document.addEventListener('click', clickHandler, true)
        document.addEventListener('keydown', keydownHandler)
      }
    }, 10)
  } else {
    // 菜单隐藏时，移除事件监听器
    if (clickHandler) {
      document.removeEventListener('click', clickHandler, true)
      clickHandler = null
    }
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler)
      keydownHandler = null
    }
  }
})

onUnmounted(() => {
  if (clickHandler) {
    document.removeEventListener('click', clickHandler, true)
  }
  if (keydownHandler) {
    document.removeEventListener('keydown', keydownHandler)
  }
})
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  padding: 4px 0;
  z-index: 2000;
  font-size: 14px;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.15s;
  color: #333;
}

.context-menu-item:hover:not(.disabled):not(.divider) {
  background: #f0f0f0;
}

.context-menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.context-menu-item.divider {
  height: 1px;
  padding: 0;
  margin: 4px 0;
  background: #e0e0e0;
  cursor: default;
}

.menu-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #666;
}

.menu-label {
  flex: 1;
  text-align: left;
}

.menu-shortcut {
  font-size: 12px;
  color: #999;
  margin-left: 16px;
}
</style>

