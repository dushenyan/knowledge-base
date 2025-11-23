---
layout: home
layoutClass: 'home-layout'

hero:
  name: shenyan'资源集合
  tagline: 开箱即用的Vite Press模板，快速搭建你的文档网站。
  image:
    src: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=
  actions:
    - theme: brand
      text: 快速入手
      link: /docs/other/hello
features:
  - icon: 🎯
    title: 聚焦前端面试
    details: 系统性整理了 JavaScript、Vue、TypeScript 等前端核心知识点与高频面试题，助你高效备战。
  - icon: 🗂️
    title: 结构化知识体系
    details: 内容按技术栈分类，形成清晰的知识体系，便于查漏补缺和系统性学习。
  - icon: 💻
    title: 交互式学习体验
    details: 提供全文搜索快速定位知识点，并内置在线代码编辑器，方便随时动手实践和验证。
  - icon: ⚡
    title: 简单
    details: 开箱即用，只需要简单配置，就可以马上使用。
  - icon: 🛠️
    title: 全面
    details: 集成组件库、TailwindCSS、SVG图标等默认解决方案，应有尽有！
  - icon: ✊
    title: 强大
    link: https://github.com/shoppingzh/press-util
    linkText: 更多
    details: 自动生成导航栏与侧边栏，你的烦恼即是我的烦恼。
---

<style>
.home-layout .image-src{
  border-radius: 50%;
  width: 250px;
  height: 250px;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}
/*爱的魔力转圈圈*/
.home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}

.home-layout .details small {
  opacity: 0.8;
}

.home-layout .bottom-small {
  display: block;
  margin-top: 2em;
  text-align: right;
}
</style>
