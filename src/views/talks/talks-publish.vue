<script setup lang="ts">
import { authorization, createTalk, updateTalk } from '@/api'
import { useNavTags, useTalk, useUser } from '@/stores'
import type { Talk } from '@/types'
import { Message } from '@/utils'
import axios from 'axios'
import MdEditor, { type ToolbarNames } from 'md-editor-v3'

const route = useRoute()
const router = useRouter()
const userStore = useUser()
const talkStore = useTalk()
const navTagStore = useNavTags()

const uploadToken = import.meta.env.VITE_UPLOAD_TOKEN
const imgBaseUrl = import.meta.env.VITE_IMG_BASE_URL
const talk = reactive<Talk>({ content: '' } as Talk)
const toolbars: ToolbarNames[] = [
  'link',
  'image',
  '-',
  'revoke',
  'next',
  'save',
  '-',
  'pageFullscreen',
  'fullscreen'
]
const publishOrEdit = ref<boolean>(true)

watch(
  () => route.params.id,
  (newVal) => {
    publishOrEdit.value = !newVal
    if (newVal) {
      const t = talkStore.getTalk(parseInt(newVal as string))
      Object.assign(talk, t)
    } else {
      talk.content = ''
    }
  },
  { immediate: true }
)

// 输入内容时更新
const handleContentChange = (value: string) => {
  talk.content = value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
// 文章中的图片上传
const handleUploadImg = async (
  files: File[],
  callback: (urls: string[]) => void
) => {
  const { code } = (await authorization()) || {}
  if (code === 200) {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData()
          form.append('file', file)
          form.append('token', uploadToken)
          axios
            .post('/qiniu/', form, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((res) => rev(res))
            .catch((error) => rej(error))
        })
      })
    )
    callback(res.map((item: any) => imgBaseUrl + item.data.hash))
  }
}
// 更新完文章后清理路由
const clearRoute = () => {
  if (!publishOrEdit.value) {
    navTagStore.removeNavTag(route.path, true)
    router.push({ path: '/talks/list' })
  }
}
// 提交说说
const handleSubmitTalk = async () => {
  if (!talk.content.trim()) return
  talk.uid = userStore.user.id
  const { code } =
    (publishOrEdit.value
      ? await createTalk({ data: talk })
      : await updateTalk({ data: talk })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: publishOrEdit.value ? '说说发布成功！' : '保存成功'
    })
    talk.content = ''
    clearRoute()
  }
}
</script>

<template>
  <div>
    <div>
      <MdEditor
        v-model="talk.content"
        placeholder="请输入内容..."
        :toolbars="toolbars"
        @onChange="handleContentChange"
        @onUploadImg="handleUploadImg"
      />
    </div>
    <div class="flex justify-end mt-5">
      <el-button type="primary" @click="handleSubmitTalk">
        {{ publishOrEdit ? '发布' : '保存' }}
      </el-button>
    </div>
  </div>
</template>

<style>
.md-editor-footer-right {
  display: none;
}
.figure img {
  width: 200px;
  object-fit: cover;
}
</style>
