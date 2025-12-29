<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { Lock, Unlock } from '@element-plus/icons-vue'
import { CACHE_KEY, useCache } from '../hooks/useCache'
import useJsencrypt from '../hooks/useJsencrypt'

// 定义是否锁定的状态
const isLocked = ref(false)
// 定义用户输入的密码
const password = ref('')
// 正确的密码
const correctPassword = ref('')
// 24 小时不锁屏的标记
const skipLockKey = 'skip_lock_screen'
// 首次访问标记
const firstVisitKey = 'first_visit_detected'
// 密码错误次数
const errorCount = ref(0)
// 加载状态
const isLoading = ref(false)
// 密码输入框引用
const passwordInput = ref<HTMLInputElement>()

const wsCache = await useCache()

function secureRandomString(length: number) {
  if (inBrowser) {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte =>
      (`0${byte.toString(16)}`).slice(-2)).join('').slice(0, length)
  }
  else {
    return 'dushenyan'
  }
}

// 生成新密码
function generatePassword() {
  const newPassword = useJsencrypt.encrypt(secureRandomString(16))
  correctPassword.value = newPassword as string
  console.log('🔐 新密码已生成:', newPassword)

  // 缓存密码 30 分钟
  wsCache.set(CACHE_KEY.PASS_WORD, newPassword, {
    exp: 30 * 60 * 1000,
  })
  return newPassword
}

// 检查密码是否过期，过期则生成新密码
function checkPasswordExpiration() {
  const cachedPassword = wsCache.get(CACHE_KEY.PASS_WORD)
  if (!cachedPassword) {
    generatePassword()
  }
  else {
    correctPassword.value = cachedPassword
  }
}

// 检查是否为首次访问
function checkFirstVisit() {
  const firstVisit = wsCache.get(firstVisitKey)
  if (!firstVisit) {
    // 标记为已访问
    wsCache.set(firstVisitKey, true, {
      exp: 365 * 24 * 60 * 60 * 1000, // 1年
    })
    return true
  }
  return false
}

// 阻止页面交互的函数
function preventInteraction(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
}

// 锁定屏幕的方法
function lock() {
  checkPasswordExpiration()
  isLocked.value = true
  password.value = ''
  errorCount.value = 0
  addInteractionBlockers()
}

// 解锁屏幕的方法
async function unlock() {
  if (isLoading.value) return
  
  const skipLock = wsCache.get(skipLockKey)
  if (skipLock) {
    isLocked.value = false
    removeInteractionBlockers()
    return
  }

  if (!password.value.trim()) {
    ElMessage.warning('请输入密码')
    shakeElement()
    return
  }

  isLoading.value = true
  
  try {
    await nextTick()
    
    if (password.value === useJsencrypt.decrypt(correctPassword.value)) {
      isLocked.value = false
      password.value = ''
      errorCount.value = 0
      ElMessage.success('解锁成功')
      removeInteractionBlockers()
      
      // 可选择24小时内不锁屏
      setTimeout(() => {
        if (inBrowser && confirm('是否24小时内不再锁屏？')) {
          wsCache.set(skipLockKey, true, {
            exp: 24 * 60 * 60 * 1000,
          })
        }
      }, 100)
    } else {
      errorCount.value++
      ElMessage.error(`密码错误，已尝试 ${errorCount.value} 次`)
      shakeElement()
      password.value = ''
      
      // 错误次数过多时增加限制
      if (errorCount.value >= 5) {
        ElMessage.warning('密码错误次数过多，请稍后再试')
        passwordInput.value?.blur()
        setTimeout(() => {
          passwordInput.value?.focus()
        }, 3000)
      }
    }
  } catch (error) {
    ElMessage.error('验证过程出现错误，请重试')
    console.error('解锁错误:', error)
  } finally {
    isLoading.value = false
  }
}

// 震动效果
function shakeElement() {
  if (passwordInput.value) {
    passwordInput.value.classList.add('shake')
    setTimeout(() => {
      passwordInput.value?.classList.remove('shake')
    }, 500)
  }
}

// 处理覆盖层点击
function handleOverlayClick() {
  // 聚焦到密码输入框
  passwordInput.value?.focus()
}

// 添加交互阻止器
function addInteractionBlockers() {
  if (!inBrowser) return
  
  const preventDefault = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
  }

  // 阻止右键菜单
  document.addEventListener('contextmenu', preventDefault, true)
  document.addEventListener('selectstart', preventDefault, true)
  document.addEventListener('dragstart', preventDefault, true)
  document.addEventListener('copy', preventDefault, true)
  document.addEventListener('cut', preventDefault, true)
  document.addEventListener('paste', preventDefault, true)
  
  // 阻止快捷键
  const preventKeys = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      preventDefault(e)
    }
    // 阻止F12, Ctrl+Shift+I, Ctrl+Shift+J等开发者工具快捷键
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')) {
      preventDefault(e)
    }
  }
  
  document.addEventListener('keydown', preventKeys, true)
}

// 移除交互阻止器
function removeInteractionBlockers() {
  if (!inBrowser) return
  
  document.removeEventListener('contextmenu', preventInteraction, true)
  document.removeEventListener('selectstart', preventInteraction, true)
  document.removeEventListener('dragstart', preventInteraction, true)
  document.removeEventListener('copy', preventInteraction, true)
  document.removeEventListener('cut', preventInteraction, true)
  document.removeEventListener('paste', preventInteraction, true)
}

// 控制台输入 lc 跳过验证
if (inBrowser) {
  // 扩展window对象类型
  ;(window as any).lc = () => {
    isLocked.value = false
    removeInteractionBlockers()
    // 24 小时内不锁屏
    wsCache.set(skipLockKey, true, {
      exp: 24 * 60 * 60 * 1000,
    })
    ElMessage.success('已跳过锁屏验证，24小时内有效')
  }
  ;(window as any).decrypt = useJsencrypt.decrypt
  ;(window as any).lock = lock
}

onMounted(async () => {
  const isFirstVisit = checkFirstVisit()
  const skipLock = wsCache.get(skipLockKey)
  
  if (!skipLock) {
    // 如果没有跳过标记，检查密码并锁定屏幕
    checkPasswordExpiration()
    isLocked.value = true
    
    // 首次访问提示
    if (isFirstVisit) {
      setTimeout(() => {
        ElMessage.info('欢迎！请输入密码以访问内容，密码已生成并打印在控制台')
      }, 500)
    }
  }
  
  // 每 10 分钟检查一次密码是否过期
  const checkInterval = setInterval(checkPasswordExpiration, 10 * 60 * 1000)
  
  onUnmounted(() => {
    clearInterval(checkInterval)
    removeInteractionBlockers()
  })
})

// 暴露锁定和解锁方法
// eslint-disable-next-line vue/no-expose-after-await
defineExpose({
  lock,
  unlock,
})
</script>

<template>
  <Transition name="lock-screen-fade">
    <div v-if="isLocked" class="lock-screen">
      <div class="lock-screen-overlay" @click.self="handleOverlayClick">
        <div class="lock-screen-content">
          <!-- 锁屏图标 -->
          <div class="lock-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C11.4477 2 11 2.44772 11 3V11H8C6.34315 11 5 12.3431 5 14V20C5 21.6569 6.34315 23 8 23H16C17.6569 23 19 21.6569 19 20V14C19 12.3431 17.6569 11 16 11H13V3C13 2.44772 12.5523 2 12 2Z" 
                    fill="var(--vp-c-brand)" stroke="var(--vp-c-brand)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <!-- 标题 -->
          <h1 class="lock-title">访问验证</h1>
          <p class="lock-subtitle">请输入密码以继续访问</p>
          
          <!-- 密码输入区域 -->
          <div class="password-input-group">
            <div class="input-wrapper" :class="{ 'error': errorCount > 0 }">
              <el-icon class="input-icon" size="20">
                <Lock v-if="!password" />
                <Unlock v-else />
              </el-icon>
              <input 
                ref="passwordInput"
                v-model="password" 
                type="password" 
                placeholder="请输入密码" 
                @keyup.enter="unlock"
                :disabled="isLoading"
                class="password-input"
                autocomplete="current-password"
              >
              <div v-if="isLoading" class="loading-spinner"></div>
            </div>
            
            <!-- 错误提示 -->
            <div v-if="errorCount > 0" class="error-message">
              密码错误 {{ errorCount }} 次，请重试
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button 
              @click="unlock" 
              :disabled="isLoading || !password.trim()"
              class="unlock-button"
            >
              <span v-if="!isLoading">解锁访问</span>
              <span v-else>验证中...</span>
            </button>
          </div>
          
          <!-- 提示信息 -->
          <div class="help-text">
            <p>💡 密码已自动生成并打印在浏览器控制台</p>
            <p>🔑 在控制台输入 <code>lc()</code> 可跳过验证</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 锁屏动画 */
.lock-screen-fade-enter-active,
.lock-screen-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lock-screen-fade-enter-from,
.lock-screen-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.lock-screen-fade-enter-to,
.lock-screen-fade-leave-from {
  opacity: 1;
  backdrop-filter: blur(8px);
}

/* 主容器 */
.lock-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  backdrop-filter: blur(8px);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.lock-screen-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--vp-c-bg);
  background-image: radial-gradient(circle at 50% 50%, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

/* 锁屏内容卡片 */
.lock-screen-content {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.lock-screen-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
}

/* 锁屏图标 */
.lock-icon {
  margin-bottom: 24px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

/* 标题样式 */
.lock-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.lock-subtitle {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin: 0 0 32px 0;
  line-height: 1.5;
}

/* 密码输入组 */
.password-input-group {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.input-wrapper:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.1);
}

.input-wrapper.error {
  border-color: #f56565;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.input-icon {
  padding: 0 16px;
  color: var(--vp-c-text-2);
  transition: color 0.3s ease;
}

.input-wrapper:focus-within .input-icon {
  color: var(--vp-c-brand-1);
}

.password-input {
  flex: 1;
  padding: 16px 16px 16px 0;
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--vp-c-text-1);
  outline: none;
  transition: all 0.3s ease;
}

.password-input::placeholder {
  color: var(--vp-c-text-3);
}

.password-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-brand-1);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误消息 */
.error-message {
  margin-top: 12px;
  padding: 12px 16px;
  background: rgba(245, 101, 101, 0.1);
  border: 1px solid rgba(245, 101, 101, 0.2);
  border-radius: 8px;
  color: #e53e3e;
  font-size: 14px;
  font-weight: 500;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { 
    opacity: 0;
    transform: translateY(-10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* 操作按钮 */
.action-buttons {
  margin-bottom: 24px;
}

.unlock-button {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.unlock-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: left 0.5s ease;
}

.unlock-button:hover::before {
  left: 100%;
}

.unlock-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(124, 77, 255, 0.3);
}

.unlock-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 帮助文本 */
.help-text {
  display: none;
  text-align: left;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.help-text p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-text code {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: var(--vp-c-brand-1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .lock-screen-overlay {
    padding: 16px;
  }
  
  .lock-screen-content {
    padding: 24px;
    margin: 0;
    border-radius: 12px;
  }
  
  .lock-title {
    font-size: 24px;
  }
  
  .lock-subtitle {
    font-size: 14px;
    margin-bottom: 24px;
  }
  
  .password-input {
    font-size: 16px; /* 防止iOS缩放 */
  }
  
  .unlock-button {
    padding: 14px 20px;
    font-size: 14px;
  }
  
  .help-text {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .lock-screen-content {
    padding: 20px;
  }
  
  .lock-title {
    font-size: 20px;
  }
  
  .help-text {
    text-align: center;
  }
}

/* 暗色主题适配 */
html.dark .lock-screen-overlay {
  background-image: radial-gradient(circle at 50% 50%, rgba(124, 77, 255, 0.1) 0%, var(--vp-c-bg) 100%);
}

html.dark .error-message {
  background: rgba(245, 101, 101, 0.15);
  border-color: rgba(245, 101, 101, 0.3);
  color: #fc8181;
}

/* 防止选中文本 */
.lock-screen * {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}
</style>
