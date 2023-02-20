import type { QueryInfo } from '@/types'
import { request } from '@/utils'
import type { AxiosRequestConfig } from 'axios'
// 登录
export const login = (options: AxiosRequestConfig) => {
  return request.post('/login', options)
}
// 获取用户列表
export const getUserList = (query: QueryInfo) => {
  return request.get(`/user?skip=${query.skip || 0}&limit=${query.limit || 0}`)
}
// 更新用户角色
export const updateUserRole = (options: AxiosRequestConfig) => {
  return request.patch('/user/role', options)
}
// 更新用户状态
export const updateUserStatus = (options: AxiosRequestConfig) => {
  return request.patch('/user/status', options)
}
// 更新用户头像
export const resetAvatar = (options: AxiosRequestConfig) => {
  return request.patch('/user/avatar', options)
}
// 更新用户名
export const resetUsername = (options: AxiosRequestConfig) => {
  return request.patch('/user/username', options)
}
// 重置密码
export const resetPassword = (options: AxiosRequestConfig) => {
  return request.patch('/user/password', options)
}
// 身份认证
export const authorization = () => {
  return request.get('/auth')
}
