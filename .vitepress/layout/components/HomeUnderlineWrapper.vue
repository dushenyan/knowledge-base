<script setup lang="ts">
import HomeUnderline from '@theme/components/HomeUnderline'
import { inBrowser, useData } from 'vitepress'

import { createApp, nextTick, watch } from 'vue'

const { frontmatter: fm } = useData()

// 执行 DOM 操作
function performDOMOperations() {
  nextTick(() => {
    // 先检查是否在浏览器环境
    if (inBrowser) {
      // 查找目标节点
      const oldNode = window.document.querySelector('.VPHero .tagline')
      if (oldNode && oldNode.parentNode) {
        // 创建并挂载应用
        const app = createApp(HomeUnderline, {
          fm: fm.value,
        })

        // 替换节点
        app.mount(oldNode)
        oldNode.parentNode.replaceChild(app._container as Node, oldNode)
      }
    }
  })
}

// 监听 frontmatter 变化
watch(
  fm,
  () => {
    performDOMOperations()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <!-- 这个组件不渲染任何内容，只负责处理 DOM 操作 -->
</template>
