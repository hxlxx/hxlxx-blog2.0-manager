export enum ARTICLE_TYPE {
  ORIGINAL = 'original',
  REPRODUCE = 'reproduce',
  TRANSLATE = 'translate'
}

export enum ARTICLE_STATUS {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

export type ArticleTag = {
  id: number
  tag_name: string
}

export type ArticleCategory = {
  id: number
  category_name: string
}

export type Article = {
  id?: number
  author_id: number
  title: string
  content: string
  description: string
  category_id: number
  tag_ids: number[]
  cover_url: string
  article_type: ARTICLE_TYPE
  status: boolean
  top: boolean
  recommend: boolean
  privacy: boolean
}
