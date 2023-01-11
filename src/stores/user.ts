import type { UserState, User } from '@/types'
import { defineStore } from 'pinia'

export const useUser = defineStore('userInfo', {
  state: (): UserState => {
    return {
      user: {} as User,
      token: ''
    }
  },
  actions: {
    setUser(user: User) {
      this.user = user
    },
    getUser() {
      return this.user
    },
    setToken(token: string) {
      this.token = token
    },
    getToken() {
      return this.token
    },
    clearUser() {
      this.user = {} as User
      this.token = ''
    }
  },
  persist: {
    storage: sessionStorage
  }
})
