import { generateNavData } from './generateNavData'
import { writeTreeToFile } from './printTree'

try {
  // 执行生成 个人项目
  generateNavData()

  // 生成docs 目录树
  writeTreeToFile('./docs', './.vitepress/config/docsTree.json')
}
catch (error) {
  console.error('服务运行文件出错:', error)
}
