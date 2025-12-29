<script setup lang="ts">
import { ArrowUpBold } from '@element-plus/icons-vue'
import Theme from 'vitepress/theme'
import { ref } from 'vue'

// 导入我们创建的组件
import ConfettiEffect from './components/ConfettiEffect.vue'
import DraggableSandbox from './components/DraggableSandbox.vue'
import HomeUnderlineWrapper from './components/HomeUnderlineWrapper.vue'
import SandboxDragButton from './components/SandboxDragButton.vue'
import TechnologyDrawer from './components/TechnologyDrawer.vue'
import ZoomHandler from './components/ZoomHandler.vue'

const { Layout } = Theme

// 控制抽屉状态
const listDrawerVisible = ref(false)
const editDrawerVisible = ref(false)
</script>

<template>
  <Layout v-bind="$attrs">
    <template #layout-top>
      <!-- 纸屑效果 -->
      <ConfettiEffect />

      <!-- 图片缩放处理 -->
      <ZoomHandler />

      <!-- 主页下划线处理 -->
      <HomeUnderlineWrapper />

      <!-- 技术文档列表 -->
      <TechnologyDrawer
        v-model="listDrawerVisible"
      />

      <!-- 可拖拽编辑器 -->
      <SandboxDragButton
        v-model="editDrawerVisible"
      />

      <!-- 可拖拽编辑器窗口 -->
      <DraggableSandbox
        v-model="editDrawerVisible"
      />

      <!-- 返回顶部按钮 -->
      <el-backtop>
        <div style="color: var(--vp-c-brand);">
          <el-icon size="24">
            <ArrowUpBold />
          </el-icon>
        </div>
      </el-backtop>
    </template>
  </Layout>
</template>
