/**
 * 本地存储工具类
 * 用于管理 Redis 连接配置的本地存储
 */

const STORAGE_KEY = 'shadowfax_connections'

/**
 * 获取所有连接
 * @returns {Array} 连接列表
 */
export function getConnections() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return []
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('读取连接数据失败:', error)
    return []
  }
}

/**
 * 保存所有连接
 * @param {Array} connections 连接列表
 */
export function saveConnections(connections) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections))
    return true
  } catch (error) {
    console.error('保存连接数据失败:', error)
    return false
  }
}

/**
 * 添加新连接
 * @param {Object} connection 连接配置
 * @returns {Object} 添加后的连接（包含生成的 ID）
 */
export function addConnection(connection) {
  const connections = getConnections()
  const newConnection = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: connection.name || '未命名连接',
    host: connection.host || '127.0.0.1',
    port: connection.port || 6379,
    password: connection.password || '',
    username: connection.username || '',
    database: connection.database || 0,
    status: 'disconnected',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...connection
  }
  connections.push(newConnection)
  saveConnections(connections)
  return newConnection
}

/**
 * 更新连接
 * @param {string} id 连接 ID
 * @param {Object} updates 要更新的字段
 * @returns {Object|null} 更新后的连接，失败返回 null
 */
export function updateConnection(id, updates) {
  const connections = getConnections()
  const index = connections.findIndex(conn => conn.id === id)
  if (index === -1) {
    return null
  }
  connections[index] = {
    ...connections[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  saveConnections(connections)
  return connections[index]
}

/**
 * 删除连接
 * @param {string} id 连接 ID
 * @returns {boolean} 是否删除成功
 */
export function deleteConnection(id) {
  const connections = getConnections()
  const filtered = connections.filter(conn => conn.id !== id)
  if (filtered.length === connections.length) {
    return false // 未找到要删除的连接
  }
  saveConnections(filtered)
  return true
}

/**
 * 根据 ID 获取连接
 * @param {string} id 连接 ID
 * @returns {Object|null} 连接对象，不存在返回 null
 */
export function getConnectionById(id) {
  const connections = getConnections()
  return connections.find(conn => conn.id === id) || null
}

/**
 * 清空所有连接
 */
export function clearConnections() {
  localStorage.removeItem(STORAGE_KEY)
}

