<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { SandpackPredefinedTemplate } from '../../types'
import { sandpackTemplateOptions } from '@config/emnus'
import { Edit } from '@element-plus/icons-vue'
import { useDraggable } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import {
  clearCurrentSandboxCode,
  getSandboxCode,
  saveSandboxCode,
} from '../../utils/sandbox-db'
import SandboxWrapper from './SandboxWrapper.vue'

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

// 存储代码状态
const savedCodes = ref<Record<string, string>>({})
const isCodeLoaded = ref(false)

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
  // 关闭前保存当前代码
  saveCurrentCode()
  emit('update:modelValue', false)
}

// 从数据库加载代码
async function loadSavedCode() {
  if (isCodeLoaded.value)
    return

  try {
    const saved = await getSandboxCode()
    if (saved) {
      savedCodes.value = saved.codes
      sandpackTemplateValue.value = saved.template as SandpackPredefinedTemplate

      ElMessage({
        message: '已恢复上次编辑的代码',
        type: 'success',
        duration: 2000,
      })
    }
    isCodeLoaded.value = true
  }
  catch (error) {
    console.error('Failed to load saved code:', error)
  }
}

// 保存当前代码到数据库
async function saveCurrentCode() {
  try {
    // 尝试从DOM手动获取编辑器中的代码
    const codeFromDOM = getEditorCodeFromDOM()
    if (codeFromDOM && Object.keys(codeFromDOM).length > 0) {
      console.log('Got code from DOM:', codeFromDOM)
      savedCodes.value = codeFromDOM
      await saveSandboxCode(sandpackTemplateValue.value, codeFromDOM)
      ElMessage({
        message: '代码已保存',
        type: 'success',
        duration: 2000,
      })
    } else {
      // 如果无法从DOM获取，使用现有保存的代码
      await saveSandboxCode(sandpackTemplateValue.value, savedCodes.value)
      ElMessage({
        message: '代码已保存',
        type: 'success',
        duration: 2000,
      })
    }
  }
  catch (error) {
    console.error('Failed to save code:', error)
  }
}

// 从DOM中提取编辑器代码
function getEditorCodeFromDOM(): Record<string, string> {
  const files: Record<string, string> = {}
  
  try {
    // 查找所有代码编辑器
    const codeEditors = document.querySelectorAll('.sp-stack, .cm-editor')
    console.log('Found code editors:', codeEditors)
    
    // 尝试获取每个编辑器的内容
    codeEditors.forEach((editor, index) => {
      // 查找编辑器内容区域
      const contentElement = editor.querySelector('.cm-content, .CodeMirror-code, .cm-line')
      if (contentElement && contentElement.textContent) {
        // 默认文件名
        let fileName = `File${index + 1}.js`
        
        // 尝试获取文件名（可能从标签页或标题中）
        const tabElement = editor.querySelector('.sp-tab, [data-testid="file-tab"], .tab')
        if (tabElement && tabElement.textContent) {
          fileName = tabElement.textContent.trim()
          if (!fileName.includes('.')) {
            fileName = `${fileName}.js`
          }
        }
        
        files[fileName] = contentElement.textContent
        console.log(`Extracted ${fileName}:`, `${contentElement.textContent?.substring(0, 50)}...`)
      }
    })
    
    // 如果没有找到编辑器，尝试其他方法
    if (Object.keys(files).length === 0) {
      // 查找所有可能包含代码的元素
      const codeElements = document.querySelectorAll('pre, code, .cm-line')
      codeElements.forEach((element, index) => {
        if (element.textContent && element.textContent.trim()) {
          files[`Code${index + 1}.txt`] = element.textContent.trim()
        }
      })
    }
  } catch (error) {
    console.error('Error getting code from DOM:', error)
  }
  
  return files
}

// 清除当前页面的代码
async function handleClearCode() {
  try {
    await clearCurrentSandboxCode()
    savedCodes.value = {}
    ElMessage({
      message: '已清除保存的代码',
      type: 'info',
      duration: 2000,
    })
  }
  catch (error) {
    console.error('Failed to clear code:', error)
  }
}

// 处理SandboxWrapper的文件更新事件
async function handleFilesUpdate(files: Record<string, string>) {
  console.log('DraggableSandbox received files update:', files)
  console.log('Files keys:', Object.keys(files))
  
  savedCodes.value = files
  try {
    await saveSandboxCode(sandpackTemplateValue.value, files)
  }
  catch (error) {
    console.error('Failed to save updated code:', error)
  }
}

// 监听全局鼠标移动和释放事件
onMounted(() => {
  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', endResize)

  // 当窗口打开时，加载保存的代码
  if (props.modelValue) {
    nextTick(() => {
      loadSavedCode()
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', endResize)

  // 组件卸载前保存代码
  saveCurrentCode()
})

// 监听窗口打开和关闭
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    nextTick(() => {
      loadSavedCode()
    })
  }
  else {
    saveCurrentCode()
  }
})

// 监听模板变化
watch(sandpackTemplateValue, () => {
  // 当模板改变时，保存代码
  saveCurrentCode()
})

// 监听页面路由变化，在路由变化时保存代码
watch(() => window.location.pathname, () => {
  saveCurrentCode()
  isCodeLoaded.value = false // 重置加载状态，以便在新页面重新加载
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

        <el-button
          type="primary"
          size="small"
          style="margin-left: 10px;"
          @click="saveCurrentCode"
        >
          保存代码
        </el-button>

        <el-button
          type="info"
          size="small"
          @click="handleClearCode"
        >
          清除代码
        </el-button>
      </div>

      <div class="sandbox-wrapper">
        <ClientOnly>
          <SandboxWrapper
            :template="sandpackTemplateValue"
            :autorun="false"
            :show-line-numbers="true"
            :show-refresh-button="true"
            :show-console-button="true"
            :files="savedCodes"
            @update:files="handleFilesUpdate"
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
