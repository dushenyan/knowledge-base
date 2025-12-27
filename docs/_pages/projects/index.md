---
layoutClass: nav-layout
sidebar: false
editLink: false
footer: false
aside: false
---

<script setup>
import { NAV_DATA } from './data'
</script>
<style src="./index.scss"></style>

<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>

<br />