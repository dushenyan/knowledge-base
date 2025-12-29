<script setup lang="ts">
import type { Zoom } from 'medium-zoom'
import mediumZoom from 'medium-zoom'
import { onContentUpdated } from 'vitepress'
import { onBeforeMount } from 'vue'

let zoom: Zoom

// 处理内容更新
onContentUpdated(() => {
  if (!zoom)
    return
  zoom.detach('.VPDoc img')
  zoom.attach('.VPDoc img')
})

// 初始化缩放功能
onBeforeMount(() => {
  zoom = mediumZoom(undefined, {
    background: 'rgba(0, 0, 0, .75)',
  })
})
</script>

<style lang="scss">
.medium-zoom-overlay {
  z-index: 1000;
}

.medium-zoom-image {
  z-index: 2000;
}
</style>
