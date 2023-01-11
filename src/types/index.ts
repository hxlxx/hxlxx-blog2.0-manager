export * from './store/article'
export * from './store/menu'
export * from './store/nav-tags'
export * from './store/user'
export * from './views/article'
export * from './views/menu'
export * from './views/login'
export * from './views/permission'
export * from './views/user'

export type ResponseData = {
  code: number
  data: any
  message: any
  status: string
}

export type QueryInfo = {
  skip?: number
  limit?: number
  page?: number
  total?: number
}
