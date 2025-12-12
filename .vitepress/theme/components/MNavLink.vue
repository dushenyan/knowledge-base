<script setup lang="ts">
import type { NavLink } from '../../types'
import { slugify } from '@mdit-vue/shared'
import { withBase } from 'vitepress'

import { computed } from 'vue'

const props = defineProps<{
  icon?: NavLink['icon']
  title?: NavLink['title']
  desc?: NavLink['desc']
  link: NavLink['link']
  remoteRepo?: NavLink['remoteRepo']
  localPath?: NavLink['localPath']
  homepage?: NavLink['homepage']
}>()

const formatTitle = computed(() => {
  if (!props.title) {
    return ''
  }
  return slugify(props.title)
})

// 处理点击事件，如果是VSCode链接则阻止默认行为并自定义处理
function handleClick(e: MouseEvent, accessLink: string | undefined) {
  if (accessLink) {
    // VSCode链接需要特殊处理
    e.preventDefault()
    // 直接打开VSCode链接
    window.location.href = accessLink
  }
}
</script>

<template>
  <div class="m-nav-link" rel="noreferrer" @click="handleClick($event, homepage)">
    <article class="box">
      <div class="box-header">
        <div class="icon" :style="{ backgroundColor: homepage ? 'var(--vp-c-brand)' : 'var(--vp-c-default-soft)' }">
          <img
            v-if="icon && typeof icon === 'string' && withBase(icon)"
            :src="withBase(icon)"
            :alt="title"
          >
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
            <path fill="#000" fill-rule="evenodd" d="m256 34.347l192 110.851v221.703L256 477.752L64 366.901V145.198zM106.666 192.001v150.266l128 73.9V265.902zm298.667.001l-128 73.9v150.265l128-73.9zM256 83.614l-125.867 72.67L256 228.952l125.867-72.67z" />
          </svg>
        </div>
        <div class="title-container">
          <h5 v-if="title" :id="formatTitle" class="title">
            {{ title }}
          </h5>
          <div class="action-icons">
            <a
              v-if="localPath"
              :href="`vscode://file/${localPath}`"
              class="action-icon local-icon"
              title="在VSCode中打开本地项目"
              @click.stop
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fill-rule="evenodd">
                  <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                  <path fill="#000" d="M5.633 17.774a1 1 0 0 1-1.188.058l-1.5-1a1 1 0 0 1-.166-1.525L5.96 12L2.78 8.693a1 1 0 0 1 .166-1.525l1.5-1a1 1 0 0 1 1.188.058l3.29 2.692l6.35-6.604A1.02 1.02 0 0 1 15.999 2H16a1 1 0 0 1 .6.2l4 3a1 1 0 0 1 .4.8v12a1 1 0 0 1-.4.8l-4 3a1 1 0 0 1-1.328-.114l-6.35-6.603zM15 13.89v-3.78L12.69 12z" />
                </g>
              </svg>
            </a>
            <a
              v-if="remoteRepo"
              :href="remoteRepo"
              class="action-icon remote-icon"
              title="查看远程仓库"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path fill="#000" d="M7.024 2.31a9 9 0 0 1 2.125 1.046A11.4 11.4 0 0 1 12 3c.993 0 1.951.124 2.849.355a9 9 0 0 1 2.124-1.045c.697-.237 1.69-.621 2.28.032c.4.444.5 1.188.571 1.756c.08.634.099 1.46-.111 2.28C20.516 7.415 21 8.652 21 10c0 2.042-1.106 3.815-2.743 5.043a9.5 9.5 0 0 1-2.59 1.356c.214.49.333 1.032.333 1.601v3a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-.991c-.955.117-1.756.013-2.437-.276c-.712-.302-1.208-.77-1.581-1.218c-.354-.424-.74-1.38-1.298-1.566a1 1 0 0 1 .632-1.898c.666.222 1.1.702 1.397 1.088c.48.62.87 1.43 1.63 1.753c.313.133.772.22 1.49.122L8 17.98a4 4 0 0 1 .333-1.581a9.5 9.5 0 0 1-2.59-1.356C4.106 13.815 3 12.043 3 10c0-1.346.483-2.582 1.284-3.618c-.21-.82-.192-1.648-.112-2.283l.005-.038c.073-.582.158-1.267.566-1.719c.59-.653 1.584-.268 2.28-.031Z" />
                </g>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <p v-if="desc" class="desc">
        {{ desc }}
      </p>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.m-nav-link {
  --m-nav-icon-box-size: 40px;
  --m-nav-icon-size: 24px;
  --m-nav-box-gap: 12px;

  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 8px;
  height: 100%;
  text-decoration: inherit;
  background-color: var(--vp-c-bg-alt);
  transition: all 0.25s;
  cursor: pointer;
  &:hover {
    box-shadow: var(--vp-shadow-2);
    border-color: var(--vp-c-brand);
    text-decoration: initial;
    background-color: var(--vp-c-bg);
    transform: translateY(-2px);
  }

  .box {
    display: flex;
    flex-direction: column;
    padding: var(--m-nav-box-gap);
    height: 100%;
    color: var(--vp-c-text-1);
    &-header {
      display: flex;
      align-items: center;
      margin-bottom: calc(var(--m-nav-box-gap) - 2px);
    }
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: calc(var(--m-nav-box-gap) - 2px);
    border-radius: 6px;
    width: var(--m-nav-icon-box-size);
    height: var(--m-nav-icon-box-size);
    font-size: var(--m-nav-icon-size);
    background-color: var(--vp-c-default-soft);
    transition: background-color 0.25s;
    :deep(svg) {
      width: var(--m-nav-icon-size);
      fill: currentColor;
    }
    :deep(img) {
      border-radius: 4px;
      width: var(--m-nav-icon-size);
    }
  }

  .title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    flex-grow: 1;
  }

  .title {
    overflow: hidden;
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: var(--m-nav-icon-box-size);
    font-size: 16px;
    font-weight: 600;
  }

  .action-icons {
    display: flex;
    gap: 6px;
    margin-left: 8px;
    flex-shrink: 0;
  }

  .action-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background-color: var(--vp-c-bg-soft);
    color: var(--vp-c-text-2);
    transition: all 0.2s;

    &:hover {
      background-color: var(--vp-c-brand);
      color: white;
      transform: translateY(-1px);
    }

    &.local-icon {
      &:hover {
        background-color: #007ACC; // VSCode brand color
      }
    }

    &.remote-icon {
      &:hover {
        background-color: #4285F4; // GitHub-like dark color
      }
    }
  }

  .desc {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
    margin-bottom: calc(var(--m-nav-box-gap) - 2px);
    line-height: 1.5;
    font-size: 12px;
    color: var(--vp-c-text-2);
  }
}

@media (max-width: 960px) {
  .m-nav-link {
    --m-nav-icon-box-size: 36px;
    --m-nav-icon-size: 20px;
    --m-nav-box-gap: 8px;

    .title {
      font-size: 14px;
    }
  }
}
</style>
