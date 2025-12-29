<script setup lang="ts">
import type { SandpackPredefinedTemplate } from '../../types'
import { sandpackTemplateOptions } from '@config/emnus'
import { Edit } from '@element-plus/icons-vue'

import { computed, ref } from 'vue'

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sandpackTemplateValue = ref<SandpackPredefinedTemplate>('vite')

// 处理按钮点击事件
function handleClick(e: MouseEvent) {
  e.preventDefault()
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
}

// 双向绑定的计算属性
const editDrawerModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <div class="fixed-edit-btn" @click="handleClick($event)">
    <el-icon size="24">
      <Edit />
    </el-icon>
  </div>
  <el-drawer
    v-model="editDrawerModel" :with-header="false" append-to-body :close-on-click-modal="false"
    size="100%"
  >
    <div class="sandbox-container">
      <div class="sandbox-title">
        在线编辑
        <el-select v-model="sandpackTemplateValue" placeholder="Select" style="width: 240px">
          <el-option v-for="(item, index) in sandpackTemplateOptions" :key="index" :label="item" :value="item">
            {{ item }}
          </el-option>
        </el-select>
      </div>
      <div class="sandbox-content">
        <div class="sandbox">
          <ClientOnly>
            <Sandbox
              :template="sandpackTemplateValue" :autorun="false" show-line-numbers show-refresh-button
              show-console-button
            />
          </ClientOnly>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.fixed-edit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 40px;
  bottom: 100px;
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
}
</style>
