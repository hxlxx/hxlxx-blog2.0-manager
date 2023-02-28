import { request } from '@/utils'
import type { AxiosRequestConfig } from 'axios'

export const getSiteConfig = () => {
  return request.get('/site/config')
}
export const updateSiteConfig = (options: AxiosRequestConfig) => {
  return request.patch('/site/config', options)
}
export const updateUserDefaultAvatar = (options: AxiosRequestConfig) => {
  return request.patch('/site/default-avatar', options)
}
