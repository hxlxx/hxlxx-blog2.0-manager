import type { Article } from '@/types'
import type { ArticleState } from '@/types/store/article'
import { defineStore } from 'pinia'

export const useArticle = defineStore('article', {
  state: (): ArticleState => {
    return {
      articleMap: {}
    }
  },
  actions: {
    setArticle(id: string, article: Article) {
      this.articleMap[id] = article
    },
    getArticle(id: string) {
      return this.articleMap[id]
    }
  },
  persist: {
    paths: ['articleMap'],
    storage: sessionStorage
  }
})
