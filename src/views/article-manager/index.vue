<script setup lang="ts">
import { ref, reactive } from 'vue'
import MdEditor from 'md-editor-v3'
import type { UploadFile } from 'element-plus'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import {
  ARTICLE_TYPE,
  type AddArticleForm,
  type ArticleTag,
  type ArticleCategory
} from '@/types/views/article-manager/article-add'
import { Message } from '@/utils'

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
const formInitial = () => ({
  title: '',
  content: '',
  description: '',
  category: null as any,
  tags: [],
  file_list: [],
  article_type: ARTICLE_TYPE.ORIGINAL,
  top: false,
  recommend: false,
  privacy: 0
})
const articleForm = reactive<AddArticleForm>(formInitial())

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
// 提交文章
const handleDialogSubmit = () => {
  if (!articleForm.category) {
    return Message({
      type: 'error',
      message: '请选择文章分类'
    })
  }
  if (!articleForm.tags.length) {
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
  if (!articleForm.file_list.length) {
    return Message({
      type: 'error',
      message: '请选择文章封面'
    })
  }
  articleDialogVisible.value = false
  console.log(articleForm)
}
// 重置表单
const handleResetForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title, content, ...rest } = formInitial()
  Object.assign(articleForm, rest)
}
// 删除文件
const handleRemoveFile = () => {
  articleForm.file_list = []
}
// 图片预览
const handlePictureCardPreview = (file: UploadFile) => {
  previewImageUrl.value = file.url!
  imgPreviewDialogVisible.value = true
}
// 选择分类
const handleSelectCategory = (category: ArticleCategory) => {
  const isExist = articleForm.category?.id === category.id
  if (isExist) return
  articleForm.category = category
}
// 删除分类
const handleRemoveCategory = () => {
  articleForm.category = null as any
}
</script>

<template>
  <div class="h-full">
    <div class="flex mb-[10px]">
      <el-input
        v-model="articleForm.title"
        placeholder="请输入文章标题"
      ></el-input>
      <el-button type="primary" class="ml-4">存为草稿</el-button>
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
        <div class="flex gap-3 mr-3" v-if="articleForm.category">
          <el-tag
            class="text-sm"
            size="large"
            closable
            @close="handleRemoveCategory"
          >
            {{ articleForm.category.category_name }}
          </el-tag>
        </div>
        <el-popover
          placement="bottom-start"
          trigger="click"
          :width="360"
          :hide-after="0"
          v-if="!articleForm.category"
        >
          <el-card shadow="never" class="border-0">
            <template #header>
              <span>请选择分类</span>
            </template>
            <div class="flex gap-3">
              <el-tag
                size="large"
                class="text-sm cursor-pointer"
                v-for="category in categories"
                :key="category.id"
                @click="handleSelectCategory(category)"
              >
                {{ category.category_name }}
              </el-tag>
            </div>
          </el-card>
          <template #reference>
            <el-button type="primary" plain> 选择分类 </el-button>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item label="文章标签">
        <el-select
          v-model="articleForm.tags"
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
          action="#"
          list-type="picture-card"
          v-model:file-list="articleForm.file_list"
          :auto-upload="false"
          :limit="1"
          :disabled="articleForm.file_list.length > 0"
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
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="推荐">
        <el-switch
          v-model="articleForm.recommend"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="发布形式">
        <el-radio-group class="ml-4" v-model="articleForm.privacy">
          <el-radio :label="0">私密</el-radio>
          <el-radio :label="1">公开</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="articleDialogVisible = false">
          关闭
        </el-button>
        <el-button type="info" @click="handleResetForm">重置</el-button>
        <el-button type="primary" @click="handleDialogSubmit"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
