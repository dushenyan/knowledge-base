<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'

interface DocsTreeItem {
  title: string
  items?: DocsTreeItem[]
  children?: DocsTreeItem[]
  path?: string
  link?: string
  metadata?: Record<string, any>
}

const props = defineProps<{
  title?: string
  modules: DocsTreeItem[]
}>()

const appStore = useAppStore()

const formatTitle = computed(() => {
  return props.title ? props.title.replace(/\s+/g, '-').toLowerCase() : ''
})

const getItemCount = (item: DocsTreeItem): number => {
  const count = item.items?.length || item.children?.length || 0
  return count
}

// 处理卡片点击事件，打开侧边栏并设置选中的分类
const handleClick = (module: DocsTreeItem, event: MouseEvent) => {
  event.preventDefault()
  
  // 打开侧边栏并设置当前分类
  appStore.openListDrawer(module.title)
  
  // 触发全局事件，让layout组件知道需要显示侧边栏
  const customEvent = new CustomEvent('toggle-list-drawer', {
    detail: { show: true, category: module.title }
  })
  window.dispatchEvent(customEvent)
}
</script>

<template>
  <h2 v-if="title" :id="formatTitle" tabindex="-1" class="jishu-h2">
    {{ title }}
  </h2>
  <div class="jishu-card-grid">
    <div
      v-for="module in props.modules"
      :key="module.title"
      @click="handleClick(module, $event)"
      class="jishu-card"
      :class="{ 'has-items': getItemCount(module) > 0 }"
    >
      <div class="jishu-card-header">
        <span class="jishu-card-title">
          {{ module.title }}
        </span>
        <span v-if="getItemCount(module) > 0" class="jishu-card-count">
          {{ getItemCount(module) }}
        </span>
      </div>
      <div class="jishu-card-divider" />
      <p v-if="getItemCount(module) > 0" class="jishu-card-subtitle">
        包含 {{ getItemCount(module) }} 篇文章
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.jishu-h2 {
  border-top: none;
  font-size: 4.5rem;
  font-weight: 700;
  -webkit-text-stroke: 2px var(--vp-c-text-2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-bottom: 32px;
  margin-bottom: 16px;
  text-align: center;
  margin-top: 20px;
}

.jishu-card-grid {
  --jishu-card-gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--jishu-card-gap);
  margin-top: var(--jishu-card-gap);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 640px) {
  .jishu-card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .jishu-card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .jishu-card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.jishu-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--vp-c-brand-1);

    &::before {
      transform: translateY(0);
    }

    .jishu-card-title {
      color: var(--vp-c-brand-1);
    }

    .jishu-card-divider {
      width: 60px;
      background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
    }

    .jishu-card-count {
      background: var(--vp-c-brand-1);
      color: white;
      transform: scale(1.05);
    }
  }

  &.has-items {
    .jishu-card-header {
      margin-bottom: 12px;
    }
  }
}

.jishu-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
}

.jishu-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
  letter-spacing: -0.02em;
  flex: 1;
}

.jishu-card-count {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 24px;
  text-align: center;
}

.jishu-card-divider {
  width: 40px;
  height: 3px;
  background: var(--vp-c-divider);
  border-radius: 2px;
  transition: all 0.3s ease;
  margin: 8px 0;
}

.jishu-card-subtitle {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.jishu-card:hover .jishu-card-subtitle {
  opacity: 1;
}

/* 暗色主题适配 */
html.dark {
  .jishu-card {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    .jishu-card-count {
      background: var(--vp-c-bg-soft);
      color: var(--vp-c-text-2);
    }
  }
}

</style>
