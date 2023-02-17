import type { Talk, TalkState } from '@/types'

export const useTalk = defineStore('talk', {
  state: (): TalkState => ({
    talkMap: {}
  }),
  actions: {
    setTalk(id: number, talk: Talk) {
      this.talkMap[id] = talk
    },
    getTalk(id: number) {
      return this.talkMap[id]
    }
  },
  persist: {
    storage: sessionStorage
  }
})
