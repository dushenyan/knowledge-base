<script setup lang="ts">
import { List } from '@element-plus/icons-vue'

import { EmitType, useEmits } from '@theme/hooks/useEmits'
import { inBrowser } from 'vitepress'
import { computed, watch } from 'vue'
import { useAppStore } from '@/stores'

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const appStore = useAppStore()

const activeName = computed(() => appStore.getActiveName)

// 处理按钮点击事件
function handleClick(e: MouseEvent) {
  e.preventDefault()
  const newValue = !props.modelValue
  appStore.setListDrawerVisible(newValue)
  emit('update:modelValue', newValue)

  useEmits({
    name: EmitType.ListDrawerClose,
    onCallback: (_val: any) => {
      appStore.setListDrawerVisible(false)
      emit('update:modelValue', false)
    },
  })
}

// 双向绑定的计算属性
const drawerModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  },
})

// 监听全局事件来控制侧边栏
if (inBrowser) {
  window.addEventListener('toggle-list-drawer', (event: any) => {
    const { show, category } = event.detail || {}
    appStore.setListDrawerVisible(show || false)
    emit('update:modelValue', show || false)

    if (category) {
      appStore.setSelectedCategory(category)
    }
  })
}

// 监听store中的侧边栏状态变化
watch(() => appStore.getListDrawerVisible, (visible) => {
  emit('update:modelValue', visible)
})
</script>

<template>
  <div class="fixed-list-btn" @click="handleClick($event)">
    <el-icon size="24">
      <List />
    </el-icon>
  </div>
  <el-drawer
    v-model="drawerModel"
    :with-header="false"
    append-to-body
    size="60%"
  >
    <div class="list-container">
      <h3>{{ activeName }}</h3>
      <PageTable :active-name="activeName" />
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.fixed-list-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 40px;
  bottom: 160px;
  height: 40px;
  width: 40px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-lighter);
  text-align: center;
  line-height: 40px;
  color: var(--vp-c-brand);
  cursor: pointer;
  z-index: 9999;
  border-radius: 50%;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--el-box-shadow);
  }
}

.list-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--vp-c-brand);
  font-weight: 600;
  font-size: 18px;
  border-bottom: 1px solid var(--vp-c-border);
  padding-bottom: 10px;
}
</style>
