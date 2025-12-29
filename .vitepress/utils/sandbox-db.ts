import type { DBSchema } from 'idb'
import { MultiStoreDatabase } from '../utils/db'

// 定义Sandbox代码存储的数据库结构
export interface SandboxDBSchema extends DBSchema {
  sandboxCodes: {
    key: string
    value: {
      path: string // 页面路径作为唯一标识
      template: string // 模板类型
      codes: Record<string, string> // 文件名到代码内容的映射
      updatedAt: number // 最后更新时间戳
    }
    indexes: { 'by-template': string }
  }
}

// 创建Sandbox数据库实例
export const sandboxDB = new MultiStoreDatabase<SandboxDBSchema>({
  dbName: 'sandbox-codes-db',
  stores: {
    sandboxCodes: {
      keyPath: 'path',
      indexes: { 'by-template': 'template' },
    },
  },
})

// 获取当前页面路径
export function getCurrentPath(): string {
  if (typeof window === 'undefined')
    return '/'
  return window.location.pathname
}

// 深度克隆并确保数据可序列化
function deepCloneAndSanitize(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // 如果是基本类型或函数，直接返回
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj
  }

  // 如果是数组，递归处理每个元素
  if (Array.isArray(obj)) {
    return obj.map(item => deepCloneAndSanitize(item))
  }

  // 如果是对象，创建新对象并递归处理每个属性
  const result: Record<string, any> = {}
  for (const key in obj) {
    // 跳过函数和Symbol类型的属性
    if (typeof obj[key] === 'function' || typeof key === 'symbol') {
      continue
    }
    result[key] = deepCloneAndSanitize(obj[key])
  }
  return result
}

// 保存代码到数据库
export async function saveSandboxCode(
  template: string,
  codes: Record<string, string>,
  path?: string,
): Promise<void> {
  try {
    const currentPath = path || getCurrentPath()

    // 确保codes是纯对象且只包含字符串值
    const sanitizedCodes: Record<string, string> = {}
    if (codes && typeof codes === 'object') {
      for (const fileName in codes) {
        if (typeof codes[fileName] === 'string') {
          sanitizedCodes[fileName] = codes[fileName]
        }
      }
    }

    const dataToSave = {
      path: currentPath,
      template,
      codes: sanitizedCodes,
      updatedAt: Date.now(),
    }

    // 使用深度克隆确保数据可序列化
    const clonedData = deepCloneAndSanitize(dataToSave)

    await sandboxDB.add('sandboxCodes', await Promise.resolve(clonedData))
  }
  catch (error) {
    console.error('Failed to save sandbox code:', error)
  }
}

// 从数据库获取代码
export async function getSandboxCode(
  path?: string,
): Promise<{ template: string, codes: Record<string, string> } | null> {
  try {
    const currentPath = path || getCurrentPath()
    const result = await sandboxDB.get('sandboxCodes', Promise.resolve(currentPath))
    if (result) {
      return {
        template: result.template,
        codes: result.codes,
      }
    }
    return null
  }
  catch (error) {
    console.error('Failed to get sandbox code:', error)
    return null
  }
}

// 清除当前页面的代码
export async function clearCurrentSandboxCode(path?: string): Promise<void> {
  try {
    const currentPath = path || getCurrentPath()
    await sandboxDB.delete('sandboxCodes', currentPath)
  }
  catch (error) {
    console.error('Failed to clear sandbox code:', error)
  }
}
