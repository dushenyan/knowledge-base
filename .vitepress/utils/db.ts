import type { DBSchema, IDBPDatabase, IndexKey, IndexNames, StoreKey, StoreNames, StoreValue } from 'idb'
import { openDB } from 'idb'

// 默认常量
const DEFAULT_DB_VERSION = 1

// 多表结构定义
export interface StoreConfig {
  keyPath: string
  indexes?: Record<string, string>
}

// 多表配置类型
export type StoresConfig = Record<string, StoreConfig>

// 通用数据库类，支持多表和自定义字段类型
export class MultiStoreDatabase<T extends DBSchema> {
  private dbName: string
  private dbVersion: number
  private stores: StoresConfig
  private dbPromise: Promise<IDBPDatabase<T>> | null = null

  constructor(options: {
    dbName: string
    dbVersion?: number
    stores: StoresConfig
  }) {
    this.dbName = options.dbName
    this.dbVersion = options.dbVersion ?? DEFAULT_DB_VERSION
    this.stores = options.stores
  }

  private getDB(): Promise<IDBPDatabase<T>> | null {
    if (!this.dbPromise) {
      this.dbPromise = openDB<T>(this.dbName, this.dbVersion, {
        upgrade: (db) => {
          Object.entries(this.stores).forEach(([storeName, config]) => {
            if (!db.objectStoreNames.contains(storeName as StoreNames<T>)) {
              const store = db.createObjectStore(storeName as StoreNames<T>, { keyPath: config.keyPath })
              if (config.indexes) {
                Object.entries(config.indexes).forEach(([indexName, keyPath]) => {
                  store.createIndex(indexName as IndexNames<T, StoreNames<T>>, keyPath)
                })
              }
            }
          })
        },
      })
    }
    return this.dbPromise
  }

  // 增
  async add<K extends keyof T>(storeName: K, item: T[K]['value']): Promise<any> {
    try {
      if (!item || typeof item !== 'object')
        throw new Error('Invalid item')
      const db = await this.getDB()
      if (db) {
        await db.put(storeName as StoreNames<T>, item)
      }
    }
    catch (error) {
      console.error('Add Error:', error)
      throw error
    }
  }

  // 查（主键）
  async get<K extends keyof T>(storeName: K, key: Promise<StoreValue<T, StoreNames<T>>>): Promise<StoreValue<T, StoreNames<T>> | undefined> {
    try {
      const db = await this.getDB()
      if (db) {
        return db.get(storeName as StoreNames<T>, await key)
      }
    }
    catch (error) {
      console.error('Get Error:', error)
      throw error
    }
  }

  // 查（索引）
  async getByIndex<K extends keyof T>(storeName: K, indexName: IndexNames<T, StoreNames<T>>, value: IndexKey<T, StoreNames<T>, IndexNames<T, StoreNames<T>>>): Promise<StoreValue<T, StoreNames<T>> | undefined> {
    try {
      const db = await this.getDB()
      if (db) {
        return db.getFromIndex(storeName as StoreNames<T>, indexName, value)
      }
    }
    catch (error) {
      console.error('GetByIndex Error:', error)
      throw error
    }
  }

  // 查全部
  async getAll<K extends keyof T>(storeName: K): Promise<StoreValue<T, StoreNames<T>>[] | undefined> {
    try {
      const db = await this.getDB()
      if (db) {
        return db.getAll(storeName as StoreNames<T>)
      }
    }
    catch (error) {
      console.error('GetAll Error:', error)
      throw error
    }
  }

  // 改
  async update<K extends keyof T>(storeName: K, item: T[K]['value']): Promise<void> {
    try {
      if (!item || typeof item !== 'object')
        throw new Error('Invalid item')
      const db = await this.getDB()
      if (db) {
        await db.put(storeName as StoreNames<T>, item)
      }
    }
    catch (error) {
      console.error('Update Error:', error)
      throw error
    }
  }

  // 删
  async delete<K extends keyof T>(storeName: K, key: StoreKey<T, StoreNames<T>> | IDBKeyRange): Promise<void> {
    try {
      const db = await this.getDB()
      if (db) {
        await db.delete(storeName as StoreNames<T>, key)
      }
    }
    catch (error) {
      console.error('Delete Error:', error)
      throw error
    }
  }

  // 清空
  async clear<K extends keyof T>(storeName: K): Promise<void> {
    try {
      const db = await this.getDB()
      if (db) {
        await db.clear(storeName as StoreNames<T>)
      }
    }
    catch (error) {
      console.error('Clear Error:', error)
      throw error
    }
  }
}

// 示例：自定义多表结构
export interface AppDBSchema extends DBSchema {
  users: {
    key: string
    value: {
      id: number
      name: string
      email: string
      age?: number
    }
    indexes: { 'by-email': string }
  }
  posts: {
    key: string
    value: {
      id: number
      title: string
      content: string
      authorId: string
    }
    indexes: { 'by-author': string }
  }
}

// 推荐单例用法
export const appDB = new MultiStoreDatabase<AppDBSchema>({
  dbName: 'app-db',
  stores: {
    users: { keyPath: 'id', indexes: { 'by-email': 'email' } },
    posts: { keyPath: 'id', indexes: { 'by-author': 'authorId' } },
  },
})
