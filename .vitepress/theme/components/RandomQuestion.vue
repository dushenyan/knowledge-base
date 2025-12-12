<script setup lang="ts">
import type { EnhancedDocsTreeDataVO } from '../../types/index'
import { useRouter } from 'vitepress'
import { computed, onMounted, ref } from 'vue'
import docsTree from '@/config/docsTree.json'

defineOptions({
  name: 'RandomQuestion',
})

interface QuestionItem extends EnhancedDocsTreeDataVO {
  category: string
}

const router = useRouter()

const selectedQuestion = ref<QuestionItem | null>(null)
const isLoading = ref(true)

// 获取所有有效的题目
function getAllQuestions(): QuestionItem[] {
  const questions: QuestionItem[] = []

  if (!Array.isArray(docsTree))
    return questions

  docsTree.forEach((category) => {
    // 过滤掉 nav 分类
    if (category.title === 'nav')
      return

    // 过滤掉 random-questions 本身（它不是分类，是一个单独的页面）
    if (category.title === 'random-questions')
      return

    // 只处理有 items 且 items 不为空的分类
    if (!category.items || category.items.length === 0)
      return

    // 收集该分类下的所有题目
    category.items.forEach((item) => {
      // 只收集有 link 的项（有效的文档）
      if (item.link) {
        questions.push({
          ...item,
          category: category.title,
        })
      }
    })
  })

  return questions
}

// 随机选择一道题
function selectRandomQuestion() {
  const allQuestions = getAllQuestions()
  if (allQuestions.length === 0) {
    isLoading.value = false
    return
  }

  const randomIndex = Math.floor(Math.random() * allQuestions.length)
  selectedQuestion.value = allQuestions[randomIndex]
  isLoading.value = false
}

// 跳转到题目页面
function navigateToQuestion() {
  if (!selectedQuestion.value?.link)
    return

  const decodedLink = decodeURIComponent(selectedQuestion.value.link)
  router.go(decodedLink)
}

// 重新随机选择
function refreshQuestion() {
  isLoading.value = true
  selectRandomQuestion()
}

// 格式化链接显示
const displayLink = computed(() => {
  if (!selectedQuestion.value?.link)
    return ''
  return decodeURIComponent(selectedQuestion.value.link)
})

onMounted(() => {
  selectRandomQuestion()
})
</script>

<template>
  <div class="random-question">
    <div v-if="isLoading" class="loading">
      正在加载随机题目...
    </div>
    <div v-else-if="selectedQuestion" class="question-card">
      <div class="question-header">
        <h3 class="question-title">
          {{ selectedQuestion.title }}
        </h3>
        <div class="question-meta">
          <span class="category-tag">{{ selectedQuestion.category }}</span>
          <button class="refresh-btn" @click="refreshQuestion">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            换一题
          </button>
        </div>
      </div>
      <div v-if="selectedQuestion.metadata?.tags && selectedQuestion.metadata.tags.length > 0" class="question-tags">
        <span
          v-for="tag in selectedQuestion.metadata.tags"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
      <div class="question-footer">
        <button class="view-btn" @click="navigateToQuestion">
          查看详情
        </button>
        <span class="question-link">{{ displayLink }}</span>
      </div>
    </div>
    <div v-else class="empty-state">
      暂无可用题目
    </div>
  </div>
</template>

<style scoped lang="scss">
.random-question {
  margin: 20px 0;
}

.loading {
  padding: 40px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.question-card {
  max-width: 80vw;
  margin: 60px auto;
  padding: 24px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-alt);
  transition: all 0.25s;

  &:hover {
    border-color: var(--vp-c-brand);
    box-shadow: var(--vp-shadow-2);
  }
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.question-title {
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.category-tag {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-brand);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 6px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    border-color: var(--vp-c-brand);
    color: var(--vp-c-brand);
    background-color: var(--vp-c-bg-alt);
  }

  svg {
    width: 14px;
    height: 14px;
  }
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-bg-soft);
}

.question-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-bg-soft);
}

.view-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: var(--vp-c-brand);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: var(--vp-shadow-2);
  }
}

.question-link {
  flex: 1;
  font-size: 12px;
  color: var(--vp-c-text-2);
  word-break: break-all;
  text-align: right;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .question-card {
    padding: 16px;
  }

  .question-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .question-title {
    font-size: 18px;
  }

  .question-meta {
    width: 100%;
    justify-content: space-between;
  }

  .question-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .view-btn {
    width: 100%;
  }

  .question-link {
    text-align: left;
    font-size: 11px;
  }
}
</style>
