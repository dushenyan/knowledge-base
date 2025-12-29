## useNow
```typescript
import { dateUtil } from '@/utils/dateUtil'
import { reactive, toRefs } from 'vue'
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core'

export const useNow = (immediate = true) => {
  let timer: IntervalHandle

  const state = reactive({
    year: 0,
    month: 0,
    week: '',
    day: 0,
    hour: '',
    minute: '',
    second: 0,
    meridiem: ''
  })

  const update = () => {
    const now = dateUtil()

    const h = now.format('HH')
    const m = now.format('mm')
    const s = now.get('s')

    state.year = now.get('y')
    state.month = now.get('M') + 1
    state.week = '星期' + ['日', '一', '二', '三', '四', '五', '六'][now.day()]
    state.day = now.get('date')
    state.hour = h
    state.minute = m
    state.second = s

    state.meridiem = now.format('A')
  }

  function start() {
    update()
    clearInterval(timer)
    timer = setInterval(() => update(), 1000)
  }

  function stop() {
    clearInterval(timer)
  }

  tryOnMounted(() => {
    immediate && start()
  })

  tryOnUnmounted(() => {
    stop()
  })

  return {
    ...toRefs(state),
    start,
    stop
  }
}
```

1. 导入部分：
    - `dateUtil`: 自定义的日期工具函数。
    - `reactive`, `toRefs`: Vue 3 的响应式 API。
    - `tryOnMounted`, `tryOnUnmounted`: 来自 VueUse 的生命周期钩子。
        * [为什么不使用onMounted替换使用tryOnMounted](./explain#为什么不使用onMounted替换使用tryOnMounted)
2. `useNow` 函数定义：
    - 接受一个可选参数 `immediate`，默认为 `true`。
    - 声明 `timer` 变量用于存储定时器的引用。
3. 响应式状态 `state`：
    - 使用 `reactive` 创建一个包含时间相关属性的响应式对象。
4. `update` 函数：
    - 使用 `dateUtil()` 获取当前时间。
    - 更新 `state` 对象的各个属性，包括年、月、星期、日、时、分、秒和午前/午后。
    - 星期的计算使用了一个数组映射。
5. `start` 函数：
    - 调用 `update` 立即更新时间。
    - 清除之前的定时器（如果存在）。
    - 设置新的定时器，每秒调用一次 `update`。
6. `stop` 函数：
    - 清除定时器，停止时间更新。
7. 生命周期钩子：
    - `tryOnMounted`: 组件挂载时，如果 `immediate` 为 true，则调用 `start` 函数。
    - `tryOnUnmounted`: 组件卸载时调用 `stop` 函数，清理定时器。
8. 返回值：
    - 使用 `toRefs` 将 `state` 对象的属性转换为独立的 ref。
    - 返回时间状态和控制函数（`start` 和 `stop`）。

这个组合式函数提供了一个灵活的方式来获取和更新当前时间，可以在 Vue 组件中方便地使用。它允许用户手动控制时间更新的开始和停止，同时也能在组件挂载时自动开始更新（如果 `immediate` 为 true）。

## useIcon
```typescript
import { h } from 'vue'
import type { VNode } from 'vue'
import { Icon } from '@/components/Icon'
import { IconTypes } from '@/types/icon'

export const useIcon = (props: IconTypes): VNode => {
  return h(Icon, props)
}
```

让我们逐行解析这段代码：

1. 导入部分：

```typescript
import { h } from 'vue'
import type { VNode } from 'vue'
import { Icon } from '@/components/Icon'
import { IconTypes } from '@/types/icon'
```

    - `h`: 导入 Vue 的渲染函数。
    - `VNode`: 导入 Vue 虚拟节点类型。
    - `Icon`: 导入自定义的 Icon 组件。
    - `IconTypes`: 导入图标属性的类型定义。
2. `useIcon` 函数定义：

```typescript
export const useIcon = (props: IconTypes): VNode => {
  return h(Icon, props)
}
```

    - 这是一个命名为 `useIcon` 的函数。
    - 它接受一个参数 `props`，类型为 `IconTypes`。
    - 函数返回类型为 `VNode`（Vue 虚拟节点）。
    - 函数体使用 Vue 的 `h` 函数创建一个 `Icon` 组件的虚拟节点，并传入 `props`。

这个 `useIcon` 函数是一个简单的封装，它将 `Icon` 组件的创建过程封装成一个可重用的函数。使用这个函数可以更方便地在其他组件中创建图标，而不需要直接使用 `h` 函数。

使用示例可能如下：

```typescript
const myIcon = useIcon({ name: 'user', size: 24 })
```

这将创建一个名为 "user" 的图标，大小为 24 像素（具体属性取决于 `IconTypes` 的定义）。

这种方法提供了一种灵活且可复用的方式来创建图标组件，特别适用于需要动态创建图标的场景。

## useNetwork
**为什么不将这些监听函数放在onMounted中呢?**

您提出了一个很好的问题。让我们分析一下为什么这段代码没有将监听函数放在 `onMounted` 中，以及这种做法的优缺点。

首先，让我们回顾一下当前的代码结构：

```typescript
import { ref, onBeforeUnmount } from 'vue'

const useNetwork = () => {
  const online = ref(true)

  const updateNetwork = () => {
    online.value = navigator.onLine
  }

  window.addEventListener('online', updateNetwork)
  window.addEventListener('offline', updateNetwork)

  onBeforeUnmount(() => {
    window.removeEventListener('online', updateNetwork)
    window.removeEventListener('offline', updateNetwork)
  })

  return { online }
}

export { useNetwork }
```

这种实现方式有以下几个特点：

1. 即时性：事件监听器在 `useNetwork` 函数被调用时立即添加，不需要等待组件挂载。
2. 简洁性：代码结构更加简洁，不需要额外的 `onMounted` 钩子。
3. 可复用性：这种实现方式使得 `useNetwork` 可以在组件外部使用，不依赖于 Vue 的生命周期。

然而，您提出的将监听函数放在 `onMounted` 中的方法也有其优点：

```typescript
import { ref, onMounted, onBeforeUnmount } from 'vue'

const useNetwork = () => {
  const online = ref(true)

  const updateNetwork = () => {
    online.value = navigator.onLine
  }

  onMounted(() => {
    window.addEventListener('online', updateNetwork)
    window.addEventListener('offline', updateNetwork)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('online', updateNetwork)
    window.removeEventListener('offline', updateNetwork)
  })

  return { online }
}
```

这种方法的优点包括：

1. 生命周期一致性：事件监听器的添加与组件的挂载周期保持一致。
2. 资源管理：确保只有在组件真正需要时才添加事件监听器，可能略微提高性能。
3. 清晰的组件关联：更明确地表示这些事件监听器是与组件生命周期相关的。

选择哪种方法主要取决于以下因素：

+ 使用场景：如果 `useNetwork` 可能在组件外部使用，当前的实现更灵活。
+ 性能考虑：如果担心在组件挂载前添加过多监听器，使用 `onMounted` 可能更好。
+ 代码风格和一致性：如果项目中其他类似的 hooks 都使用 `onMounted`，为了一致性可能更倾向于使用它。

总的来说，当前的实现方式和使用 `onMounted` 的方式都是有效的。选择哪种主要取决于具体的项目需求和代码风格偏好。

## useProgress
这是一个名为 `useNProgress` 的自定义 Vue 组合式函数（Composable），用于在应用中集成 NProgress 进度条。让我们逐部分分析：

```typescript
// FILEPATH: /Users/shenyandu/CodeFree/company-bussiness/liuyun-erp-web/src/hooks/web/useNProgress.ts

import { useCssVar } from '@vueuse/core'
import type { NProgressOptions } from 'nprogress'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const primaryColor = useCssVar('--el-color-primary', document.documentElement)

export const useNProgress = () => {
  NProgress.configure({ showSpinner: false } as NProgressOptions)

  const initColor = async () => {
    await nextTick()
    const bar = document.getElementById('nprogress')?.getElementsByClassName('bar')[0] as ElRef
    if (bar) {
      bar.style.background = unref(primaryColor.value)
    }
  }

  initColor()

  const start = () => {
    NProgress.start()
  }

  const done = () => {
    NProgress.done()
  }

  return {
    start,
    done
  }
}
```

1. 导入部分：
    - `useCssVar`: 来自 VueUse，用于获取 CSS 变量。
    - `NProgressOptions` 和 `NProgress`: 从 nprogress 库导入。
    - 导入 NProgress 的 CSS 样式。
2. 获取主题色：

```typescript
const primaryColor = useCssVar('--el-color-primary', document.documentElement)
```

使用 `useCssVar` 获取 Element Plus 的主题色 CSS 变量。

3. `useNProgress` 函数定义： 这是主要的组合式函数。
4. 配置 NProgress：

```typescript
NProgress.configure({ showSpinner: false } as NProgressOptions)
```

设置 NProgress 不显示加载旋转器。

5. `initColor` 函数：

```typescript
const initColor = async () => {
  await nextTick()
  const bar = document.getElementById('nprogress')?.getElementsByClassName('bar')[0] as ElRef
  if (bar) {
    bar.style.background = unref(primaryColor.value)
  }
}
```

    - 异步函数，等待下一个 DOM 更新周期。
    - 获取 NProgress 的进度条元素。
    - 将进度条的背景色设置为主题色。
6. 调用 `initColor()`： 立即初始化进度条颜色。
7. `start` 和 `done` 函数：

```typescript
const start = () => {
  NProgress.start()
}

const done = () => {
  NProgress.done()
}
```

封装 NProgress 的开始和结束方法。

8. 返回值：

```typescript
return {
  start,
  done
}
```

返回开始和结束进度条的方法。

这个组合式函数提供了一种简单的方式来在 Vue 应用中使用 NProgress，并自动使用 Element Plus 的主题色。使用时，可以这样调用：

```typescript
const { start, done } = useNProgress()

// 开始显示进度条
start()

// 完成进度并隐藏进度条
done()
```

这种实现方式使得进度条的使用更加灵活，可以在需要的地方（如路由切换、异步操作等）轻松地控制进度条的显示和隐藏。

好的，我会详细解释这段代码。这是一个名为 `useTitle` 的自定义 Vue 组合式函数（Composable），用于动态设置网页的标题。让我们逐部分分析：

## useTitle
```typescript
// FILEPATH: /Users/shenyandu/CodeFree/company-bussiness/liuyun-erp-web/src/hooks/web/useTitle.ts

import { watch, ref } from 'vue'
import { isString } from '@/utils/is'
import { useAppStoreWithOut } from '@/store/modules/app'

const appStore = useAppStoreWithOut()

export const useTitle = (newTitle?: string) => {
  const { t } = useI18n()
  const title = ref(
    newTitle ? `${appStore.getTitle} - ${t(newTitle as string)}` : appStore.getTitle
  )

  watch(
    title,
    (n, o) => {
      if (isString(n) && n !== o && document) {
        document.title = n
      }
    },
    { immediate: true }
  )

  return title
}
```

1. 导入和初始化：

```typescript
import { watch, ref } from 'vue'
import { isString } from '@/utils/is'
import { useAppStoreWithOut } from '@/store/modules/app'

const appStore = useAppStoreWithOut()
```

    - 导入 Vue 的 `watch` 和 `ref` 函数用于响应式编程。
    - 导入 `isString` 工具函数用于类型检查。
    - 导入并初始化应用程序的 store，可能包含全局设置如默认标题。
2. `useTitle` 函数定义：

```typescript
export const useTitle = (newTitle?: string) => {
  // ...
}
```

    - 定义主要的组合式函数，接受一个可选的 `newTitle` 参数。
3. 国际化设置：

```typescript
const { t } = useI18n()
```

    - 获取国际化函数 `t`，用于翻译标题。这里假设 `useI18n` 函数已在其他地方定义。
4. 创建响应式标题：

```typescript
const title = ref(
  newTitle ? `${appStore.getTitle} - ${t(newTitle as string)}` : appStore.getTitle
)
```

    - 创建一个响应式的 `title`。
    - 如果提供了 `newTitle`，则组合应用标题和翻译后的新标题。
    - 如果没有提供 `newTitle`，则使用应用的默认标题。
5. 监听标题变化：

```typescript
watch(
  title,
  (n, o) => {
    if (isString(n) && n !== o && document) {
      document.title = n
    }
  },
  { immediate: true }
)
```

    - 使用 `watch` 监听 `title` 的变化。
    - 当`title`变化时，检查新值：
        * 是否为字符串（使用 `isString` 函数）
        * 是否与旧值不同
        * `document` 对象是否存在（防止在非浏览器环境中出错）
    - 如果所有条件满足，更新文档的标题。
    - `{ immediate: true }` 确保在创建监听器时立即执行一次，以设置初始标题。
6. 返回值：

```typescript
return title
```

    - 返回响应式的 `title`，允许外部组件访问和修改标题。

这个组合式函数提供了一种灵活的方式来管理网页标题。它考虑了国际化、应用程序默认标题，并且能够动态更新。使用时，可以这样调用：

```typescript
const pageTitle = useTitle('Welcome')
// 页面标题会被设置为 "应用名称 - Welcome的翻译"

// 稍后可以更新标题
pageTitle.value = 'New Page Title'
```

这种实现方式使得标题管理更加集中和可复用，特别适合在需要频繁更改页面标题的单页应用中使用。它结合了 Vue 的响应式系统、国际化功能和全局状态管理，提供了一个强大而灵活的标题管理解决方案。

