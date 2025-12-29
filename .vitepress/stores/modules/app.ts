import { defineStore } from 'pinia'

interface StateVO {
  activeName?: string
  selectedCategory?: string
  listDrawerVisible?: boolean
}

// 本地存储键名
const STORAGE_KEYS = {
  SELECTED_CATEGORY: 'jishu-selected-category',
  LIST_DRAWER_VISIBLE: 'jishu-list-drawer-visible'
}

// 持久化工具函数
const storage = {
  get<T>(key: string): T | undefined {
    if (typeof window === 'undefined') return undefined
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : undefined
    } catch {
      return undefined
    }
  },
  
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 忽略存储错误
    }
  },
  
  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  }
}

export const useAppStore = defineStore('app', {
  state: (): StateVO => {
    // 初始化时从本地存储恢复状态
    return {
      activeName: storage.get<string>(STORAGE_KEYS.SELECTED_CATEGORY),
      selectedCategory: storage.get<string>(STORAGE_KEYS.SELECTED_CATEGORY),
      listDrawerVisible: storage.get<boolean>(STORAGE_KEYS.LIST_DRAWER_VISIBLE) || false,
    }
  },
  
  getters: {
    getActiveName(): string | undefined {
      return this.activeName
    },
    
    getSelectedCategory(): string | undefined {
      return this.selectedCategory
    },
    
    getListDrawerVisible(): boolean {
      return this.listDrawerVisible || false
    }
  },
  
  actions: {
    setActiveName(name?: string) {
      this.activeName = name
      this.selectedCategory = name
      storage.set(STORAGE_KEYS.SELECTED_CATEGORY, name)
    },
    
    setSelectedCategory(category?: string) {
      this.selectedCategory = category
      this.activeName = category
      storage.set(STORAGE_KEYS.SELECTED_CATEGORY, category)
    },
    
    setListDrawerVisible(visible: boolean) {
      this.listDrawerVisible = visible
      storage.set(STORAGE_KEYS.LIST_DRAWER_VISIBLE, visible)
    },
    
    toggleListDrawer() {
      this.setListDrawerVisible(!this.getListDrawerVisible())
    },
    
    openListDrawer(category?: string) {
      if (category) {
        this.setSelectedCategory(category)
      }
      this.setListDrawerVisible(true)
    },
    
    closeListDrawer() {
      this.setListDrawerVisible(false)
    }
  },
})
