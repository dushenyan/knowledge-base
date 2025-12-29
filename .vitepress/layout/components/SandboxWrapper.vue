<script setup lang="ts">
import { Sandbox } from 'vitepress-plugin-sandpack'
import { ref, watch } from 'vue'

interface Props {
  template: string
  autorun?: boolean
  showLineNumbers?: boolean
  showRefreshButton?: boolean
  showConsoleButton?: boolean
  files?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  autorun: false,
  showLineNumbers: true,
  showRefreshButton: true,
  showConsoleButton: true,
})

// 获取Sandbox组件的引用
const sandboxRef = ref()

// 监听文件变化
watch(() => props.files, (newFiles) => {
  if (newFiles && Object.keys(newFiles).length > 0) {
    // 当外部文件变化时，更新Sandbox内容
    updateSandboxFiles(newFiles)
  }
}, { deep: true })

// 更新Sandbox中的文件内容
async function updateSandboxFiles(files: Record<string, string>) {
  if (!sandboxRef.value)
    return

  try {
    // 这里需要根据实际Sandbox组件的API来实现
    // 由于文档中没有明确的API，我们使用通用方法

    // 方法1: 尝试通过ref直接设置文件
    if (sandboxRef.value.setFiles) {
      sandboxRef.value.setFiles(files)
      return
    }

    // 方法2: 尝试通过内部属性设置
    if (sandboxRef.value.files !== undefined) {
      sandboxRef.value.files = files
      return
    }

    // 方法3: 尝试通过Sandpack实例设置
    if (sandboxRef.value.sandpack && sandboxRef.value.sandpack.setFiles) {
      sandboxRef.value.sandpack.setFiles(files)
    }
  }
  catch (error) {
    console.error('Failed to update sandbox files:', error)
  }
}
</script>

<template>
  <Sandbox
    ref="sandboxRef"
    :template="template"
    :autorun="autorun"
    :show-line-numbers="showLineNumbers"
    :show-refresh-button="showRefreshButton"
    :show-console-button="showConsoleButton"
  />
</template>
