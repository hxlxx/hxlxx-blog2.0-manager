import { request } from '@/utils'
import type { AxiosRequestConfig } from 'axios'

// 菜单
export const createMenu = (options: AxiosRequestConfig) => {
  return request.post('/menu', options)
}
export const getMenuList = () => {
  return request.get('/menu')
}
export const removeMenu = (id: number) => {
  return request.delete(`/menu/${id}`)
}
export const getMenuById = (id: number) => {
  return request.get(`/menu/${id}`)
}
export const updateMenu = (options: AxiosRequestConfig) => {
  return request.patch('/menu', options)
}
export const updateMenuVisible = (options: AxiosRequestConfig) => {
  return request.patch('/menu/visible', options)
}
// 角色
export const getRoleList = () => {
  return request.get('/role')
}
export const createRole = (options: AxiosRequestConfig) => {
  return request.post('/role', options)
}
export const updateRolePermission = (options: AxiosRequestConfig) => {
  return request.patch('/role', options)
}
export const getPermissionMenu = () => {
  return request.get('/role/menu')
}
export const removeRoleById = (id: number) => {
  return request.delete(`/role/${id}`)
}
