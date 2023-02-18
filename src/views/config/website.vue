<script setup lang="ts">
import { authorization, getSiteConfig, updateSiteConfig } from '@/api'
import { useUser } from '@/stores'
import type { SiteConfig } from '@/types'
import { Confirm, Message } from '@/utils'
import type { UploadProps, UploadRawFile } from 'element-plus'

const userStore = useUser()

const uploadUrl = import.meta.env.VITE_UPLOAD_URL
const uploadToken = import.meta.env.VITE_UPLOAD_TOKEN
const imgBaseUrl = import.meta.env.VITE_IMG_BASE_URL
const staticUrl = import.meta.env.VITE_SERVER_URL + '/static'
const defaultAvatarUrl = ref<string>(staticUrl + '/default_avatar.jpg')
const defaultCover = ref<string>(staticUrl + '/default_cover.jpg')
const config = reactive<SiteConfig>({})
const activeName = ref<string>('site-info')

onBeforeMount(() => {
  initSiteConfig()
})

const initSiteConfig = async () => {
  const { data } = (await getSiteConfig()) || {}
  Object.assign(config, data)
}
// 上传图片校验
const handleBeforeUpload: UploadProps['beforeUpload'] = async (
  rawFile: UploadRawFile
) => {
  const { code } = (await authorization()) || {}
  if (code === 200) {
    if (rawFile.size / 1024 / 1024 > 5) {
      Message({
        type: 'error',
        message: '图片大小不能超过5M！'
      })
      return false
    }
    return true
  }
  return false
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
// 图片上传成功，更新默认头像
const handleDefaultAvatarSuccess: UploadProps['onSuccess'] = (
  response: any
) => {
  defaultAvatarUrl.value = response.data
  if (!defaultAvatarUrl.value) {
    return Message({
      type: 'error',
      message: '图片上传错误，请重新上传！'
    })
  }
}
// 图片上传成功，更新默认文章封面
const handleDefaultCoverSuccess: UploadProps['onSuccess'] = (response: any) => {
  defaultAvatarUrl.value = response.data
  if (!defaultAvatarUrl.value) {
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
    <el-tabs v-model="activeName" class="demo-tabs">
      <!-- 配置站点信息 -->
      <el-tab-pane label="网站信息" name="site-info">
        <el-form class="w-[20%]" :model="config" label-width="80px">
          <el-form-item label="作者头像">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :data="{ token: uploadToken }"
              :show-file-list="false"
              :before-upload="handleBeforeUpload"
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
              :before-upload="handleBeforeUpload"
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
      </el-tab-pane>
      <!-- 配置额外的一些信息 -->
      <el-tab-pane label="其他" name="site-extra">
        <div class="flex gap-20 pl-10">
          <div class="flex flex-col items-center gap-5">
            <span>用户默认头像</span>
            <el-upload
              class="avatar-uploader"
              :action="staticUrl"
              :headers="{ authorization: userStore.token }"
              :data="{ imgType: 'avatar' }"
              :show-file-list="false"
              :before-upload="handleBeforeUpload"
              :on-success="handleDefaultAvatarSuccess"
            >
              <el-image
                v-if="defaultAvatarUrl"
                style="width: 160px; height: 160px"
                :src="defaultAvatarUrl"
                fit="cover"
              />
              <h-icon
                v-else
                class="justify-center items-center w-[160px] h-[160px]"
                icon="plus"
                size="28px"
              />
            </el-upload>
          </div>
          <div class="flex flex-col items-center gap-5">
            <span>文章默认封面</span>
            <el-upload
              class="avatar-uploader"
              :action="staticUrl"
              :headers="{ authorization: userStore.token }"
              :data="{ imgType: 'cover' }"
              :show-file-list="false"
              :before-upload="handleBeforeUpload"
              :on-success="handleDefaultCoverSuccess"
            >
              <el-image
                v-if="defaultCover"
                style="width: 160px; height: 160px"
                :src="defaultCover"
                fit="cover"
              />
              <h-icon
                v-else
                class="justify-center items-center w-[160px] h-[160px]"
                icon="plus"
                size="28px"
              />
            </el-upload>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
:deep(.i-icon-plus) {
  display: flex !important;
}
</style>
