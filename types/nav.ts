export interface NavLink {
  icon?: string | { svg: string }
  title?: string
  desc?: string
  link: string
  remoteRepo?: string
  localPath?: string
  homepage?: string
}
