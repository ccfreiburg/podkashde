<template>
    <NuxtPage />
    <div class="theme-ccf"> </div> <!-- it is here to prevent postcsss to remove the theme during build -->
</template>
<script setup lang="ts">
useHead({
      bodyAttrs: {
        class: useRuntimeConfig().public.skin+' bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark'
      }
    })
</script>