<script setup lang="ts">
import { ref, reactive, toRaw, watch } from 'vue'
import MdEditor from 'md-editor-v3'
import type { UploadFile, UploadInstance } from 'element-plus'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import {
  ARTICLE_TYPE,
  type Article,
  type ArticleTag,
  type ArticleCategory
} from '@/types'
import { Message } from '@/utils'
import { addArticle } from '@/api'
import CategorySelector from './components/category-selector.vue'
import { useRoute } from 'vue-router'
import { useArticle } from '@/stores'

const route = useRoute()
const articleStore = useArticle()

const uploadRef = ref<UploadInstance>()
const articleTypes = [
  {
    value: 'original',
    label: '原创'
  },
  {
    value: 'reproduce',
    label: '转载'
  },
  {
    value: 'translate',
    label: '翻译'
  }
]
const tags = ref<ArticleTag[]>([
  {
    id: 1,
    tag_name: 'js'
  },
  {
    id: 2,
    tag_name: 'java'
  },
  {
    id: 3,
    tag_name: 'python'
  },
  {
    id: 4,
    tag_name: 'mysql'
  }
])
const categories = ref<ArticleCategory[]>([
  {
    id: 1,
    category_name: '前端'
  },
  {
    id: 2,
    category_name: '后端'
  },
  {
    id: 3,
    category_name: '技术'
  }
])
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
  tag_ids: [],
  cover_url: '',
  article_type: ARTICLE_TYPE.ORIGINAL,
  status: false,
  top: false,
  recommend: false,
  privacy: false
})
const articleForm = reactive<Article>(formInitial())

watch(
  () => route.params.id,
  (newVal) => {
    if (newVal) {
      const article = articleStore.getArticle()
      Object.assign(articleForm, article)
      fileList.value.push({ url: article.cover_url } as any)
    } else {
      Object.assign(articleForm, formInitial())
    }
  },
  {
    immediate: true
  }
)

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
  articleDialogVisible.value = true
}
// 关闭对话框
const beforeCloseDialog = () => {
  articleDialogVisible.value = false
}
// 打开对话框
const handleOpenDialog = () => {
  articleForm.description = articleForm.content.slice(0, 100)
}
// 图片上传成功，并上传文章
const handleCoverSuccess = async (response: any) => {
  articleForm.cover_url = response.data
  if (!articleForm.cover_url) {
    return Message({
      type: 'error',
      message: '封面上传错误，请重新上传'
    })
  }
  const article = toRaw(articleForm)
  const { code } = await addArticle({ data: article })
  if (code === 200) {
    Message({
      type: 'success',
      message: '发布成功！'
    })
    handleResetForm()
    articleForm.title = ''
    articleForm.content = ''
  }
  articleDialogVisible.value = false
}
// 提交文章
const handleSubmitArticle = () => {
  if (!articleForm.category_id) {
    return Message({
      type: 'error',
      message: '请选择文章分类'
    })
  }
  if (!articleForm.tag_ids.length) {
    return Message({
      type: 'error',
      message: '请添加文章标签'
    })
  }
  if (!articleForm.article_type) {
    return Message({
      type: 'error',
      message: '请选择文章类型'
    })
  }
  if (articleForm.description.length < 100) {
    return Message({
      type: 'error',
      message: '文章摘要不满足要求'
    })
  }
  articleForm.status = true
  uploadRef.value!.submit()
}
// 存为草稿
const handleSaveAsDraft = async () => {
  if (!articleForm.title) {
    return Message({
      type: 'error',
      message: '草稿请至少填写标题'
    })
  }
  const article = toRaw(articleForm)
  const { data } = await addArticle({ data: article })
  if (Object.keys(data).length > 0) {
    Message({
      type: 'success',
      message: '保存草稿成功！'
    })
    handleResetForm()
    articleForm.title = ''
    articleForm.content = ''
  }
}
// 重置表单
const handleResetForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title, content, ...rest } = formInitial()
  Object.assign(articleForm, rest)
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
    <div class="flex mb-[10px]">
      <el-input
        v-model="articleForm.title"
        placeholder="请输入文章标题"
      ></el-input>
      <el-button type="primary" class="ml-4" @click="handleSaveAsDraft"
        >存为草稿</el-button
      >
      <el-button @click="handlePublishArticle">发布</el-button>
    </div>
    <MdEditor
      v-model="articleForm.content"
      placeholder="请输入内容..."
      :style="{
        height: 'calc(100% - 40px)'
      }"
    />
  </div>
  <el-dialog
    title="添加文章"
    width="50%"
    v-model="articleDialogVisible"
    :before-close="beforeCloseDialog"
    @open="handleOpenDialog"
  >
    <el-form :model="articleForm" label-width="80px">
      <el-form-item label="文章分类">
        <category-selector
          v-model="articleForm.category_id"
          :categories="categories"
        />
      </el-form-item>
      <el-form-item label="文章标签">
        <el-select
          v-model="articleForm.tag_ids"
          style="width: 200px"
          multiple
          filterable
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择标签(最多三个)"
          tag-type="success"
          :multiple-limit="3"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.tag_name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章类型">
        <el-select
          placeholder="Select"
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
          v-model="articleForm.description"
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
          ref="uploadRef"
          action="/api/article/cover"
          list-type="picture-card"
          v-model:file-list="fileList"
          :limit="1"
          :auto-upload="false"
          :on-success="handleCoverSuccess"
        >
          <el-icon><Plus /></el-icon>
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
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemoveFile"
                >
                  <el-icon><Delete /></el-icon>
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
        <el-button type="primary" @click="handleSubmitArticle">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
