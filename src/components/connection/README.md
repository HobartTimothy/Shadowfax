# 连接配置组件包

这个包包含了所有与连接配置相关的组件，采用模块化设计，便于维护和扩展。

## 目录结构

```
connection/
├── tabs/              # 配置选项卡组件
│   ├── GeneralConfig.vue      # 常规配置
│   ├── AdvancedConfig.vue      # 高级配置
│   ├── DatabaseAlias.vue       # 数据库别名
│   ├── SslConfig.vue           # SSL/TLS配置
│   ├── SshConfig.vue           # SSH隧道配置
│   ├── SentinelConfig.vue      # 哨兵模式配置
│   ├── ClusterConfig.vue       # 集群模式配置
│   └── ProxyConfig.vue         # 网络代理配置
├── shared/            # 共享组件
│   ├── PasswordInput.vue       # 密码输入框（带显示/隐藏）
│   ├── FileInput.vue           # 文件选择输入框
│   ├── AddressInput.vue        # 地址输入框（协议/主机/端口）
│   ├── ToggleGroup.vue         # 切换按钮组
│   └── ColorPicker.vue         # 颜色选择器
├── index.js           # 组件导出文件
└── README.md          # 说明文档
```

## 组件说明

### 配置选项卡组件

所有选项卡组件都遵循相同的接口：

- **Props**: `modelValue` (Object) - 表单数据对象
- **Emits**: `update:modelValue` - 更新表单数据

#### GeneralConfig (常规配置)
- 连接名
- 分组选择
- 连接地址（协议/主机/端口）
- 密码
- 用户名

#### AdvancedConfig (高级配置)
- 默认键过滤表达式
- 键分隔符
- 连接/执行超时
- 默认键视图（树形/平铺）
- 单次加载键数量
- 数据库过滤方式
- 标记颜色

#### DatabaseAlias (数据库别名)
- 添加/删除数据库别名列表

#### SslConfig (SSL/TLS配置)
- 启用SSL开关
- 公钥/私钥/授权文件选择
- 允许不安全连接
- 服务器名(SNI)

#### SshConfig (SSH隧道配置)
- 启用SSH隧道开关
- 连接地址
- 登录类型（密码/私钥文件）
- 用户名和密码/私钥文件

#### SentinelConfig (哨兵模式配置)
- 启用哨兵节点开关
- 主节点组名（支持自动查询）
- 主节点密码和用户名

#### ClusterConfig (集群模式配置)
- 启用集群节点开关

#### ProxyConfig (网络代理配置)
- 代理类型选择（不使用/系统/手动）
- 手动配置代理设置（协议/主机/端口/认证）

### 共享组件

#### PasswordInput
密码输入框，带显示/隐藏切换功能。

**Props:**
- `modelValue` (String) - 密码值
- `placeholder` (String) - 占位符文本

**Emits:**
- `update:modelValue` - 更新密码值

#### FileInput
文件选择输入框，带浏览按钮。

**Props:**
- `modelValue` (String) - 文件路径
- `placeholder` (String) - 占位符文本

**Emits:**
- `update:modelValue` - 更新文件路径
- `browse` - 点击浏览按钮

#### AddressInput
地址输入框，包含协议选择、主机和端口输入。

**Props:**
- `protocol` (String) - 协议类型（tcp/tls）
- `host` (String) - 主机地址
- `port` (Number) - 端口号

**Emits:**
- `update:protocol` - 更新协议
- `update:host` - 更新主机
- `update:port` - 更新端口

#### ToggleGroup
切换按钮组，用于单选场景。

**Props:**
- `modelValue` (String|Number) - 当前选中值
- `options` (Array) - 选项数组，格式：`[{value, label}, ...]`

**Emits:**
- `update:modelValue` - 更新选中值

#### ColorPicker
颜色选择器，用于选择标记颜色。

**Props:**
- `modelValue` (String) - 当前选中的颜色值

**Emits:**
- `update:modelValue` - 更新颜色值

## 使用示例

```vue
<template>
  <GeneralConfig
    :model-value="formData"
    @update:model-value="formData = $event"
  />
</template>

<script setup>
import { GeneralConfig } from './connection'
</script>
```

## 数据格式

所有配置选项卡组件期望接收一个包含以下结构的对象：

```javascript
{
  name: '',
  groupId: null,
  protocol: 'tcp',
  host: '127.0.0.1',
  port: 6379,
  password: '',
  username: '',
  keyFilter: '*',
  keySeparator: ':',
  connectTimeout: 60,
  executeTimeout: 60,
  keyView: 'tree',
  keysPerLoad: 10000,
  dbFilter: 'all',
  tagColor: 'none',
  aliases: [],
  ssl: { /* ... */ },
  ssh: { /* ... */ },
  sentinel: { /* ... */ },
  cluster: { /* ... */ },
  proxy: { /* ... */ }
}
```

## 扩展指南

要添加新的配置选项卡：

1. 在 `tabs/` 目录下创建新的组件文件
2. 实现 `modelValue` prop 和 `update:modelValue` emit
3. 在 `index.js` 中导出新组件
4. 在 `ConnectionDialog.vue` 中引入并使用
