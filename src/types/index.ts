export * from './store/article'
export * from './store/menu'
export * from './store/nav-tags'
export * from './store/user'
export * from './store/talk'
export * from './views/article'
export * from './views/menu'
export * from './views/login'
export * from './views/permission'
export * from './views/user'
export * from './views/log'
export * from './views/home'
export * from './views/site-config'
export * from './views/comment'
export * from './views/talks'
export * from './views/links'

export type ResponseData = {
  code: number
  data: any
  message: any
  status: string
}

export type QueryInfo = {
  page?: number
  skip?: number
  limit?: number
  total?: number
  keyword?: string
}
