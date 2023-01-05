import type { Article } from '../views/article'

export type ArticleState = {
  articleMap: { [id: string]: Article }
}
