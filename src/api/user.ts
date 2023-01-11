import request from '@/utils'

export const login = (options: any) => {
  return request.post('/login', options)
}

export const getUserList = () => {
  return request.get('/user')
}

export const updateUserRole = (options: any) => {
  return request.patch('/user/role', options)
}

export const updateUserStatus = (options: any) => {
  return request.patch('/user/status', options)
}
