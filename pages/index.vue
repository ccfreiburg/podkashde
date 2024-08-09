<template>
  <div>
    <PageLayout :title="$t('episode.recent') ">
    <BaseContainerClean class="bg-skin-muted dark:bg-skin-muted-dark">
      <EpisodesList v-if="episodes" :episodes="episodes" />
    </BaseContainerClean>
    </PageLayout>
  </div>
</template>
<script setup lang="ts">
const { refresh, episodes } = useEpisodes();
onBeforeMount(() => {
  const route = useRoute()
  refresh();
})
onMounted(() =>{
  const router = useRouter()
  router.replace({
    ...router.currentRoute,
    query: {
    }
  })})
</script>
