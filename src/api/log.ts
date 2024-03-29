import type { QueryInfo } from '@/types'
import { request } from '@/utils'
import type { AxiosRequestConfig } from 'axios'

// 日志管理
export const getOperationLog = (query?: QueryInfo) => {
  return request.get(
    `/log/operation?skip=${query?.skip || 0}&limit=${query?.limit || 0}`
  )
}
// 获取某条操作日志
export const getOperationLogById = (id: number) => {
  return request.get(`/log/operation/${id}`)
}
// 删除某条日志
export const removeOperationLogById = (options: AxiosRequestConfig) => {
  return request.delete('/log/operation/remove-one', options)
}
// 批量删除
export const removeOperationLogByIds = (options: AxiosRequestConfig) => {
  return request.delete('/log/operation/remove-all', options)
}
