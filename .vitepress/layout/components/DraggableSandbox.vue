<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { SandpackPredefinedTemplate } from '../../types'
import { sandpackTemplateOptions } from '@config/emnus'
import { Edit } from '@element-plus/icons-vue'

import { useDraggable } from '@vueuse/core'

import { Sandbox } from 'vitepress-plugin-sandpack'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sandpackTemplateValue = ref<SandpackPredefinedTemplate>('static')
const isMinimized = ref(false)
const isResizing = ref(false)
const position = ref({ x: window.innerWidth - 420, y: 100 })
const size = ref({ width: 400, height: window.innerHeight * 0.6 })

// 获取窗口元素的引用
const windowEl = ref<HTMLElement>()
const headerEl = ref<HTMLElement>()

// 可拖拽功能 - 只允许通过标题栏拖拽
const { x: dragX, y: dragY } = useDraggable(headerEl, {
  initialValue: position.value,
  preventDefault: true,
})

// 开始调整大小
function startResize(e: MouseEvent) {
  e.stopPropagation() // 阻止事件冒泡到拖拽事件
  isResizing.value = true
  document.body.style.cursor = 'nwse-resize'
  e.preventDefault()
}

// 结束调整大小
function endResize() {
  isResizing.value = false
  document.body.style.cursor = ''
}

// 处理调整大小
function handleResize(e: MouseEvent) {
  if (!isResizing.value)
    return
  e.preventDefault()

  const rect = windowEl.value?.getBoundingClientRect()
  if (!rect)
    return

  const newWidth = Math.max(300, e.clientX - rect.left)
  const newHeight = Math.max(200, e.clientY - rect.top)

  size.value = {
    width: newWidth,
    height: newHeight,
  }
}

// 计算样式
const windowStyle = computed<StyleValue>(() => ({
  position: 'fixed',
  top: '0',
  left: '0',
  width: `${size.value.width}px`,
  height: `${size.value.height}px`,
  zIndex: 9999,
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
  transform: isMinimized.value
    ? `translate(${dragX.value}px, ${window.innerHeight - 60}px)`
    : `translate(${dragX.value}px, ${dragY.value}px)`,
  transition: isMinimized.value ? 'transform 0.3s ease' : 'none',
  backgroundColor: 'var(--vp-c-bg)',
  border: '1px solid var(--vp-c-border)',
  display: props.modelValue ? 'block' : 'none',
}))

function handleMinimize() {
  isMinimized.value = !isMinimized.value
}

function handleMaximize() {
  size.value = { width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 }
}

function handleClose() {
  emit('update:modelValue', false)
}

// 监听全局鼠标移动和释放事件
onMounted(() => {
  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', endResize)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', endResize)
})

// 监听窗口大小变化，防止窗口超出边界
watchEffect(() => {
  if (dragX.value + size.value.width > window.innerWidth) {
    dragX.value = window.innerWidth - size.value.width - 20
  }
  if (dragY.value + size.value.height > window.innerHeight) {
    dragY.value = window.innerHeight - size.value.height - 20
  }

  // 确保窗口不会超出左上角边界
  if (dragX.value < 0) {
    dragX.value = 0
  }
  if (dragY.value < 0) {
    dragY.value = 0
  }
})
</script>

<template>
  <div ref="windowEl" class="sandbox-draggable" :style="windowStyle">
    <!-- 标题栏 -->
    <div
      ref="headerEl"
      class="sandbox-header"
    >
      <div class="header-title">
        <el-icon size="18">
          <Edit />
        </el-icon>
        <span>在线编辑器</span>
      </div>

      <div class="header-controls">
        <button class="control-btn" @mousedown.stop @click="handleMinimize">
          {{ isMinimized ? '□' : '_' }}
        </button>
        <button class="control-btn" @mousedown.stop @click="handleMaximize">
          □
        </button>
        <button class="control-btn close" @mousedown.stop @click="handleClose">
          ×
        </button>
      </div>
    </div>

    <!-- 内容区 - 最小化时隐藏 -->
    <div v-show="!isMinimized" class="sandbox-content">
      <div class="sandbox-toolbar">
        <el-select v-model="sandpackTemplateValue" placeholder="选择模板" size="small" style="width: 150px;">
          <el-option
            v-for="(item, index) in sandpackTemplateOptions"
            :key="index"
            :label="item"
            :value="item"
          >
            {{ item }}
          </el-option>
        </el-select>
      </div>

      <div class="sandbox-wrapper">
        <ClientOnly>
          <Sandbox
            :template="sandpackTemplateValue"
            :autorun="false"
            show-line-numbers
            show-refresh-button
            show-console-button
          />
        </ClientOnly>
      </div>
    </div>

    <!-- 调整大小手柄 -->
    <div class="resize-handle" @mousedown="startResize" />
  </div>
</template>

<style lang="scss" scoped>
.sandbox-draggable {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.sandbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vp-c-brand);
  color: white;
  cursor: move;
  user-select: none;
  border-bottom: 1px solid var(--vp-c-brand);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.header-controls {
  display: flex;
  gap: 6px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 22px;
  height: 18px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &.close {
    &:hover {
      background: rgba(255, 59, 48, 0.8);
    }
  }
}

.sandbox-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 36px); /* 减去标题栏高度 */
}

.sandbox-toolbar {
  padding: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.sandbox-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

// 调整大小手柄
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: linear-gradient(135deg, transparent 50%, var(--vp-c-brand) 50%);
  border-radius: 0 0 8px 0;
  opacity: 0.7;
  transition: opacity 0.2s;
  z-index: 10;

  &:hover {
    opacity: 1;
  }
}
</style>
