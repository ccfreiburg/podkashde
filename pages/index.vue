<template>
  <div></div>
</template>
<script setup lang="ts">
const router = useRouter();
const defaultRoute = useRuntimeConfig().defaultRoute;
onServerPrefetch(()=> router.replace(defaultRoute))
</script>