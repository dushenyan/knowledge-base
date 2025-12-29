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

interface DocsTreeItem {
  title: string
  items?: DocsTreeItem[]
  path?: string
}

const ignoreDocs = ['_pages']

const filterDocsTree = computed(() => docsTree.filter(item => !ignoreDocs.includes(item.title)))

</script>

<JishuCard title="Technology" :modules="filterDocsTree" />

<style src="./index.scss"></style>

