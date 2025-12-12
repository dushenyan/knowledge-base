import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 获取当前目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// 获取桌面路径，兼容不同操作系统
function getDesktopPath(): string {
  const homeDir = os.homedir()
  return path.join(homeDir, 'Desktop', 'emphasis')
}

// emphasis文件夹路径
const emphasisDir = getDesktopPath()
// 导出文件路径
const outputPath = path.join(projectRoot, '../docs/_pages/projects/data.ts')

console.log(`正在扫描emphasis目录: ${emphasisDir}`)

// 读取文件夹信息
function getProjectInfo(folderPath: string): {
  folderName: string
  localPath: string
  hasGitRepo: boolean
  remoteRepo: string | null
  description: string
  icon: string
  homepage: string
} {
  const folderName = path.basename(folderPath)
  const localPath = folderPath

  // 初始化变量
  let description = ''
  let icon = ''
  let homepage = ''
  let repository
  let hasPackageJson = false

  // 检查是否有package.json获取信息
  const packageJsonPath = path.join(folderPath, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    hasPackageJson = true
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      description = packageJson.description || ''
      homepage = packageJson.homepage || ''
      repository = packageJson.repository || ''

      // 如果repository是对象，提取url
      if (typeof repository === 'object' && repository.url) {
        repository = repository.url
      }

      // 获取图标
      icon = packageJson.iconUrl || ''
    }
    catch (error) {
      console.error(`Error reading package.json for ${folderName}:`, error)
    }
  }

  // 如果没有package.json，尝试从README.md中读取信息块
  if (!hasPackageJson) {
    const readmePath = path.join(folderPath, 'README.md')
    if (fs.existsSync(readmePath)) {
      try {
        const readmeContent = fs.readFileSync(readmePath, 'utf-8')

        // 尝试提取隐藏的div块中的信息
        const infoBlockMatch = readmeContent.match(/<div style="display: none;">[\s\S]*?<\/div>/)
        if (infoBlockMatch) {
          const infoBlock = infoBlockMatch[0]

          // 提取各个字段
          const titleMatch = infoBlock.match(/<title>(.*?)<\/title>/)
          const descMatch = infoBlock.match(/<description>(.*?)<\/description>/)
          const homeMatch = infoBlock.match(/<homepage>(.*?)<\/homepage>/)
          const repoMatch = infoBlock.match(/<repository>(.*?)<\/repository>/)
          const iconMatch = infoBlock.match(/<iconUrl>(.*?)<\/iconUrl>/)

          if (titleMatch)
            description = titleMatch[1].trim()
          if (descMatch)
            description = descMatch[1].trim()
          if (homeMatch)
            homepage = homeMatch[1].trim()
          if (repoMatch)
            repository = repoMatch[1].trim()
          if (iconMatch)
            icon = iconMatch[1].trim()
        }

        // 如果没有信息块，尝试从README.md获取描述
        if (!description) {
          // 提取第一行作为描述（通常是标题）
          const firstLine = readmeContent.split('\n')[0]
          // 如果是markdown标题，去掉#号
          description = firstLine.replace(/^#\s+/, '').trim()

          // 如果只有一行，尝试获取第二非空行
          if (description.length < 20) {
            const lines = readmeContent.split('\n').filter(line => line.trim().length > 0)
            if (lines.length > 1) {
              const secondLine = lines[1].replace(/^#\s+/, '').trim()
              if (secondLine.length > 10) {
                description = secondLine
              }
            }
          }

          // 限制描述长度
          if (description.length > 100) {
            description = `${description.substring(0, 100)}...`
          }
        }
      }
      catch (error) {
        console.error(`Error reading README.md for ${folderName}:`, error)
      }
    }
  }

  // 如果还是没有描述，使用文件夹名
  if (!description) {
    description = `${folderName} 项目`
  }

  // 检查是否有git仓库
  let hasGitRepo = false
  let remoteRepo = repository || null

  const gitDir = path.join(folderPath, '.git')
  if (fs.existsSync(gitDir)) {
    hasGitRepo = true

    // 如果没有从package.json或README.md获取到仓库信息，尝试从git配置获取
    if (!remoteRepo) {
      try {
        const gitConfigPath = path.join(gitDir, 'config')
        if (fs.existsSync(gitConfigPath)) {
          const gitConfig = fs.readFileSync(gitConfigPath, 'utf-8')
          const urlMatch = gitConfig.match(/url = (.+)/g)
          if (urlMatch && urlMatch.length > 0) {
            // 提取URL并格式化
            let url = urlMatch[0].replace('url = ', '').trim()
            // 如果是git@格式，转换为https
            if (url.startsWith('git@')) {
              url = url.replace('git@github.com:', 'https://github.com/')
            }
            remoteRepo = url
          }
        }
      }
      catch (error) {
        console.error(`Error reading git config for ${folderName}:`, error)
      }
    }
  }

  // 特殊处理某些文件夹
  if (folderName === 'Filing') {
    description = '个人资料收集整理，包含技术文档、工具链接、学习资源等'
  }

  return {
    folderName,
    localPath,
    hasGitRepo,
    remoteRepo,
    description,
    icon,
    homepage,
  }
}

// 生成data.ts文件
export function generateNavData(): void {
  console.log('开始生成导航数据...')

  // 读取emphasis目录下的所有文件夹
  let folders
  try {
    folders = fs.readdirSync(emphasisDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort() // 按字母顺序排序
  }
  catch (error) {
    console.error('无法读取emphasis目录:', error)
    return
  }

  // 获取每个文件夹的信息
  const projects = folders.map((folderName) => {
    const folderPath = path.join(emphasisDir, folderName)
    return getProjectInfo(folderPath)
  })

  // 转换为导航链接格式
  const projectItems = projects.map(project => ({
    icon: project.icon,
    title: project.folderName,
    desc: project.description.replace(/^#\s+/, ''), // 去除README.md中的标题标记
    link: `vscode://file/${project.localPath}`,
    remoteRepo: project.remoteRepo,
    localPath: project.localPath,
    homepage: project.homepage,
  }))

  // 生成完整的data.ts内容
  const content = `type NavData = {
  title: string
  items: any[]
}

export const NAV_DATA: NavData[] = [
  {
    title: '项目集合',
    items: ${JSON.stringify(projectItems, null, 2)}
  },
]`

  // 写入文件
  fs.writeFileSync(outputPath, content, 'utf-8')
  console.log(`✅ 导航数据已生成到: ${outputPath}`)
  console.log(`📁 共扫描 ${projects.length} 个项目文件夹`)
}
