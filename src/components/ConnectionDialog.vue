<template>
  <div v-if="visible" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ isEdit ? '编辑连接' : '新建连接' }}</h3>
        <button class="dialog-close" @click="handleCancel" title="关闭">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4 L4 12 M4 4 L12 12"/>
          </svg>
        </button>
      </div>

      <div class="dialog-body">
        <div class="dialog-content-wrapper">
          <!-- 左侧导航菜单 -->
          <div class="nav-sidebar">
            <div
                v-for="tab in tabs"
                :key="tab.id"
                class="nav-item"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </div>
          </div>

          <!-- 右侧内容区域 -->
          <div class="content-area">
            <!-- 常规配置 -->
            <div v-if="activeTab === 'general'" class="tab-content">
              <div class="form-group">
                <label>连接名</label>
                <input
                    v-model="formData.name"
                    type="text"
                    placeholder="连接名"
                    class="form-input"
                />
              </div>

              <div class="form-group">
                <label>分组</label>
                <select v-model="formData.groupId" class="form-input">
                  <option :value="null">无分组</option>
                  <option v-for="group in groups" :key="group.id" :value="group.id">
                    {{ group.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>连接地址</label>
                <div class="address-input-group">
                  <select v-model="formData.protocol" class="protocol-select">
                    <option value="tcp">TCP</option>
                    <option value="tls">TLS</option>
                  </select>
                  <input
                      v-model="formData.host"
                      type="text"
                      placeholder="127.0.0.1"
                      class="form-input address-input"
                  />
                  <span class="address-separator">:</span>
                  <input
                      v-model.number="formData.port"
                      type="number"
                      placeholder="6379"
                      class="form-input port-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>密码</label>
                <div class="password-input-group">
                  <input
                      v-model="formData.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="(可选)Redis服务授权密码"
                      class="form-input"
                  />
                  <button
                      type="button"
                      class="password-toggle"
                      @click="showPassword = !showPassword"
                  >
                    <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>用户名</label>
                <input
                    v-model="formData.username"
                    type="text"
                    placeholder="(可选)Redis服务授权用户名"
                    class="form-input"
                />
              </div>
            </div>

            <!-- 高级配置 -->
            <div v-if="activeTab === 'advanced'" class="tab-content">
              <div class="form-group">
                <label>默认键过滤表达式</label>
                <input
                    v-model="formData.keyFilter"
                    type="text"
                    placeholder="*"
                    class="form-input"
                />
              </div>

              <div class="form-group">
                <label>键分隔符</label>
                <input
                    v-model="formData.keySeparator"
                    type="text"
                    placeholder=":"
                    class="form-input"
                />
              </div>

              <div class="form-group">
                <label>连接超时</label>
                <div class="timeout-input-group">
                  <input
                      v-model.number="formData.connectTimeout"
                      type="number"
                      placeholder="60"
                      class="form-input"
                  />
                  <span class="timeout-unit">秒</span>
                </div>
              </div>

              <div class="form-group">
                <label>执行超时</label>
                <div class="timeout-input-group">
                  <input
                      v-model.number="formData.executeTimeout"
                      type="number"
                      placeholder="60"
                      class="form-input"
                  />
                  <span class="timeout-unit">秒</span>
                </div>
              </div>

              <div class="form-group">
                <label>默认键视图</label>
                <div class="toggle-group">
                  <button
                      type="button"
                      class="toggle-btn"
                      :class="{ active: formData.keyView === 'tree' }"
                      @click="formData.keyView = 'tree'"
                  >
                    树形列表
                  </button>
                  <button
                      type="button"
                      class="toggle-btn"
                      :class="{ active: formData.keyView === 'flat' }"
                      @click="formData.keyView = 'flat'"
                  >
                    平铺列表
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>单次加载键数量</label>
                <input
                    v-model.number="formData.keysPerLoad"
                    type="number"
                    placeholder="10000"
                    class="form-input"
                />
              </div>

              <div class="form-group">
                <label>数据库过滤方式</label>
                <div class="toggle-group">
                  <button
                      type="button"
                      class="toggle-btn"
                      :class="{ active: formData.dbFilter === 'all' }"
                      @click="formData.dbFilter = 'all'"
                  >
                    显示所有
                  </button>
                  <button
                      type="button"
                      class="toggle-btn"
                      :class="{ active: formData.dbFilter === 'include' }"
                      @click="formData.dbFilter = 'include'"
                  >
                    显示指定
                  </button>
                  <button
                      type="button"
                      class="toggle-btn"
                      :class="{ active: formData.dbFilter === 'exclude' }"
                      @click="formData.dbFilter = 'exclude'"
                  >
                    隐藏指定
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>标记颜色</label>
                <div class="color-picker">
                  <button
                      v-for="color in colors"
                      :key="color.value"
                      type="button"
                      class="color-btn"
                      :class="{ active: formData.tagColor === color.value }"
                      :style="{ backgroundColor: color.bg }"
                      @click="formData.tagColor = color.value"
                  >
                    <svg v-if="color.value === 'none'" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="2" y1="2" x2="10" y2="10"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 数据库别名 -->
            <div v-if="activeTab === 'alias'" class="tab-content">
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
                <div v-if="formData.aliases && formData.aliases.length > 0" class="alias-list">
                  <div v-for="(alias, index) in formData.aliases" :key="index" class="alias-item">
                    <span>{{ alias }}</span>
                    <button type="button" class="alias-remove" @click="removeAlias(index)">×</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- SSL/TLS -->
            <div v-if="activeTab === 'ssl'" class="tab-content">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                      v-model="formData.ssl.enabled"
                      type="checkbox"
                      class="checkbox-input"
                  />
                  <span>启用SSL</span>
                </label>
              </div>

              <div class="form-group">
                <label>公钥文件</label>
                <div class="file-input-group">
                  <input
                      v-model="formData.ssl.certFile"
                      type="text"
                      placeholder="PEM格式公钥文件(Cert)"
                      class="form-input"
                  />
                  <button type="button" class="btn-browse" @click="browseFile('cert')">...</button>
                </div>
              </div>

              <div class="form-group">
                <label>私钥文件</label>
                <div class="file-input-group">
                  <input
                      v-model="formData.ssl.keyFile"
                      type="text"
                      placeholder="PEM格式私钥文件(Key)"
                      class="form-input"
                  />
                  <button type="button" class="btn-browse" @click="browseFile('key')">...</button>
                </div>
              </div>

              <div class="form-group">
                <label>授权文件</label>
                <div class="file-input-group">
                  <input
                      v-model="formData.ssl.caFile"
                      type="text"
                      placeholder="PEM格式授权文件(CA)"
                      class="form-input"
                  />
                  <button type="button" class="btn-browse" @click="browseFile('ca')">...</button>
                </div>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input
                      v-model="formData.ssl.rejectUnauthorized"
                      type="checkbox"
                      class="checkbox-input"
                  />
                  <span>允许不安全连接</span>
                </label>
              </div>

              <div class="form-group">
                <label>服务器名(SNI)</label>
                <input
                    v-model="formData.ssl.servername"
                    type="text"
                    placeholder="服务器名(SNI)"
                    class="form-input"
                />
              </div>
            </div>

            <!-- SSH隧道 -->
            <div v-if="activeTab === 'ssh'" class="tab-content">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                      v-model="formData.ssh.enabled"
                      type="checkbox"
                      class="checkbox-input"
                  />
                  <span>启用SSH隧道</span>
                </label>
              </div>

              <div class="form-group">
                <label>连接地址</label>
                <div class="address-input-group">
                  <input
                      v-model="formData.ssh.host"
                      type="text"
                      placeholder="SSH地址"
                      class="form-input address-input"
                  />
                  <span class="address-separator">:</span>
                  <input
                      v-model.number="formData.ssh.port"
                      type="number"
                      placeholder="22"
                      class="form-input port-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>登录类型</label>
                <div class="toggle-group">
                  <button
                      type="button"
                      class="toggle-btn"
                      :class="{ active: formData.ssh.authType === 'password' }"
                      @click="formData.ssh.authType = 'password'"
                  >
                    密码
                  </button>
                  <button
                      type="button"
                      class="toggle-btn"
                      :class="{ active: formData.ssh.authType === 'key' }"
                      @click="formData.ssh.authType = 'key'"
                  >
                    私钥文件
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>用户名</label>
                <input
                    v-model="formData.ssh.username"
                    type="text"
                    placeholder="SSH登录用户名"
                    class="form-input"
                />
              </div>

              <div v-if="formData.ssh.authType === 'password'" class="form-group">
                <label>密码</label>
                <div class="password-input-group">
                  <input
                      v-model="formData.ssh.password"
                      :type="showSshPassword ? 'text' : 'password'"
                      placeholder="SSH登录密码"
                      class="form-input"
                  />
                  <button
                      type="button"
                      class="password-toggle"
                      @click="showSshPassword = !showSshPassword"
                  >
                    <svg v-if="showSshPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="formData.ssh.authType === 'key'" class="form-group">
                <label>私钥文件</label>
                <div class="file-input-group">
                  <input
                      v-model="formData.ssh.privateKeyFile"
                      type="text"
                      placeholder="SSH私钥文件路径"
                      class="form-input"
                  />
                  <button type="button" class="btn-browse" @click="browseFile('sshKey')">...</button>
                </div>
              </div>
            </div>

            <!-- 哨兵模式 -->
            <div v-if="activeTab === 'sentinel'" class="tab-content">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                      v-model="formData.sentinel.enabled"
                      type="checkbox"
                      class="checkbox-input"
                  />
                  <span>当前为哨兵节点</span>
                </label>
              </div>

              <div class="form-group">
                <label>主节点组名</label>
                <div class="master-group-input">
                  <input
                      v-model="formData.sentinel.masterGroup"
                      type="text"
                      placeholder="mymaster"
                      class="form-input"
                  />
                  <button type="button" class="btn-auto-query">自动查询组名</button>
                </div>
              </div>

              <div class="form-group">
                <label>主节点密码</label>
                <div class="password-input-group">
                  <input
                      v-model="formData.sentinel.masterPassword"
                      :type="showSentinelPassword ? 'text' : 'password'"
                      placeholder="(可选)主节点服务授权密码 (Redis > 6.0)"
                      class="form-input"
                  />
                  <button
                      type="button"
                      class="password-toggle"
                      @click="showSentinelPassword = !showSentinelPassword"
                  >
                    <svg v-if="showSentinelPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>主节点用户名</label>
                <input
                    v-model="formData.sentinel.masterUsername"
                    type="text"
                    placeholder="(可选)主节点服务授权用户名"
                    class="form-input"
                />
              </div>
            </div>

            <!-- 集群模式 -->
            <div v-if="activeTab === 'cluster'" class="tab-content">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                      v-model="formData.cluster.enabled"
                      type="checkbox"
                      class="checkbox-input"
                  />
                  <span>当前为集群节点</span>
                </label>
              </div>
            </div>

            <!-- 网络代理 -->
            <div v-if="activeTab === 'proxy'" class="tab-content">
              <div class="form-group">
                <label>代理配置</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input
                        v-model="formData.proxy.type"
                        type="radio"
                        value="none"
                        class="radio-input"
                    />
                    <span>不使用代理</span>
                  </label>
                  <label class="radio-label">
                    <input
                        v-model="formData.proxy.type"
                        type="radio"
                        value="system"
                        class="radio-input"
                    />
                    <span>使用系统代理设置</span>
                  </label>
                  <label class="radio-label">
                    <input
                        v-model="formData.proxy.type"
                        type="radio"
                        value="manual"
                        class="radio-input"
                    />
                    <span>手动配置代理</span>
                  </label>
                </div>
              </div>

              <template v-if="formData.proxy.type === 'manual'">
                <div class="form-group">
                  <label>代理类型</label>
                  <select v-model="formData.proxy.protocol" class="form-input">
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="socks4">SOCKS4</option>
                    <option value="socks5">SOCKS5</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>主机名</label>
                  <div class="address-input-group">
                    <input
                        v-model="formData.proxy.host"
                        type="text"
                        placeholder="代理主机名"
                        class="form-input address-input"
                    />
                    <span class="address-separator">:</span>
                    <input
                        v-model.number="formData.proxy.port"
                        type="number"
                        placeholder="0"
                        class="form-input port-input"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="checkbox-label">
                    <input
                        v-model="formData.proxy.authEnabled"
                        type="checkbox"
                        class="checkbox-input"
                    />
                    <span>使用身份验证</span>
                  </label>
                </div>

                <template v-if="formData.proxy.authEnabled">
                  <div class="form-group">
                    <label>用户名</label>
                    <input
                        v-model="formData.proxy.username"
                        type="text"
                        placeholder="代理授权用户名"
                        class="form-input"
                    />
                  </div>

                  <div class="form-group">
                    <label>密码</label>
                    <div class="password-input-group">
                      <input
                          v-model="formData.proxy.password"
                          :type="showProxyPassword ? 'text' : 'password'"
                          placeholder="代理授权密码"
                          class="form-input"
                      />
                      <button
                          type="button"
                          class="password-toggle"
                          @click="showProxyPassword = !showProxyPassword"
                      >
                        <svg v-if="showProxyPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="dialog-footer">
          <button type="button" class="btn btn-secondary" @click="testConnection">
            测试连接
          </button>
          <button type="button" class="btn btn-secondary" @click="parseClipboardUrl">
            解析剪切板中的URL
          </button>
          <button type="button" class="btn btn-cancel" @click="handleCancel">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, computed} from 'vue'
import {getGroups} from '../utils/storage.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  connection: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'submit', 'cancel'])

const activeTab = ref('general')
const showPassword = ref(false)
const showSshPassword = ref(false)
const showSentinelPassword = ref(false)
const showProxyPassword = ref(false)
const newAlias = ref('')
const isEdit = ref(false)

const tabs = [
  {id: 'general', label: '常规配置'},
  {id: 'advanced', label: '高级配置'},
  {id: 'alias', label: '数据库别名'},
  {id: 'ssl', label: 'SSL/TLS'},
  {id: 'ssh', label: 'SSH隧道'},
  {id: 'sentinel', label: '哨兵模式'},
  {id: 'cluster', label: '集群模式'},
  {id: 'proxy', label: '网络代理'}
]

const colors = [
  {value: 'none', bg: '#000000'},
  {value: 'red', bg: '#f44336'},
  {value: 'orange', bg: '#ff9800'},
  {value: 'yellow', bg: '#ffeb3b'},
  {value: 'green', bg: '#4caf50'},
  {value: 'blue', bg: '#2196f3'},
  {value: 'purple', bg: '#9c27b0'}
]

const groups = computed(() => getGroups())

const formData = ref({
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
  ssl: {
    enabled: false,
    certFile: '',
    keyFile: '',
    caFile: '',
    rejectUnauthorized: false,
    servername: ''
  },
  ssh: {
    enabled: false,
    host: '',
    port: 22,
    authType: 'password',
    username: '',
    password: '',
    privateKeyFile: ''
  },
  sentinel: {
    enabled: false,
    masterGroup: 'mymaster',
    masterPassword: '',
    masterUsername: ''
  },
  cluster: {
    enabled: false
  },
  proxy: {
    type: 'none',
    protocol: 'http',
    host: '',
    port: 0,
    authEnabled: false,
    username: '',
    password: ''
  }
})

// 监听 connection 变化，填充表单
watch(() => props.connection, (newConnection) => {
  if (newConnection) {
    isEdit.value = true
    Object.assign(formData.value, {
      name: newConnection.name || '',
      groupId: newConnection.groupId || null,
      protocol: newConnection.protocol || 'tcp',
      host: newConnection.host || '127.0.0.1',
      port: newConnection.port || 6379,
      password: newConnection.password || '',
      username: newConnection.username || '',
      keyFilter: newConnection.keyFilter || '*',
      keySeparator: newConnection.keySeparator || ':',
      connectTimeout: newConnection.connectTimeout || 60,
      executeTimeout: newConnection.executeTimeout || 60,
      keyView: newConnection.keyView || 'tree',
      keysPerLoad: newConnection.keysPerLoad || 10000,
      dbFilter: newConnection.dbFilter || 'all',
      tagColor: newConnection.tagColor || 'none',
      aliases: newConnection.aliases || [],
      ssl: newConnection.ssl || {
        enabled: false,
        certFile: '',
        keyFile: '',
        caFile: '',
        rejectUnauthorized: false,
        servername: ''
      },
      ssh: newConnection.ssh || {
        enabled: false,
        host: '',
        port: 22,
        authType: 'password',
        username: '',
        password: '',
        privateKeyFile: ''
      },
      sentinel: newConnection.sentinel || {
        enabled: false,
        masterGroup: 'mymaster',
        masterPassword: '',
        masterUsername: ''
      },
      cluster: newConnection.cluster || {
        enabled: false
      },
      proxy: newConnection.proxy || {
        type: 'none',
        protocol: 'http',
        host: '',
        port: 0,
        authEnabled: false,
        username: '',
        password: ''
      }
    })
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

function resetForm() {
  formData.value = {
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
    ssl: {
      enabled: false,
      certFile: '',
      keyFile: '',
      caFile: '',
      rejectUnauthorized: false,
      servername: ''
    },
    ssh: {
      enabled: false,
      host: '',
      port: 22,
      authType: 'password',
      username: '',
      password: '',
      privateKeyFile: ''
    },
    sentinel: {
      enabled: false,
      masterGroup: 'mymaster',
      masterPassword: '',
      masterUsername: ''
    },
    cluster: {
      enabled: false
    },
    proxy: {
      type: 'none',
      protocol: 'http',
      host: '',
      port: 0,
      authEnabled: false,
      username: '',
      password: ''
    }
  }
  newAlias.value = ''
}

function addAlias() {
  if (newAlias.value.trim()) {
    if (!formData.value.aliases) {
      formData.value.aliases = []
    }
    formData.value.aliases.push(newAlias.value.trim())
    newAlias.value = ''
  }
}

function removeAlias(index) {
  formData.value.aliases.splice(index, 1)
}

function browseFile(type) {
  // TODO: 实现文件选择对话框
  console.log('浏览文件:', type)
}

function testConnection() {
  // TODO: 实现测试连接功能
  console.log('测试连接:', formData.value)
}

function parseClipboardUrl() {
  // TODO: 实现解析剪切板URL功能
  console.log('解析剪切板URL')
}

function handleSubmit() {
  emit('submit', {...formData.value})
  emit('update:visible', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dialog-container {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dialog-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
}

.dialog-close:hover {
  background: #f0f0f0;
  color: #333;
}

.dialog-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.nav-sidebar {
  width: 180px;
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  padding: 16px 0;
  overflow-y: auto;
}

.nav-item {
  padding: 12px 20px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #eeeeee;
  color: #333;
}

.nav-item.active {
  background: #fff;
  color: #e53935;
  border-left-color: #e53935;
  font-weight: 500;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

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

.password-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-group .form-input {
  padding-right: 40px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
}

.password-toggle:hover {
  background: #f0f0f0;
  color: #333;
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

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.radio-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.file-input-group {
  display: flex;
  gap: 8px;
}

.file-input-group .form-input {
  flex: 1;
}

.btn-browse {
  padding: 10px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  white-space: nowrap;
}

.btn-browse:hover {
  border-color: #999;
  background: #f5f5f5;
}

.alias-input-group {
  display: flex;
  gap: 8px;
}

.alias-input-group .form-input {
  flex: 1;
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

.master-group-input {
  display: flex;
  gap: 8px;
}

.master-group-input .form-input {
  flex: 1;
}

.btn-auto-query {
  padding: 10px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  white-space: nowrap;
}

.btn-auto-query:hover {
  border-color: #999;
  background: #f5f5f5;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f5f5f5;
  border-color: #999;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #f5f5f5;
  border-color: #999;
}

.btn-primary {
  background: #e53935;
  color: white;
}

.btn-primary:hover {
  background: #c62828;
  box-shadow: 0 2px 8px rgba(229, 57, 53, 0.3);
}
</style>
