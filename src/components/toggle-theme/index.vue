<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <span
    class="cursor-pointer inline-block w-6 h-6 rounded-full hover:bg-black transition-all duration-300"
    @click="toggleDark()"
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
      <h-icon
        v-if="isDark"
        icon="sun-one"
        theme="multi-color"
        size="24px"
        :fill="['#fff', '#f8e71c']"
      />
      <h-icon
        v-else
        icon="moon"
        theme="multi-color"
        size="24px"
        :fill="['#333', '#f8e71c']"
      />
    </transition>
  </span>
</template>
