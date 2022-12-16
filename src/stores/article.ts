import type { Article } from '@/types'
import type { ArticleState } from '@/types/store/article'
import { defineStore } from 'pinia'

export const useArticle = defineStore('article', {
  state: (): ArticleState => {
    return {
      article: {} as Article
    }
  },
  actions: {
    setArticle(article: Article) {
      this.article = article
    },
    getArticle() {
      return this.article
    }
  }
})
