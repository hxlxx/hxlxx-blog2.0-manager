import type { Article } from '@/types'
import type { ArticleState } from '@/types/store/article'
import { defineStore } from 'pinia'

export const useArticle = defineStore('article', {
  state: (): ArticleState => ({
    articleMap: {},
    reserve: {} as Article
  }),
  actions: {
    setArticle(id: string, article: Article) {
      this.articleMap[id] = article
    },
    getArticle(id: string) {
      return this.articleMap[id]
    },
    setReserve(reserve: Article) {
      this.reserve = reserve
    },
    clearArticle() {
      this.articleMap = {}
    },
    clearArticleById(id: string) {
      this.articleMap[id] = {} as Article
    }
  },
  persist: {
    storage: sessionStorage
  }
})
