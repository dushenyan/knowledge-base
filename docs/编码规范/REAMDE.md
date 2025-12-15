# 项目编码规范教程

## 一、风格指南

### 1. 组件命名规范

- 所有组件文件名采用 PascalCase（首字母大写），如 `BackToTop.vue`，但 `index.vue` 除外。
- 示例：
  - `@/components/BackToTop/index.vue`
  - `@/views/example/components/Button.vue`
- 参考：[Vue 风格指南](https://cn.vuejs.org/v2/style-guide/)

### 2. 视图文件命名规范

- 路由相关的 `.vue` 文件和文件夹均采用 kebab-case（短横线连接）。
- 示例：
  - `@/views/error-page/index.vue`
  - `@/views/home/page-one.vue`

### 3. JS 文件命名规范

- 普通 `.js` 文件采用 kebab-case。
- `@/store/modules` 下的 `.js` 文件可使用小驼峰命名法。
- 示例：
  - `@/utils/open-window.js`
  - `@/store/modules/tagsView.js`


## 二、代码提交规范

推荐遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 1. Commit Message 结构

每次提交包括三部分：Header、Body 和 Footer。

格式如下：

```
<type>(<scope>): <subject>

<body>

<footer>
```

- 简单示例：`feat: initial commit`
- Header 必填，Body 和 Footer 可省略。

### 2. Header 字段说明

- **type**（必需）：说明提交类型
- **scope**（可选）：影响范围
- **subject**（必需）：简短描述（不超过 50 字符）

#### type 类型说明


- feat：新功能
- fix：修复 bug
- docs：文档
- style：代码格式（不影响运行）
- refactor：重构
- test：测试
- perf：性能优化
- revert：回滚
- chore：构建或工具变动
- ci：持续集成相关
- build：构建或依赖变动

#### subject 书写规范

- 以动词开头，使用第一人称现在时（如 change，而非 changed 或 changes）
- 首字母小写
- 结尾不加句号

### 3. Body 部分

详细描述本次提交内容，可分多行。

### 4. Footer 部分

仅用于以下两种情况：

- **不兼容变动**：以 `BREAKING CHANGE` 开头，描述变动内容、理由及迁移方法。
- **关闭 Issue**：针对某个 issue，可在 Footer 关闭该 issue。

## 三、参考链接

**注意事项**

- 不使用 `tagViews` 组件时，建议移除 `AppMain` 中的 `keepAlive`。
- 不适用缓存的路由页面需在路由 `meta` 中添加 `noCache`。
- 配置项可在 `@/src/settings.js` 文件中调整。
- `element-ui` 组件统一在 `el-loader.js` 中引入。
- 日期处理推荐使用 `dayjs` 替代 `moment`。
- 图标建议使用 `svg` 格式，并可用 `svgo` 命令压缩优化 `@/icons/svg` 文件。
- 路由较多时，可在 `@/router` 下新建 `modules` 文件夹，将路由定义拆分后再引入 `index.js`。

- [vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)
