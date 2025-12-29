<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 处理按钮点击事件
function handleClick(e: MouseEvent) {
  e.preventDefault()
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="fixed-edit-btn" @click="handleClick($event)">
    <el-icon size="24">
      <Edit />
    </el-icon>
  </div>
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
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--el-box-shadow);
  }
}
</style>