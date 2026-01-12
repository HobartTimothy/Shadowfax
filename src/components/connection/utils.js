import {
  DEFAULT_FORM_DATA,
  DEFAULT_SSL_CONFIG,
  DEFAULT_SSH_CONFIG,
  DEFAULT_SENTINEL_CONFIG,
  DEFAULT_CLUSTER_CONFIG,
  DEFAULT_PROXY_CONFIG
} from './config.js'

/**
 * 深度合并对象，将源对象的属性合并到目标对象
 * @param {Object} target - 目标对象
 * @param {Object} source - 源对象
 * @returns {Object} 合并后的对象
 */
function deepMerge(target, source) {
  const result = {...target}
  
  for (const key in source) {
    if (source[key] === null || source[key] === undefined) {
      continue
    }
    
    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

/**
 * 创建默认表单数据
 * @returns {Object} 默认表单数据
 */
export function createDefaultFormData() {
  return JSON.parse(JSON.stringify(DEFAULT_FORM_DATA))
}

/**
 * 从连接对象创建表单数据
 * @param {Object|null} connection - 连接对象
 * @returns {Object} 表单数据
 */
export function createFormDataFromConnection(connection) {
  if (!connection) {
    return createDefaultFormData()
  }

  return deepMerge(createDefaultFormData(), {
    name: connection.name || '',
    groupId: connection.groupId || null,
    protocol: connection.protocol || 'tcp',
    host: connection.host || '127.0.0.1',
    port: connection.port || 6379,
    password: connection.password || '',
    username: connection.username || '',
    keyFilter: connection.keyFilter || '*',
    keySeparator: connection.keySeparator || ':',
    connectTimeout: connection.connectTimeout || 60,
    executeTimeout: connection.executeTimeout || 60,
    keyView: connection.keyView || 'tree',
    keysPerLoad: connection.keysPerLoad || 10000,
    dbFilter: connection.dbFilter || 'all',
    tagColor: connection.tagColor || 'none',
    aliases: connection.aliases || [],
    ssl: deepMerge(DEFAULT_SSL_CONFIG, connection.ssl || {}),
    ssh: deepMerge(DEFAULT_SSH_CONFIG, connection.ssh || {}),
    sentinel: deepMerge(DEFAULT_SENTINEL_CONFIG, connection.sentinel || {}),
    cluster: deepMerge(DEFAULT_CLUSTER_CONFIG, connection.cluster || {}),
    proxy: deepMerge(DEFAULT_PROXY_CONFIG, connection.proxy || {})
  })
}
