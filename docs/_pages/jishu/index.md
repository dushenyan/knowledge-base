---
layoutClass: nav-layout
sidebar: false
editLink: false
footer: false
aside: false
---


<script setup lang="ts">
import docsTree from '@config/docsTree.json'
import { computed, ref } from 'vue'

const docsTreeRef = ref<DocsTreeItem[]>(docsTree)

interface DocsTreeItem {
  title: string
  items?: DocsTreeItem[]
  path?: string
}
</script>

<JishuCard title="Technology" :modules="docsTreeRef" />

<style src="./index.scss"></style>

<br />
