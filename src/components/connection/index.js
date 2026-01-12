// 导出所有连接配置相关的组件
export {default as GeneralConfig} from './tabs/GeneralConfig.vue'
export {default as AdvancedConfig} from './tabs/AdvancedConfig.vue'
export {default as DatabaseAlias} from './tabs/DatabaseAlias.vue'
export {default as SslConfig} from './tabs/SslConfig.vue'
export {default as SshConfig} from './tabs/SshConfig.vue'
export {default as SentinelConfig} from './tabs/SentinelConfig.vue'
export {default as ClusterConfig} from './tabs/ClusterConfig.vue'
export {default as ProxyConfig} from './tabs/ProxyConfig.vue'

// 导出共享组件
export {default as PasswordInput} from './shared/PasswordInput.vue'
export {default as FileInput} from './shared/FileInput.vue'
export {default as AddressInput} from './shared/AddressInput.vue'
export {default as ToggleGroup} from './shared/ToggleGroup.vue'
export {default as ColorPicker} from './shared/ColorPicker.vue'

// 导出配置和工具函数
export * from './config.js'
export * from './utils.js'

// 导出组合式函数
export {useConnectionForm} from './composables/useConnectionForm.js'
export {useConnectionActions} from './composables/useConnectionActions.js'
