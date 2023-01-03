import { useNavTags } from '@/stores'

export const getToken = (): string | null => {
  return sessionStorage.getItem('token')
}

export const setToken = (token: string) => {
  sessionStorage.setItem('token', token)
}

export const removeToken = () => {
  sessionStorage.removeItem('token')
}

export const clearToken = () => {
  const navTagStore = useNavTags()
  navTagStore.initNavTag()
  removeToken()
}
