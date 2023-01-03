import type { Article, ArticleCategory, ArticleTag } from '../views/article'

export type ArticleState = {
  articleMap: { [id: string]: Article }
  tagList: ArticleTag[]
  categoryList: ArticleCategory[]
}
