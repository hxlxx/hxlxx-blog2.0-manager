<script lang="ts" setup>
import { getArticleList, getArticleById } from '@/api'
import { useArticle } from '@/stores'
import { ARTICLE_STATUS, type Article, type QueryInfo } from '@/types'
import { onBeforeMount, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const articleStore = useArticle()
const router = useRouter()

const articleList = ref<Article[]>([])
const query = reactive<QueryInfo>({
  skip: 0,
  limit: 10,
  page: 1,
  total: 0
})
const articleStatus = ref<ARTICLE_STATUS>(ARTICLE_STATUS.PUBLISHED)

onBeforeMount(() => {
  initArticleList()
})
// 初始化文章列表
const initArticleList = async () => {
  const { data } = await getArticleList(articleStatus.value, {
    skip: (query.page! - 1) * query.limit!,
    limit: query.limit
  })
  articleList.value = data.res
  query.total = data.count
}
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
// 切换分页
const handleChangePage = (page: number) => {
  query.page = page
  initArticleList()
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
  const { data } = await getArticleById(id)
  articleStore.setArticle(data)
  router.push({ name: 'edit-article', params: { id } })
}
// 删除
const handleRemoveArticle = (id: number) => {
  console.log(id)
}
</script>

<template>
  <div class="mb-3">
    <el-button
      plain
      type="primary"
      size="small"
      @click="handleShowPublishedArticle"
    >
      已发布
    </el-button>
    <el-button plain type="danger" size="small" @click="handleShowDraftArticle">
      草稿
    </el-button>
  </div>
  <el-table
    border
    :data="articleList"
    :header-cell-style="{
      color: '#606266',
      'text-align': 'center'
    }"
    :cell-style="{ 'text-align': 'center' }"
  >
    <el-table-column prop="id" label="文章编号" width="100" />
    <el-table-column label="文章封面" width="160">
      <template #default="{ row }">
        <el-image
          style="width: 120px; height: 80px; border-radius: 5px"
          :src="row.cover_url"
          fit="cover"
        />
      </template>
    </el-table-column>
    <el-table-column prop="title" label="文章标题" />
    <el-table-column label="文章类型" width="120">
      <template #default="{ row }">
        <el-tag v-if="row.article_type">
          {{ article_type(row.article_type) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="文章分类" width="120">
      <template #default="{ row }">
        <el-tag v-if="row.category">{{ row.category.category_name }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="文章标签">
      <template #default="{ row }">
        <template v-if="row.tags.length">
          <el-tag class="mr-3" v-for="tag in row.tags" :key="tag.id">
            {{ tag.tag_name }}
          </el-tag>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="发布时间" width="120">
      <template #default="{ row }">
        <span>{{ dateFormat(row.created_at).format('YYYY-MM-DD') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="置顶" width="100">
      <template #default="{ row }">
        <el-switch v-model="row.top"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="推荐" width="100">
      <template #default="{ row }">
        <el-switch v-model="row.recommend"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template #default="{ row }">
        <el-button
          type="primary"
          size="small"
          @click="handleEditArticle(row.id)"
        >
          编辑
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="handleRemoveArticle(row.id)"
        >
          删除
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
</template>
