import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

// 命令终端路径
export const cwdPath = process.cwd()

/**
 * 获取桌面下某个文件夹路径
 * @returns 文件夹路径地址
 */
export function getDesktopPath(paths: string): string {
  const homeDir = os.homedir()
  return path.join(homeDir, 'Desktop', paths)
}

// 项目根目录
export const ROOT_DIR = path.resolve(__dirname, '../')

// 获取项目绝对路径
export function getProjectPath(paths: string): string {
  return path.join(ROOT_DIR, paths)
}
