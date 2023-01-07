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
  removeUser()
}

export const setUser = (user: object) => {
  sessionStorage.setItem('user', JSON.stringify(user))
}

export const getUser = () => {
  return JSON.parse(sessionStorage.getItem('user') || '')
}

export const removeUser = () => {
  sessionStorage.removeItem('user')
}
