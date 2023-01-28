import { request } from '@/utils'

export const getSiteInfo = () => {
  return request.get('/site/info')
}
