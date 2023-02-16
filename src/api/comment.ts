import { request } from '@/utils'
import type { QueryInfo } from '@/types'
import type { AxiosRequestConfig } from 'axios'

export const getCommentList = (query?: QueryInfo) => {
  return request.get(
    `/comment/all?skip=${query?.skip || 0}&limit=${query?.limit || 0}`
  )
}
export const removeCommentById = (options: AxiosRequestConfig) => {
  return request.delete('/comment/remove-one', options)
}
export const removeCommentByIds = (options: AxiosRequestConfig) => {
  return request.delete('/comment/remove-all', options)
}
