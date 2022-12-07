<template>
  <div></div>
</template>
<script setup lang="ts">
const router = useRouter()
const settings = await useSettings()
router.replace(settings.value.defaultRoute)
</script>