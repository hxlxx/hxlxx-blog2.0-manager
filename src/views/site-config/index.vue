<script setup lang="ts">
import { getSiteConfig, updateSiteConfig } from '@/api'
import type { SiteConfig } from '@/types'
import { Confirm, Message } from '@/utils'
import type { UploadProps } from 'element-plus'

const uploadUrl = ref<string>(import.meta.env.VITE_UPLOAD_URL)
const uploadToken = ref<string>(import.meta.env.VITE_UPLOAD_TOKEN)
const imgBaseUrl = import.meta.env.VITE_IMG_BASE_URL
const config = reactive<SiteConfig>({})

onBeforeMount(() => {
  initSiteConfig()
})

const initSiteConfig = async () => {
  const { data } = (await getSiteConfig()) || {}
  Object.assign(config, data)
}
// 图片上传成功，更新头像
const handleAvatarSuccess: UploadProps['onSuccess'] = (response: any) => {
  config.author_avatar = imgBaseUrl + response.hash
  if (!config.author_avatar) {
    return Message({
      type: 'error',
      message: '图片上传错误，请重新上传！'
    })
  }
}
// 图片上传成功，更新logo
const handleLogoSuccess: UploadProps['onSuccess'] = (response: any) => {
  config.logo = imgBaseUrl + response.hash
  if (!config.logo) {
    return Message({
      type: 'error',
      message: '图片上传错误，请重新上传！'
    })
  }
}
// 提交修改
const handleSubmitConfig = () => {
  Confirm('是否确定修改网站配置', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { code } = (await updateSiteConfig({ data: config })) || {}
      if (code === 200) {
        Message({
          type: 'success',
          message: '修改网站配置成功！'
        })
      }
    })
    .catch(() => {
      Message({
        type: 'info',
        message: '取消修改'
      })
    })
}
</script>

<template>
  <div>
    <el-form class="w-[20%]" :model="config" label-width="80px">
      <el-form-item label="作者头像">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :data="{ token: uploadToken }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <el-image
            v-if="config.author_avatar"
            style="width: 160px; height: 160px"
            :src="config.author_avatar"
            fit="cover"
          />
          <h-icon
            v-else
            class="justify-center items-center w-[160px] h-[160px]"
            icon="plus"
            size="28px"
          />
        </el-upload>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="config.author" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="config.author_email" />
      </el-form-item>
      <el-form-item label="介绍">
        <el-input v-model="config.author_motto" />
      </el-form-item>
      <el-form-item label="公告">
        <el-input v-model="config.notice" />
      </el-form-item>
      <el-form-item label="备案号">
        <el-input v-model="config.beianNumber" />
      </el-form-item>
      <el-form-item label="建站时间">
        <el-date-picker
          v-model="config.webSite_created_at"
          type="date"
          placeholder="Pick a day"
        />
      </el-form-item>
      <el-form-item label="logo">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :data="{ token: uploadToken }"
          :show-file-list="false"
          :on-success="handleLogoSuccess"
        >
          <el-image
            v-if="config.logo"
            style="width: 160px; height: 160px"
            :src="config.logo"
            fit="cover"
          />
          <h-icon
            v-else
            class="justify-center items-center w-[160px] h-[160px]"
            icon="plus"
            size="28px"
          />
        </el-upload>
      </el-form-item>
      <el-form-item label="github">
        <el-input v-model="config.github" />
      </el-form-item>
      <el-form-item label="gitee">
        <el-input v-model="config.gitee" />
      </el-form-item>
      <el-form-item label="csdn">
        <el-input v-model="config.csdn" />
      </el-form-item>
      <el-form-item label="juejin">
        <el-input v-model="config.juejin" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmitConfig"
          >提交修改</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
:deep(.i-icon-plus) {
  display: flex !important;
}
</style>
