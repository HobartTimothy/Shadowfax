import {ref, watch, computed} from 'vue'
import {createDefaultFormData, createFormDataFromConnection} from '../utils.js'
import {TABS} from '../config.js'

/**
 * 连接表单的组合式函数
 * @param {Object} props - 组件 props
 * @param {Function} emit - emit 函数
 * @returns {Object} 表单相关的响应式数据和方法
 */
export function useConnectionForm(props, emit) {
  const activeTab = ref('general')
  const isEdit = ref(false)
  const formData = ref(createDefaultFormData())

  // 当前选中的选项卡配置
  const currentTab = computed(() => {
    return TABS.find(tab => tab.id === activeTab.value) || TABS[0]
  })

  // 监听 connection 变化，填充表单
  watch(() => props.connection, (newConnection) => {
    if (newConnection) {
      isEdit.value = true
      formData.value = createFormDataFromConnection(newConnection)
    } else {
      isEdit.value = false
      resetForm()
    }
  }, {immediate: true})

  // 监听 visible 变化，重置表单
  watch(() => props.visible, (newVisible) => {
    if (!newVisible) {
      resetForm()
      isEdit.value = false
    } else {
      activeTab.value = 'general'
    }
  })

  /**
   * 重置表单
   */
  function resetForm() {
    formData.value = createDefaultFormData()
  }

  /**
   * 更新表单数据
   * @param {Object} newData - 新的表单数据
   */
  function updateFormData(newData) {
    formData.value = newData
  }

  /**
   * 切换选项卡
   * @param {String} tabId - 选项卡ID
   */
  function switchTab(tabId) {
    activeTab.value = tabId
  }

  /**
   * 提交表单
   */
  function submitForm() {
    emit('submit', {...formData.value})
    emit('update:visible', false)
  }

  /**
   * 取消操作
   */
  function cancelForm() {
    emit('cancel')
    emit('update:visible', false)
  }

  return {
    activeTab,
    isEdit,
    formData,
    currentTab,
    tabs: TABS,
    resetForm,
    updateFormData,
    switchTab,
    submitForm,
    cancelForm
  }
}
