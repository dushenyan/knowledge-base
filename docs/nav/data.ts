type NavData = {
  title: string
  items: any[]
}

// 从桌面emphasis文件夹扫描的项目数据
const emphasisProjects = [
  {
    folderName: "10w",
    localPath: "/Users/shenyandu/Desktop/emphasis/10w",
    hasGitRepo: false,
    remoteRepo: null,
    description: "10w项目是一个多页面展示项目，包含了如爱心粒子动画、Canvas动画板、文字雨动画等页面, 提供点击跳转以及二维码扫描访问",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/vite.svg"
  },
  {
    folderName: "budai-technology-web",
    localPath: "/Users/shenyandu/Desktop/emphasis/budai-technology-web",
    hasGitRepo: false,
    remoteRepo: null,
    description: "布袋云科技官方网站项目",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/rollup.svg"
  },
  {
    folderName: "desktop-tutorial",
    localPath: "/Users/shenyandu/Desktop/emphasis/desktop-tutorial",
    hasGitRepo: false,
    remoteRepo: null,
    description: "Welcome to GitHub Desktop! This is your README. READMEs are where you can communicate what your project is and how to use it.",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/github.svg"
  },
  {
    folderName: "dotfiles",
    localPath: "/Users/shenyandu/Desktop/emphasis/dotfiles",
    hasGitRepo: false,
    remoteRepo: null,
    description: "个人配置文件集合",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/macos.svg"
  },
  {
    folderName: "dushenyan-share-record-blog.github.io",
    localPath: "/Users/shenyandu/Desktop/emphasis/dushenyan-share-record-blog.github.io",
    hasGitRepo: false,
    remoteRepo: "https://github.com/dbudaiya/dushenyan-share-record-blog.github.io",
    description: "个人技术博客，使用Hexo和Butterfly主题构建",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/hexo.svg"
  },
  {
    folderName: "Filing",
    localPath: "/Users/shenyandu/Desktop/emphasis/Filing",
    hasGitRepo: false,
    remoteRepo: null,
    description: "个人资料收集整理，包含技术文档、工具链接、学习资源等",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/filezilla.svg"
  },
  {
    folderName: "gesture-Christmas_tree-3d_with_photo",
    localPath: "/Users/shenyandu/Desktop/emphasis/gesture-Christmas_tree-3d_with_photo",
    hasGitRepo: false,
    remoteRepo: null,
    description: "🎄 3D圣诞树手势控制项目，支持粒子特效和照片挂载功能",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/threejs.svg"
  },
  {
    folderName: "github-deploy",
    localPath: "/Users/shenyandu/Desktop/emphasis/github-deploy",
    hasGitRepo: false,
    remoteRepo: null,
    description: "使用GitHub为网站提供部署服务以及部署流程运行",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/github.svg"
  },
  {
    folderName: "knowledge-base",
    localPath: "/Users/shenyandu/Desktop/emphasis/knowledge-base",
    hasGitRepo: false,
    remoteRepo: null,
    description: "基于VitePress的知识库系统，包含技术文档和实践记录",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/vitepress.svg"
  },
  {
    folderName: "minespeeper-web",
    localPath: "/Users/shenyandu/Desktop/emphasis/minespeeper-web",
    hasGitRepo: false,
    remoteRepo: null,
    description: "基于Vue 3 和 TypeScript 的扫雷游戏，支持多种难度级别和响应式设计",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/vue.svg"
  },
  {
    folderName: "mulit-category-upload",
    localPath: "/Users/shenyandu/Desktop/emphasis/mulit-category-upload",
    hasGitRepo: false,
    remoteRepo: null,
    description: "多分类上传组件，支持文件分类管理",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/element.svg"
  },
  {
    folderName: "mushroomstreet-web",
    localPath: "/Users/shenyandu/Desktop/emphasis/mushroomstreet-web",
    hasGitRepo: false,
    remoteRepo: null,
    description: "蘑菇街移动端Web项目，基于Vue 2和Vant UI构建",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/vuedotjs.svg"
  },
  {
    folderName: "myresume",
    localPath: "/Users/shenyandu/Desktop/emphasis/myresume",
    hasGitRepo: false,
    remoteRepo: null,
    description: "个人线上终端简历，支持PDF生成和动态展示",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/readthedocs.svg"
  },
  {
    folderName: "name-sprout",
    localPath: "/Users/shenyandu/Desktop/emphasis/name-sprout",
    hasGitRepo: false,
    remoteRepo: null,
    description: "极简命名助手CLI，支持多种风格、参数控制与Gemini API",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/npm.svg"
  },
  {
    folderName: "office-preview",
    localPath: "/Users/shenyandu/Desktop/emphasis/office-preview",
    hasGitRepo: false,
    remoteRepo: null,
    description: "Office文档预览组件，支持Word、Excel、PDF等多种格式",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/microsoftoffice.svg"
  },
  {
    folderName: "page-marking",
    localPath: "/Users/shenyandu/Desktop/emphasis/page-marking",
    hasGitRepo: false,
    remoteRepo: null,
    description: "智能页面遮罩工具，支持多种遮罩模式，保护隐私",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/privacy.svg"
  },
  {
    folderName: "pingduoduo-Ai-reply",
    localPath: "/Users/shenyandu/Desktop/emphasis/pingduoduo-Ai-reply",
    hasGitRepo: false,
    remoteRepo: null,
    description: "拼多多AI自动回复工具",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/openai.svg"
  },
  {
    folderName: "qq-music-application",
    localPath: "/Users/shenyandu/Desktop/emphasis/qq-music-application",
    hasGitRepo: false,
    remoteRepo: null,
    description: "QQ音乐应用项目，包含API服务和UniApp客户端",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/tencentqq.svg"
  },
  {
    folderName: "shenyan-cli",
    localPath: "/Users/shenyandu/Desktop/emphasis/shenyan-cli",
    hasGitRepo: false,
    remoteRepo: null,
    description: "深燕CLI脚手架工具，支持快速创建项目模板",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/terminal.svg"
  },
  {
    folderName: "shenyan-utils",
    localPath: "/Users/shenyandu/Desktop/emphasis/shenyan-utils",
    hasGitRepo: false,
    remoteRepo: "https://github.com/dbudaiya/shenyan-utils.git",
    description: "由逻辑开发和业务引导的开源工具函数库",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/npm.svg"
  },
  {
    folderName: "templates",
    localPath: "/Users/shenyandu/Desktop/emphasis/templates",
    hasGitRepo: false,
    remoteRepo: null,
    description: "项目模板集合，包含多种技术栈的启动模板",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/template.svg"
  },
  {
    folderName: "ticket-purchase",
    localPath: "/Users/shenyandu/Desktop/emphasis/ticket-purchase",
    hasGitRepo: false,
    remoteRepo: null,
    description: "票务购买自动化工具",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/ticketmaster.svg"
  },
  {
    folderName: "use-command-model",
    localPath: "/Users/shenyandu/Desktop/emphasis/use-command-model",
    hasGitRepo: false,
    remoteRepo: null,
    description: "命令模式Demo，基于Vue 3和Element Plus",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/vue.svg"
  },
  {
    folderName: "v-fit-columns",
    localPath: "/Users/shenyandu/Desktop/emphasis/v-fit-columns",
    hasGitRepo: false,
    remoteRepo: null,
    description: "Vue表格列宽自适应组件",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/vuedotjs.svg"
  },
  {
    folderName: "vscode-rule-coverage-viewer",
    localPath: "/Users/shenyandu/Desktop/emphasis/vscode-rule-coverage-viewer",
    hasGitRepo: false,
    remoteRepo: null,
    description: "VS Code规则覆盖率查看器扩展",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/visualstudiocode.svg"
  },
  {
    folderName: "vscode-ts-elegant-config",
    localPath: "/Users/shenyandu/Desktop/emphasis/vscode-ts-elegant-config",
    hasGitRepo: false,
    remoteRepo: null,
    description: "VS Code TypeScript优雅配置扩展",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/typescript.svg"
  },
  {
    folderName: "webview-communicate",
    localPath: "/Users/shenyandu/Desktop/emphasis/webview-communicate",
    hasGitRepo: false,
    remoteRepo: null,
    description: "WebView通信解决方案，支持多平台",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/webassembly.svg"
  }
]

// 转换为导航链接格式，添加打开VSCode的URL
const projectItems = emphasisProjects.map(project => ({
  icon: project.icon,
  title: project.folderName,
  desc: project.description,
  link: `vscode://file/${project.localPath}`,
  remoteRepo: project.remoteRepo,
  localPath: project.localPath
}))

export const NAV_DATA: NavData[] = [
  {
    title: '项目集合',
    items: projectItems
  },
  {
    title: '常用工具',
    items: [
      {
        icon: 'https://caniuse.com/img/favicon-128.png',
        title: 'Can I use',
        desc: '前端 API 兼容性查询',
        link: 'https://caniuse.com',
      },
    ],
  },
]
