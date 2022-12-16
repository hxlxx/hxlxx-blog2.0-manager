import type {
  ArticleCategory,
  ArticleTag,
  ARTICLE_STATUS,
  QueryInfo
} from '@/types'
import request from '@/utils'

//文章
export const addArticle = (options: any) => {
  return request.post('/api/article', options)
}
export const getArticleList = (type?: ARTICLE_STATUS, query?: QueryInfo) => {
  const url = `/api/article${type ? `/${type}` : ''}?skip=${
    query?.skip || 0
  }&limit=${query?.limit || 0}`
  return request.get(url)
}
export const getArticleById = (id: number) => {
  return request.get(`/api/article/${id}`)
}
export const removeArticleById = (id: number) => {
  return request.delete(`/api/article/${id}`)
}

// 文章分类
export const getCategoryList = () => {
  return request.get('/api/category')
}
export const getCategoryById = (id: number) => {
  return request.get(`/api/category/${id}`)
}
export const updateCategoryById = ({ id, category_name }: ArticleCategory) => {
  return request.patch(`/api/category/${id}`, {
    data: { category_name }
  })
}
export const createCategory = (category_name: string) => {
  return request.post('/api/category', {
    data: { category_name }
  })
}
export const removeCategoryById = (id: number) => {
  return request.delete(`/api/category/${id}`)
}

// 文章标签
export const getTagList = () => {
  return request.get('/api/tag')
}
export const getTagById = (id: number) => {
  return request.get(`/api/tag/${id}`)
}
export const updateTagById = ({ id, tag_name }: ArticleTag) => {
  return request.patch(`/api/tag/${id}`, {
    data: { tag_name }
  })
}
export const createTag = (tag_name: string) => {
  return request.post('/api/tag', {
    data: { tag_name }
  })
}
export const removeTagById = (id: number) => {
  return request.delete(`/api/tag/${id}`)
}
