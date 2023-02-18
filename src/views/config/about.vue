<script setup lang="ts">
import { authorization, getAbout, updateAbout } from '@/api'
import { Message } from '@/utils'
import axios from 'axios'
import MdEditor from 'md-editor-v3'

const uploadToken = import.meta.env.VITE_UPLOAD_TOKEN
const imgBaseUrl = import.meta.env.VITE_IMG_BASE_URL
const content = ref<string>('')

onBeforeMount(() => {
  initAbout()
})

const initAbout = async () => {
  const { data } = (await getAbout()) || {}
  content.value = data.content
}
// 输入内容时更新
const handleContentChange = (value: string) => {
  content.value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
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
const handleSubmit = async () => {
  const { code } =
    (await updateAbout(1, { data: { content: content.value } })) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '更新内容成功！'
    })
    initAbout()
  }
}
</script>

<template>
  <div>
    <md-editor
      v-model="content"
      @onChange="handleContentChange"
      @onUploadImg="handleUploadImg"
    />
    <div class="mt-5 flex justify-end">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>
