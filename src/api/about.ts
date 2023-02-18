import { request } from '@/utils'
import type { AxiosRequestConfig } from 'axios'

export const getAbout = () => {
  return request.get('/about')
}
export const updateAbout = (id: number, options: AxiosRequestConfig) => {
  return request.patch(`/about/${id}`, options)
}
