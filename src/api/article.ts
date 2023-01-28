import type {
  ArticleCategory,
  ArticleTag,
  ARTICLE_STATUS,
  QueryInfo
} from '@/types'
import { request } from '@/utils'
import type { AxiosRequestConfig } from 'axios'

//文章
export const createArticle = (options: AxiosRequestConfig) => {
  return request.post('/article', options)
}
// 创建草稿
export const createDraft = (options: AxiosRequestConfig) => {
  return request.post('/article/draft', options)
}
// 更新文章
export const updateArticle = (options: AxiosRequestConfig) => {
  return request.patch('/article', options)
}
// 更新草稿
export const updateDraft = (options: AxiosRequestConfig) => {
  return request.patch('/article/draft', options)
}
// 获取文章列表，带分页
export const getArticleList = (type?: ARTICLE_STATUS, query?: QueryInfo) => {
  const url = `/article${type ? `/${type}` : ''}?skip=${
    query?.skip || 0
  }&limit=${query?.limit || 0}`
  return request.get(url)
}
// 获取访问量前五的文章
export const getArticleTopFive = () => {
  return request.get('/article/top5')
}
// 获取某篇文章
export const getArticleById = (id: number) => {
  return request.get(`/article/${id}`)
}
// 删除某篇文章
export const removeArticleById = (id: number) => {
  return request.delete(`/article/${id}`)
}
// 搜索文章
export const searchArticle = (query?: QueryInfo) => {
  return request.get(
    `/article/search?keyword=${query?.keyword || ''}&limit=${
      query?.limit || 0
    }&skip=${query?.skip || 0}`
  )
}
// 修改文章置顶和推荐状态
export const updateArticleTop = (options: AxiosRequestConfig) => {
  return request.patch('/article/top', options)
}
export const updateArticleRecommend = (options: AxiosRequestConfig) => {
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
export const removeCategoryById = (options: AxiosRequestConfig) => {
  return request.delete('/category/remove-one', options)
}
export const removeCategoryByIds = (options: AxiosRequestConfig) => {
  return request.delete('/category/remove-all', options)
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
export const removeTagById = (options: AxiosRequestConfig) => {
  return request.delete('/tag/remove-one', options)
}
export const removeTagByIds = (options: AxiosRequestConfig) => {
  return request.delete('/tag/remove-all', options)
}
