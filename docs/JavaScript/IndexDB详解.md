

# IndexDB 详解

# 浏览器数据库集成教程（以 IndexedDB 为例）

本教程介绍如何在 Vue 3 + Vite 项目中集成浏览器数据库功能，推荐使用 [idb](https://github.com/jakearchibald/idb) 这个轻量级 TypeScript 库来简化 IndexedDB 的操作。

## 1. 安装依赖

```bash
pnpm add idb
```

## 2. 创建数据库工具模块

在 `src/utils` 目录下新建 `db.ts`：



## 5. 推荐实践

- 所有数据库操作建议封装在独立的工具模块，便于维护和复用。
- 使用 TypeScript 接口定义数据结构，提升类型安全。
- 结合 VueUse 的 `useAsyncState` 实现响应式异步数据加载。
- 对于大数据量建议分页或懒加载，避免一次性读取全部数据。

## 6. 参考资料

- [idb 官方文档](https://github.com/jakearchibald/idb)
- [MDN IndexedDB 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)
- [VueUse useAsyncState](https://vueuse.org/core/useAsyncState/)

---

如需更复杂的数据结构或事务支持，可参考 idb 文档或进一步封装 API。

1. **重构为类**：将数据库操作封装为 `AppDatabase` 类，便于实例化和复用。
2. **常量抽离**：将数据库名、版本、表名等常量单独定义，方便维护和扩展。
3. **类型安全**：继续使用 TypeScript 接口，保证类型安全。
4. **灵活复用**：支持传入自定义数据库名和版本，便于多库场景。

需求点支持: 

- 支持数据库名称、版本、表名通过构造参数传入。
- 表字段类型可自定义（通过泛型约束）。
- 方法包含增删改查（CRUD）。
- 常量抽离，结构清晰，灵活复用。

下面是支持多表（objectStore）和多字段类型的数据库类实现，包含类型安全、运行时错误处理、灵活增删改查，并支持在同一个数据库中动态添加多个表和索引。

```ts
import { openDB, } from 'idb';
import type { IDBPDatabase, DBSchema, StoreNames, IndexNames, IndexKey, StoreValue } from 'idb';


// 默认常量
const DEFAULT_DB_VERSION = 1;

// 多表结构定义
export interface StoreConfig {
  keyPath: string;
  indexes?: Record<string, string>;
}

// 多表配置类型
export type StoresConfig = Record<string, StoreConfig>;

// 通用数据库类，支持多表和自定义字段类型
export class MultiStoreDatabase<T extends DBSchema> {
  private dbName: string;
  private dbVersion: number;
  private stores: StoresConfig;
  private dbPromise: Promise<IDBPDatabase<T>> | null = null;

  constructor(options: {
    dbName: string;
    dbVersion?: number;
    stores: StoresConfig;
  }) {
    this.dbName = options.dbName;
    this.dbVersion = options.dbVersion ?? DEFAULT_DB_VERSION;
    this.stores = options.stores;
  }

  private getDB() {
    if (!this.dbPromise) {
      this.dbPromise = openDB<T>(this.dbName, this.dbVersion, {
        upgrade: (db) => {
          Object.entries(this.stores).forEach(([storeName, config]) => {
            if (!db.objectStoreNames.contains(storeName as StoreNames<T>)) {
              const store = db.createObjectStore(storeName as StoreNames<T>, { keyPath: config.keyPath });
              if (config.indexes) {
                Object.entries(config.indexes).forEach(([indexName, keyPath]) => {
                  store.createIndex(indexName as IndexNames<T, StoreNames<T>>, keyPath);
                });
              }
            }
          });
        },
      });
    }
    return this.dbPromise;
  }

  // 增
  async add<K extends keyof T>(storeName: K, item: T[K]['value']) {
    try {
      if (!item || typeof item !== 'object') throw new Error('Invalid item');
      const db = await this.getDB();
      await db.put(storeName as StoreNames<T>, item);
    } catch (error) {
      console.error('Add Error:', error);
      throw error;
    }
  }

  // 查（主键）
  async get<K extends keyof T>(storeName: K, key: Promise<StoreValue<T, StoreNames<T>>>) {
    try {
      const db = await this.getDB();
      return db.get(storeName as StoreNames<T>, await key);
    } catch (error) {
      console.error('Get Error:', error);
      throw error;
    }
  }

  // 查（索引）
  async getByIndex<K extends keyof T>(storeName: K, indexName: IndexNames<T, StoreNames<T>>, value: IndexKey<T, StoreNames<T>, IndexNames<T, StoreNames<T>>>) {
    try {
      const db = await this.getDB();
      return db.getFromIndex(storeName as StoreNames<T>, indexName, value);
    } catch (error) {
      console.error('GetByIndex Error:', error);
      throw error;
    }
  }

  // 查全部
  async getAll<K extends keyof T>(storeName: K) {
    try {
      const db = await this.getDB();
      return db.getAll(storeName as StoreNames<T>);
    } catch (error) {
      console.error('GetAll Error:', error);
      throw error;
    }
  }

  // 改
  async update<K extends keyof T>(storeName: K, item: T[K]['value']) {
    try {
      if (!item || typeof item !== 'object') throw new Error('Invalid item');
      const db = await this.getDB();
      await db.put(storeName as StoreNames<T>, item);
    } catch (error) {
      console.error('Update Error:', error);
      throw error;
    }
  }

  // 删
  async delete<K extends keyof T>(storeName: K, key: T[K]['key']) {
    try {
      const db = await this.getDB();
      await db.delete(storeName as StoreNames<T>, key);
    } catch (error) {
      console.error('Delete Error:', error);
      throw error;
    }
  }

  // 清空
  async clear<K extends keyof T>(storeName: K) {
    try {
      const db = await this.getDB();
      await db.clear(storeName as StoreNames<T>);
    } catch (error) {
      console.error('Clear Error:', error);
      throw error;
    }
  }
}

// 示例：自定义多表结构
export interface AppDBSchema extends DBSchema {
  users: {
    key: string;
    value: {
      id: number;
      name: string;
      email: string;
      age?: number;
    };
    indexes: { 'by-email': string };
  };
  posts: {
    key: string;
    value: {
      id: number;
      title: string;
      content: string;
      authorId: string;
    };
    indexes: { 'by-author': string };
  };
}

// 推荐单例用法
export const appDB = new MultiStoreDatabase<AppDBSchema>({
  dbName: 'app-db',
  stores: {
    users: { keyPath: 'id', indexes: { 'by-email': 'email' } },
    posts: { keyPath: 'id', indexes: { 'by-author': 'authorId' } },
  },
});
```

**用法示例：**

```js
import { appDB } from '@/utils/db';

// 用户表操作
await appDB.add('users', { id: '1', name: '张三', email: 'zhangsan@example.com' });
const user = await appDB.get('users', '1');
const userByEmail = await appDB.getByIndex('users', 'by-email', 'zhangsan@example.com');

// 帖子表操作
await appDB.add('posts', { id: '101', title: 'Hello', content: 'World', authorId: '1' });
const post = await appDB.get('posts', '101');
const postsByAuthor = await appDB.getByIndex('posts', 'by-author', '1');
```

这样即可在同一个数据库中灵活支持多表、多字段类型，并且类型安全、易扩展。

**在组件中使用**

```vue
<template>
  <div class="app">
    <h1>Global Props Demo</h1>

    <div class="controls">
      <label>
        <input type="checkbox" v-model="isLoading"> Loading
      </label>

      <select v-model="selectedTheme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>

    <SmartButton :loading="isLoading" :theme="selectedTheme" :track-id="buttonTrackId" :transition-duration="500"
      @click="handleButtonClick">
      Click Me
    </SmartButton>

    <p>Last event: {{ lastEvent }}</p>

    <SmartButton :loading="isLoading" :theme="selectedTheme" :track-id="buttonTrackId" :transition-duration="500"
      @click="handleAddUser">
      添加用户数据
    </SmartButton>

    <SmartButton :loading="isLoading" :theme="selectedTheme" :track-id="buttonTrackId" :transition-duration="500"
      @click="handleAddSchool">
      添加学校数据
    </SmartButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SmartButton from './components/SmartButton.vue'
import { appDB } from './utils/db';

export default defineComponent({
  name: 'App',

  components: {
    SmartButton
  },

  setup() {
    const isLoading = ref(false)
    const selectedTheme = ref<'light' | 'dark' | 'system'>('light')
    const buttonTrackId = ref('btn_primary')
    const lastEvent = ref('')
    const users = ref([]);

    const handleButtonClick = () => {
      lastEvent.value = `Button clicked at ${new Date().toLocaleTimeString()}`
      console.log('Track ID:', buttonTrackId.value)
    }

    let index = 0

    const handleAddUser = async () => {
      index += 1
      // // 增
      // console.log('allUsers', allUsers)

      // 用户表操作
      // await appDB.add('users', { id: index, name: '张三' + index, email: 'zhangsan' + index + '@example.com' });
      // const user = await appDB.get('users', 1);
      // const userByEmail = await appDB.getByIndex('users', 'by-email', 'zhangsan@example.com');

      // 帖子表操作
      await appDB.add('posts', { id: 101, title: 'Hello', content: 'World', authorId: '1' });

      // 帖子表操作
      // await appDB.add('posts', { id: '101', title: 'Hello', content: 'World', authorId: '1' });
      // const post = await appDB.get('posts', '101');
      // const postsByAuthor = await appDB.getByIndex('posts', 'by-author', '1');
    }

    let schoolIndex = 0

    const handleAddSchool = async () => {
      schoolIndex += 1
      // 增
      await schoolDB.add({ id: schoolIndex, name: '学校' + schoolIndex, email: 'school' + schoolIndex + '@example.com' });

      const allSchools = await schoolDB.getAll();
      console.log('allSchools', allSchools)
    }

    return {
      isLoading,
      selectedTheme,
      buttonTrackId,
      lastEvent,
      handleButtonClick,
      handleAddUser,
      handleAddSchool
    }
  }
})
</script>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 15px;
  align-items: center;
}

select {
  padding: 5px;
}
</style>
```

