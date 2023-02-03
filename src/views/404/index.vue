<script setup lang="ts">
import lottie from 'lottie-web'
import animationData from '@/assets/lotties/404.json'

const router = useRouter()
const lottieRef = ref<HTMLElement>()

onMounted(() => {
  lottie.loadAnimation({
    container: lottieRef.value!,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData
  })
})
</script>

<template>
  <div class="w-full h-[100vh] flex flex-col justify-center items-center">
    <div class="w-[50%] h-[70%]" ref="lottieRef"></div>
    <span>
      页面不见了
      <el-link type="primary" @click="router.go(-1)">点击返回</el-link>
    </span>
  </div>
</template>
