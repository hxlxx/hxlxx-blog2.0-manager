import request from '@/utils'

export const login = (url: string, data: any) => {
  return request.post(url, data)
}
