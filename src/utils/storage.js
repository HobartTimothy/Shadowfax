/**
 * 本地存储工具类
 * 用于管理 Redis 连接配置的本地存储
 */

const STORAGE_KEY = 'shadowfax_connections'
const GROUPS_KEY = 'shadowfax_groups'

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
    groupId: connection.groupId || null,
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

// ==================== 分组相关函数 ====================

/**
 * 获取所有分组
 * @returns {Array} 分组列表
 */
export function getGroups() {
  try {
    const data = localStorage.getItem(GROUPS_KEY)
    if (!data) {
      return []
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('读取分组数据失败:', error)
    return []
  }
}

/**
 * 保存所有分组
 * @param {Array} groups 分组列表
 */
export function saveGroups(groups) {
  try {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups))
    return true
  } catch (error) {
    console.error('保存分组数据失败:', error)
    return false
  }
}

/**
 * 添加新分组
 * @param {Object} group 分组配置
 * @returns {Object} 添加后的分组（包含生成的 ID）
 */
export function addGroup(group) {
  const groups = getGroups()
  const newGroup = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: group.name || '未命名分组',
    parentId: group.parentId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...group
  }
  groups.push(newGroup)
  saveGroups(groups)
  return newGroup
}

/**
 * 更新分组
 * @param {string} id 分组 ID
 * @param {Object} updates 要更新的字段
 * @returns {Object|null} 更新后的分组，失败返回 null
 */
export function updateGroup(id, updates) {
  const groups = getGroups()
  const index = groups.findIndex(g => g.id === id)
  if (index === -1) {
    return null
  }
  groups[index] = {
    ...groups[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  saveGroups(groups)
  return groups[index]
}

/**
 * 删除分组
 * @param {string} id 分组 ID
 * @returns {boolean} 是否删除成功
 */
export function deleteGroup(id) {
  const groups = getGroups()
  const filtered = groups.filter(g => g.id !== id)
  if (filtered.length === groups.length) {
    return false // 未找到要删除的分组
  }
  // 同时删除所有子分组
  const childGroups = groups.filter(g => g.parentId === id)
  childGroups.forEach(child => deleteGroup(child.id))
  // 将属于该分组的连接移到根目录
  const connections = getConnections()
  connections.forEach(conn => {
    if (conn.groupId === id) {
      updateConnection(conn.id, { groupId: null })
    }
  })
  saveGroups(filtered)
  return true
}

/**
 * 根据 ID 获取分组
 * @param {string} id 分组 ID
 * @returns {Object|null} 分组对象，不存在返回 null
 */
export function getGroupById(id) {
  const groups = getGroups()
  return groups.find(g => g.id === id) || null
}

/**
 * 获取指定分组的子分组
 * @param {string} parentId 父分组 ID，null 表示根分组
 * @returns {Array} 子分组列表
 */
export function getChildGroups(parentId) {
  const groups = getGroups()
  return groups.filter(g => g.parentId === parentId)
}

