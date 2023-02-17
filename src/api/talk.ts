import type { QueryInfo } from '@/types'
import { request } from '@/utils'
import type { AxiosRequestConfig } from 'axios'

// 发布说说
export const createTalk = (options: AxiosRequestConfig) => {
  return request.post('/talk', options)
}
// 获取说说列表
export const getTalkList = ({ skip, limit }: QueryInfo) => {
  return request.get(`/talk?skip=${skip || 0}&limit=${limit || 0}`)
}
// 获取说说列表
export const getTalkById = (id: number) => {
  return request.get(`/talk/${id}`)
}
// 编辑说说
export const updateTalk = (options: AxiosRequestConfig) => {
  return request.patch('/talk', options)
}
// 删除说说
export const removeTalkById = (id: number) => {
  return request.delete(`/talk/${id}`)
}
