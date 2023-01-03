import type { NavTag, NavTagState } from '@/types/store/nav-tags'
import { defineStore } from 'pinia'

export const useNavTags = defineStore('navTags', {
  state: (): NavTagState => {
    return {
      navTags: [{ tag_name: '首页', path: '/home', active: true }]
    }
  },
  actions: {
    initNavTag() {
      this.navTags = [{ tag_name: '首页', path: '/home', active: true }]
    },
    setNavTag(tag: NavTag) {
      // 将所有 tag.active 置为 false，然后将当前 tag.active 置为 true
      this.navTags.forEach((tag) => (tag.active = false))
      const index = this.navTags.findIndex((_tag) => _tag.path === tag.path)
      if (index >= 0) {
        this.navTags[index].active = true
      } else {
        this.navTags = [...this.navTags, tag]
      }
    },
    setCurrentNavTag(path: string) {
      this.navTags.forEach((tag) => (tag.active = false))
      const index = this.navTags.findIndex((_tag) => _tag.path === path)
      this.navTags[index].active = true
    },
    removeNavTag(path: string, isCurrent: boolean) {
      // 移除 tag 时需要判断当前 tag.active 是否为 true，为 true 则将当前 tag 前一个 tag.active 置为 true
      const index = this.navTags.findIndex((tag) => tag.path === path)
      if (index > 0 && isCurrent) {
        this.navTags[index - 1].active = true
      }
      this.navTags = this.navTags.filter((tag) => tag.path !== path)
    }
  },
  persist: {
    storage: sessionStorage
  }
})
