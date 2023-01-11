<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <span
    class="cursor-pointer inline-block w-6 h-6 p-[1px] rounded-[5px] transition-all duration-300 hover:bg-slate-300"
    @click="toggle()"
  >
    <transition
      appear
      mode="out-in"
      enter-active-class="relative transition-all duration-100 cus-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="relative transition-all duration-100 cus-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <h-icon v-if="isFullscreen" icon="off-screen-one" size="22px" />
      <h-icon v-else icon="full-screen-one" size="22px" />
    </transition>
  </span>
</template>
