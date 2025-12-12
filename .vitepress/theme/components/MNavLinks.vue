<script setup lang="ts">
import type { NavLink } from '../../types'
import { slugify } from '@mdit-vue/shared'

import { computed } from 'vue'
import MNavLink from './MNavLink.vue'

const props = defineProps<{
  title: string
  items: NavLink[]
}>()

const formatTitle = computed(() => {
  return slugify(props.title)
})
</script>

<template>
  <h2 v-if="title" :id="formatTitle" tabindex="-1">
    {{ title }}
  </h2>
  <div class="m-nav-links">
    <MNavLink
      v-for="{ icon, title: itemTitle, desc, link, remoteRepo, localPath, homepage } in items"
      :key="link"
      :icon="icon"
      :title="itemTitle"
      :desc="desc"
      :link="link"
      :remote-repo="remoteRepo"
      :local-path="localPath"
      :homepage="homepage"
    />
  </div>
</template>

<style lang="scss" scoped>
.vp-doc h2 {
    border-top: none;
    font-size: 80px;
    -webkit-text-stroke: 5px rgb(228, 228, 231);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    padding-bottom: 40px;
}
.m-nav-links {
  --m-nav-gap: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-row-gap: var(--m-nav-gap);
  grid-column-gap: var(--m-nav-gap);
  grid-auto-flow: row dense;
  justify-content: center;
  margin-top: var(--m-nav-gap);
}

@each $media, $size in (500px: 300px, 640px: 320px, 768px: 340px, 960px: 360px, 1440px: 380px) {
  @media (min-width: $media) {
    .m-nav-links {
      grid-template-columns: repeat(auto-fill, minmax($size, 1fr));
    }
  }
}

@media (min-width: 960px) {
  .m-nav-links {
    --m-nav-gap: 24px;
  }
}
</style>
