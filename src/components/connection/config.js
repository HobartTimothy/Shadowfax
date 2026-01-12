// 连接配置相关的常量配置

export const TABS = [
  {id: 'general', label: '常规配置', component: 'GeneralConfig'},
  {id: 'advanced', label: '高级配置', component: 'AdvancedConfig'},
  {id: 'alias', label: '数据库别名', component: 'DatabaseAlias'},
  {id: 'ssl', label: 'SSL/TLS', component: 'SslConfig'},
  {id: 'ssh', label: 'SSH隧道', component: 'SshConfig'},
  {id: 'sentinel', label: '哨兵模式', component: 'SentinelConfig'},
  {id: 'cluster', label: '集群模式', component: 'ClusterConfig'},
  {id: 'proxy', label: '网络代理', component: 'ProxyConfig'}
]

export const DEFAULT_FORM_DATA = {
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

export const DEFAULT_SSL_CONFIG = {
  enabled: false,
  certFile: '',
  keyFile: '',
  caFile: '',
  rejectUnauthorized: false,
  servername: ''
}

export const DEFAULT_SSH_CONFIG = {
  enabled: false,
  host: '',
  port: 22,
  authType: 'password',
  username: '',
  password: '',
  privateKeyFile: ''
}

export const DEFAULT_SENTINEL_CONFIG = {
  enabled: false,
  masterGroup: 'mymaster',
  masterPassword: '',
  masterUsername: ''
}

export const DEFAULT_CLUSTER_CONFIG = {
  enabled: false
}

export const DEFAULT_PROXY_CONFIG = {
  type: 'none',
  protocol: 'http',
  host: '',
  port: 0,
  authEnabled: false,
  username: '',
  password: ''
}
