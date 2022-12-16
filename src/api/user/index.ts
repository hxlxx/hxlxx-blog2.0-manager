import request from '@/utils'

export const login = (options: any) => {
  return request.post('/api/login', options)
}
