<template>
  <div></div>
</template>
<script setup lang="ts">
const router = useRouter()
const settings = await useSettings()
const localePath = useLocalePath();
const url = localePath(settings.value.defaultRoute)
router.replace(url)
</script>