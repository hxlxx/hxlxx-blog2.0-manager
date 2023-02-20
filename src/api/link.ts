import type { QueryInfo } from '@/types'
import { request } from '@/utils'
import type { AxiosRequestConfig } from 'axios'

export const getLinkList = (query: QueryInfo) => {
  return request.get(
    `/link/all?skip=${query.skip || 0}&limit=${query.limit || 0}`
  )
}
export const updateLink = (options: AxiosRequestConfig) => {
  return request.patch('/link', options)
}
export const removeLinkById = (options: AxiosRequestConfig) => {
  return request.delete('/link/remove-one', options)
}
export const removeLinkByIds = (options: AxiosRequestConfig) => {
  return request.delete('/link/remove-all', options)
}
