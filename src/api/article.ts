import type {
  ArticleCategory,
  ArticleTag,
  ARTICLE_STATUS,
  QueryInfo
} from '@/types'
import request from '@/utils'

//文章
export const createArticle = (options: any) => {
  return request.post('/article', options)
}
export const createDraft = (options: any) => {
  return request.post('/article/draft', options)
}
export const updateArticle = (options: any) => {
  return request.patch('/article', options)
}
export const updateDraft = (options: any) => {
  return request.patch('/article/draft', options)
}
export const getArticleList = (type?: ARTICLE_STATUS, query?: QueryInfo) => {
  const url = `/article${type ? `/${type}` : ''}?skip=${
    query?.skip || 0
  }&limit=${query?.limit || 0}`
  return request.get(url)
}
export const getArticleById = (id: number) => {
  return request.get(`/article/${id}`)
}
export const removeArticleById = (id: number) => {
  return request.delete(`/article/${id}`)
}

// 修改文章置顶和推荐状态
export const updateArticleTop = (options: any) => {
  return request.patch('/article/top', options)
}
export const updateArticleRecommend = (options: any) => {
  return request.patch('/article/recommend', options)
}

// 文章分类
export const getCategoryList = () => {
  return request.get('/category')
}
export const getCategoryById = (id: number) => {
  return request.get(`/category/${id}`)
}
export const updateCategoryById = ({ id, category_name }: ArticleCategory) => {
  return request.patch(`/category/${id}`, {
    data: { category_name }
  })
}
export const createCategory = (category_name: string) => {
  return request.post('/category', {
    data: { category_name }
  })
}
export const removeCategoryById = (id: number) => {
  return request.delete(`/category/${id}`)
}

// 文章标签
export const getTagList = () => {
  return request.get('/tag')
}
export const getTagById = (id: number) => {
  return request.get(`/tag/${id}`)
}
export const updateTagById = ({ id, tag_name }: ArticleTag) => {
  return request.patch(`/tag/${id}`, {
    data: { tag_name }
  })
}
export const createTag = (tag_name: string) => {
  return request.post('/tag', {
    data: { tag_name }
  })
}
export const removeTagById = (id: number) => {
  return request.delete(`/tag/${id}`)
}
