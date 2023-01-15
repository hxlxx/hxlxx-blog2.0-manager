import { getMenuList } from '@/api'
import type { MenuState } from '@/types/store/menu'
import { defineStore } from 'pinia'

export const useMenu = defineStore('menuList', {
  state: (): MenuState => {
    return {
      menuList: [],
      collapse: false
    }
  },
  actions: {
    getMenuList() {
      return getMenuList().then(({ data }) => {
        this.menuList = data || []
      })
    },
    setMenuCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    clearMenuList() {
      this.menuList = []
    }
  },
  persist: {
    paths: ['menuList'],
    storage: sessionStorage
  }
})
