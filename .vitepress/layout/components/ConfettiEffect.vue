<script setup lang="ts">
import { inBrowser } from 'vitepress'
import { onMounted } from 'vue'

// 纸屑效果组件
onMounted(() => {
  if (inBrowser) {
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 170,
        origin: { y: 0.6 },
      })
    })
  }
})
</script>

<template>
  <!-- 纸屑效果组件不渲染任何内容，只是负责触发效果 -->
</template>
