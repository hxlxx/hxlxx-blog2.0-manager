import type { UploadFile } from 'element-plus'

export enum ARTICLE_TYPE {
  ORIGINAL = 'original',
  REPRODUCE = 'reproduce',
  TRANSLATE = 'translate'
}
export enum ARTICLE_PRIVACY {
  PUBLIC,
  PRIVATE
}

export type ArticleTag = {
  id: number
  tag_name: string
}

export type ArticleCategory = {
  id: number
  category_name: string
}

export type AddArticleForm = {
  title: string
  content: string
  description: string
  category: ArticleCategory
  tags: ArticleTag[]
  file_list: UploadFile[]
  article_type: ARTICLE_TYPE
  top: boolean
  recommend: boolean
  privacy: ARTICLE_PRIVACY
}
