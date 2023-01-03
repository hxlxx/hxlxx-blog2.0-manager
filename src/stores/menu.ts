import type { MenuState } from '@/types/store/menu'
import { defineStore } from 'pinia'

export const useMenu = defineStore('menuList', {
  state: (): MenuState => {
    return {
      collapse: false
    }
  },
  actions: {
    setMenuCollapse(collapse: boolean) {
      this.collapse = collapse
    }
  },
  getters: {
    width(): number {
      return this.collapse ? 65 : 200
    }
  }
})
