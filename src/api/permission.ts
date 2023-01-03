import request from '@/utils/request'

// 菜单
export const addMenu = (options: any) => {
  return request.post('/api/menu', options)
}
export const getMenuList = () => {
  return request.get('/api/menu')
}
export const removeMenu = (id: number) => {
  return request.delete(`/api/menu/${id}`)
}
export const getMenuById = (id: number) => {
  return request.get(`/api/menu/${id}`)
}
export const updateMenu = (options: any) => {
  return request.patch('/api/menu', options)
}
export const updateMenuVisible = (options: any) => {
  return request.patch('/api/menu/visible', options)
}
