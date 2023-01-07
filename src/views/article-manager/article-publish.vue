<script setup lang="ts">
import { ref, reactive, toRaw, watch } from 'vue'
import MdEditor from 'md-editor-v3'
import type { UploadFile } from 'element-plus'
import {
  ARTICLE_TYPE,
  type Article,
  type ArticleTag,
  type ArticleCategory
} from '@/types'
import { Message } from '@/utils'
import {
  createArticle,
  updateArticle,
  getTagList,
  getCategoryList,
  createDraft,
  updateDraft
} from '@/api'
import { useRoute, useRouter } from 'vue-router'
import { useArticle, useNavTags } from '@/stores'
import { articleTypes } from './constants'
import CategorySelector from './components/category-selector.vue'
import TagsSelector from './components/tags-selector.vue'

const route = useRoute()
const router = useRouter()
const articleStore = useArticle()
const navTagStore = useNavTags()

const uploadUrl = ref<string>(import.meta.env.VITE_UPLOAD_URL)
const uploadToken = ref<string>(import.meta.env.VITE_UPLOAD_TOKEN)
const imgBaseUrl = import.meta.env.VITE_IMG_BASE_URL
const tags = ref<ArticleTag[]>([])
const categories = ref<ArticleCategory[]>([])
const articleDialogVisible = ref<boolean>(false)
const previewImageUrl = ref<string>('')
const imgPreviewDialogVisible = ref<boolean>(false)
const fileList = ref<UploadFile[]>([])
const formInitial = () => ({
  author_id: 1,
  title: '',
  content: '',
  description: '',
  category_id: 0,
  category: undefined,
  tag_ids: [],
  tags: [],
  cover_url: '',
  article_type: ARTICLE_TYPE.ORIGINAL,
  status: false,
  top: false,
  recommend: false,
  privacy: false
})
const articleForm = reactive<Article>(formInitial())
const saveOrEdit = ref<boolean>()

watch(
  () => route.params.id,
  (newVal) => {
    saveOrEdit.value = !route.params.id
    if (newVal) {
      const article = articleStore.getArticle(newVal as string)
      Object.assign(articleForm, article)
      fileList.value = [{ url: article.cover_url } as any]
    } else {
      Object.assign(articleForm, formInitial())
      fileList.value = []
    }
  },
  { immediate: true }
)

// 初始化文章选项
const initArticleOptions = async () => {
  const { data: tagList } = await getTagList()
  const { data: categoryList } = await getCategoryList()
  tags.value = tagList.res
  categories.value = categoryList.res
}
// 发布文章
const handlePublishArticle = () => {
  if (!articleForm.title) {
    return Message({
      type: 'error',
      message: '请先输入文章标题'
    })
  }
  if (!articleForm.content) {
    return Message({
      type: 'error',
      message: '请先输入文章内容'
    })
  }
  initArticleOptions()
  articleDialogVisible.value = true
}
// 打开对话框
const handleOpenDialog = () => {
  articleForm.description = articleForm.description
    ? articleForm.description
    : articleForm.content.slice(0, 100)
}
// 更新完文章后清理路由
const clearRoute = () => {
  if (!saveOrEdit.value) {
    navTagStore.removeNavTag(route.path, true)
    router.push({ path: '/article/list' })
  }
}
// 图片上传成功，获取图片 url
const handleCoverSuccess = async (response: any) => {
  articleForm.cover_url = imgBaseUrl + response.hash
  if (!articleForm.cover_url) {
    return Message({
      type: 'error',
      message: '封面上传错误，请重新上传'
    })
  }
}
// 提交文章
const handleSubmitArticle = async () => {
  if (!articleForm.category_id) {
    return Message({
      type: 'error',
      message: '请选择文章分类！'
    })
  }
  if (!articleForm.tag_ids.length) {
    return Message({
      type: 'error',
      message: '请添加文章标签！'
    })
  }
  if (!articleForm.article_type) {
    return Message({
      type: 'error',
      message: '请选择文章类型！'
    })
  }
  if (articleForm.description.length < 100) {
    return Message({
      type: 'error',
      message: '文章摘要不满足要求！'
    })
  }
  articleForm.status = true
  const article = toRaw(articleForm)
  const { code } =
    (saveOrEdit.value
      ? await createArticle({ data: article })
      : await updateArticle({ data: article })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: saveOrEdit.value ? '发布成功！' : '更新成功！'
    })
    clearRoute()
    handleResetForm()
  }
  articleDialogVisible.value = false
}
// 保存或更新草稿
const handleSaveOrUpdateAsDraft = async () => {
  if (!articleForm.title) {
    return Message({
      type: 'error',
      message: '草稿请至少填写标题！'
    })
  }
  const article = toRaw(articleForm)
  const { code } =
    (saveOrEdit.value
      ? await createDraft({ data: article })
      : await updateDraft({ data: article })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '保存草稿成功！'
    })
    clearRoute()
    handleResetForm()
  }
}
// 重置表单
const handleResetForm = () => {
  Object.assign(articleForm, formInitial())
}
// 图片预览
const handlePictureCardPreview = (file: UploadFile) => {
  previewImageUrl.value = file.url!
  imgPreviewDialogVisible.value = true
}
// 删除文件
const handleRemoveFile = () => {
  articleForm.cover_url = ''
  fileList.value = []
}
</script>

<template>
  <div class="h-full">
    <div class="h-full">
      <div class="flex mb-[10px]">
        <el-input
          v-model.trim="articleForm.title"
          placeholder="请输入文章标题"
        ></el-input>
        <el-button
          type="primary"
          class="ml-4"
          @click="handleSaveOrUpdateAsDraft"
          :disabled="!saveOrEdit && articleForm.status"
        >
          {{ saveOrEdit ? '存为草稿' : '保存草稿' }}
        </el-button>
        <el-button @click="handlePublishArticle">发布</el-button>
      </div>
      <MdEditor
        v-model="articleForm.content"
        placeholder="请输入内容..."
        :style="{
          height: 'calc(100% - 100px)'
        }"
      />
    </div>
    <el-dialog
      title="添加文章"
      width="50%"
      align-center
      destroy-on-close
      v-model="articleDialogVisible"
      @open="handleOpenDialog"
    >
      <el-form :model="articleForm" label-width="80px">
        <el-form-item label="文章分类">
          <category-selector
            v-model="articleForm.category_id"
            :selected="articleForm.category"
            :categories="categories"
          />
        </el-form-item>
        <el-form-item label="文章标签">
          <tags-selector
            v-model="articleForm.tag_ids"
            :selected="articleForm.tags"
            :tags="tags"
          />
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select
            placeholder="请选择"
            tag-type="success"
            v-model="articleForm.article_type"
          >
            <el-option
              v-for="atype in articleTypes"
              :key="atype.value"
              :label="atype.label"
              :value="atype.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input
            type="textarea"
            v-model.trim="articleForm.description"
            resize="none"
            show-word-limit
            placeholder="请输入内容..."
            :maxLength="100"
          ></el-input>
          <span
            :class="[
              'absolute',
              'bottom-1',
              'right-2',
              'text-xs',
              'text-slate-400',
              articleForm.description.length < 100
                ? 'text-[var(--el-color-error)]'
                : ''
            ]"
          >
            {{ `${articleForm.description.length}/100` }}
          </span>
        </el-form-item>
        <el-form-item label="文章封面">
          <el-upload
            list-type="picture-card"
            v-model:file-list="fileList"
            :action="uploadUrl"
            :data="{ token: uploadToken }"
            :limit="1"
            :on-success="handleCoverSuccess"
          >
            <h-icon icon="plus" />
            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <h-icon icon="zoom-in" />
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemoveFile"
                  >
                    <h-icon icon="delete" />
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
          <el-dialog v-model="imgPreviewDialogVisible">
            <img w-full :src="previewImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch
            v-model="articleForm.top"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="推荐">
          <el-switch
            v-model="articleForm.recommend"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="发布形式">
          <el-radio-group class="ml-4" v-model="articleForm.privacy">
            <el-radio :label="false">公开</el-radio>
            <el-radio :label="true">私密</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="articleDialogVisible = false">
            关闭
          </el-button>
          <el-button type="info" @click="handleResetForm">重置</el-button>
          <el-button type="primary" @click="handleSubmitArticle"
            >提交</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
