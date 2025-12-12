import { sandpackTemplateOptions } from '@config/emnus'

export interface NavLink {
  icon?: string | { svg: string }
  title?: string
  desc?: string
  link: string
  remoteRepo?: string
  localPath?: string
  homepage?: string
}

export interface PageEnvDataVO {
  path: string
  title: string
  relativePath: string
  cleanUrls: boolean
  sfcBlocks: {
    template: string | null
    script: string | null
    scriptSetup: string | null
    scripts: string[]
    styles: string[]
    customBlocks: string[]
  }
  content: string
  excerpt: string
  frontmatter: {
    layoutClass: string
    sidebar: boolean
    editLink: boolean
    footer: boolean
    /**
     * 是否给文章添加统计数据
     */
    notArticle: boolean
    /**
     * 是否开启方括号转义
     */
    bracketEscaping: boolean
    [key: string]: any
  }
}

export interface EnhancedDocsTreeDataVO {
  title: string
  metadata?: Record<string, any> & {
    // 可选的标签数组，元素类型为字符串
    tags?: string[]
    /**
     * 进度
     */
    progress?: number
  }
  link?: string
  fileExtension?: string
  items?: EnhancedDocsTreeDataVO[]
}

// 定义只读数组
const SANDBOX_TEMPLATES = sandpackTemplateOptions

// 从数组中提取联合类型
export type SandpackPredefinedTemplate = typeof SANDBOX_TEMPLATES[number]
