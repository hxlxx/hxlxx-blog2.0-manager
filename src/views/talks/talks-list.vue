<script setup lang="ts">
import { getTalkList, removeTalkById, getTalkById } from '@/api'
import { useTalk } from '@/stores'
import type { QueryInfo, Talk } from '@/types'
import { Message } from '@/utils'
import MdEditor from 'md-editor-v3'

const router = useRouter()
const talkStore = useTalk()

const talkList = ref<Talk[]>([])
const query = reactive<QueryInfo>({
  skip: 0,
  limit: 5,
  page: 1,
  total: 0
})

onBeforeMount(() => {
  initTalkList()
})

const initTalkList = async () => {
  const skip = (query.page! - 1) * query.limit!
  const { data } = (await getTalkList({ skip, limit: query.limit })) || {}
  talkList.value = data.res
  query.total = data.count
}
// 编辑说说
const handleEditTalk = async (id: number) => {
  const { data } = (await getTalkById(id)) || {}
  talkStore.setTalk(id, data)
  router.push({ name: 'edit-talk', params: { id } })
}
// 删除说说
const handleRemoveTalk = async (id: number) => {
  const { code } = (await removeTalkById(id)) || {}
  if (code === 200) {
    Message({
      type: 'success',
      message: '删除说说成功！'
    })
    initTalkList()
  }
}
// 获取分页数据
const handleChangePage = () => {
  initTalkList()
}
</script>

<template>
  <div>
    <el-card
      class="mb-5"
      v-for="talk in talkList"
      :key="talk.id"
      shadow="hover"
    >
      <div class="flex gap-3 items-center">
        <div class="w-10 h-10 rounded-full overflow-hidden">
          <img class="w-full h-full object-cover" :src="talk.user.avatar_url" />
        </div>
        <div>
          <span class="mr-3">{{ talk.user.username }}</span>
          <span>{{ dateFormat(talk.created_at).format('YYYY-MM-DD') }}</span>
        </div>
        <div class="ml-auto cursor-pointer hover:opacity-50">
          <el-popover
            placement="bottom-start"
            trigger="click"
            popper-style="min-width: 0; width: auto;"
          >
            <template #reference>
              <h-icon icon="more" size="24px" />
            </template>
            <div class="flex justify-center gap-5">
              <h-icon
                class="cursor-pointer hover:text-blue-400"
                icon="editor"
                size="20px"
                :stroke-width="5"
                @click="handleEditTalk(talk.id)"
              />
              <h-icon
                class="cursor-pointer hover:text-red-500"
                icon="delete"
                size="20px"
                :stroke-width="5"
                @click="handleRemoveTalk(talk.id)"
              />
            </div>
          </el-popover>
        </div>
      </div>
      <el-divider />
      <MdEditor v-model="talk.content" preview-only />
    </el-card>
    <div class="w-full flex justify-center mt-3">
      <el-pagination
        v-model:current-page="query.page"
        background
        layout="prev, pager, next, total"
        :pager-count="5"
        :page-size="query.limit"
        :total="query.total"
        @current-change="handleChangePage"
      />
    </div>
  </div>
</template>

<style>
.figure img {
  width: 200px;
  object-fit: cover;
}
</style>
