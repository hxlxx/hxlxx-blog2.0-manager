import request from '@/utils'
import type { AxiosRequestConfig } from 'axios'

export const login = (options: AxiosRequestConfig) => {
  return request.post('/login', options)
}

export const getUserList = () => {
  return request.get('/user')
}

export const updateUserRole = (options: AxiosRequestConfig) => {
  return request.patch('/user/role', options)
}

export const updateUserStatus = (options: AxiosRequestConfig) => {
  return request.patch('/user/status', options)
}
