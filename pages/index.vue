<template>
  <div>
    <PageLayout :title="$t('episode.recent') ">
    <BaseContainer>
      <EpisodesList v-if="episodes" :episodes="episodes" />
    </BaseContainer>
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
