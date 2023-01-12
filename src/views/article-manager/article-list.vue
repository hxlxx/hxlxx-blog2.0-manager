<script lang="ts" setup>
import {
  getArticleList,
  getArticleById,
  updateArticleTop,
  updateArticleRecommend,
  searchArticle
} from '@/api'
import { useArticle } from '@/stores'
import { ARTICLE_STATUS, type Article, type QueryInfo } from '@/types'
import { Message } from '@/utils'
import { onBeforeMount, ref, reactive, onActivated } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const articleStore = useArticle()

const articleList = ref<Article[]>([])
const query = reactive<QueryInfo>({
  skip: 0,
  limit: 10,
  page: 1,
  total: 0,
  keyword: ''
})
const articleStatus = ref<ARTICLE_STATUS>(ARTICLE_STATUS.PUBLISHED)
const loading = ref<boolean>(false)

const article_type = (type: string) => {
  switch (type) {
    case 'original':
      return '原创'
    case 'reproduce':
      return '转载'
    case 'translate':
      return '翻译'
    default:
      return ''
  }
}

onBeforeMount(() => {
  initArticleList()
})
onActivated(() => {
  initArticleList()
})
// 初始化文章列表
const initArticleList = async () => {
  loading.value = true
  const { data } =
    (await getArticleList(articleStatus.value, {
      skip: (query.page! - 1) * query.limit!,
      limit: query.limit
    })) || {}
  articleList.value = data?.res
  query.total = data?.count
  loading.value = false
}
// 切换分页
const handleChangePage = (page: number) => {
  query.page = page
  query.keyword ? handleSearchArticle() : initArticleList()
}
// 已发布
const handleShowPublishedArticle = () => {
  if (articleStatus.value !== ARTICLE_STATUS.PUBLISHED) {
    articleStatus.value = ARTICLE_STATUS.PUBLISHED
    initArticleList()
  }
}
// 草稿
const handleShowDraftArticle = () => {
  if (articleStatus.value !== ARTICLE_STATUS.DRAFT) {
    articleStatus.value = ARTICLE_STATUS.DRAFT
    initArticleList()
  }
}
// 编辑
const handleEditArticle = async (id: number) => {
  const { data } = (await getArticleById(id)) || {}
  articleStore.setArticle(id + '', data?.res)
  router.push({ name: 'edit-article', params: { id } })
}
// 删除
const handleRemoveArticle = (id: number) => {
  console.log(id)
}
// 修改置顶状态
const handleChangeTop = async (top: boolean, id: number) => {
  loading.value = true
  const { code } = (await updateArticleTop({ data: { id, top } })) || {}
  if (code === 200) {
    Message({
      type: top ? 'success' : 'warning',
      message: top ? '文章置顶成功！' : '文章已取消置顶！'
    })
  }
  loading.value = false
}
// 修改推荐状态
const handleChangeRecommend = async (recommend: boolean, id: number) => {
  loading.value = true
  const { code } =
    (await updateArticleRecommend({ data: { id, recommend } })) || {}
  if (code === 200) {
    Message({
      type: recommend ? 'success' : 'warning',
      message: recommend ? '文章推荐成功！' : '文章已取消推荐'
    })
  }
  loading.value = false
}
// 搜索文章
const handleSearchArticle = async () => {
  loading.value = true
  const { data } = (await searchArticle(query)) || {}
  articleList.value = data?.res
  query.total = data?.count
  loading.value = false
}
</script>

<template>
  <div>
    <div class="flex items-center mb-3">
      <el-button
        plain
        type="primary"
        size="small"
        @click="handleShowPublishedArticle"
      >
        已发布
      </el-button>
      <el-button
        plain
        type="danger"
        size="small"
        @click="handleShowDraftArticle"
      >
        草稿
      </el-button>
      <div class="flex items-center gap-2 ml-auto">
        <el-input v-model="query.keyword" placeholder="搜索文章" />
        <el-button
          plain
          type="primary"
          :disabled="!query.keyword?.trim().length"
          @click="handleSearchArticle"
        >
          <h-icon class="mr-1" icon="search" />
          搜索
        </el-button>
      </div>
    </div>
    <el-table
      border
      v-loading="loading"
      :data="articleList"
      :header-cell-style="{
        color: '#606266',
        'text-align': 'center'
      }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column prop="id" label="文章编号" width="100" />
      <el-table-column label="文章封面" width="160px">
        <template #default="{ row }">
          <el-image
            style="width: 120px; height: 80px; border-radius: 5px"
            :src="row.cover_url"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文章标题" />
      <el-table-column label="文章类型" width="120px">
        <template #default="{ row }">
          <el-tag v-if="row.article_type">
            {{ article_type(row.article_type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="文章分类" width="120px">
        <template #default="{ row }">
          <el-tag v-if="row.category">{{ row.category.category_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="文章标签">
        <template #default="{ row }">
          <template v-if="row.tags.length">
            <el-tag
              class="mr-3"
              type="success"
              v-for="tag in row.tags"
              :key="tag.id"
            >
              {{ tag.tag_name }}
            </el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="160px">
        <template #default="{ row }">
          <h-icon icon="time" />
          {{ dateFormat(row.created_at).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="置顶" width="100px">
        <template #default="{ row }">
          <el-switch
            v-model="row.top"
            @change="(value: boolean) => handleChangeTop(value, row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column label="推荐" width="100px">
        <template #default="{ row }">
          <el-switch
            v-model="row.recommend"
            @change="(value: boolean) => handleChangeRecommend(value, row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template #default="{ row }">
          <el-button
            plain
            type="primary"
            size="small"
            @click="handleEditArticle(row.id)"
          >
            <h-icon class="mr-1" icon="edit" size="14px" />
            <span>编辑</span>
          </el-button>
          <el-button
            plain
            type="danger"
            size="small"
            @click="handleRemoveArticle(row.id)"
          >
            <h-icon class="mr-1" icon="delete" size="14px" />
            <span>删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="w-full flex justify-center mt-3">
      <el-pagination
        background
        layout="prev, pager, next"
        hide-on-single-page
        :page-size="query.limit"
        :total="query.total"
        @current-change="handleChangePage"
      />
    </div>
  </div>
</template>
