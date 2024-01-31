<template>
  <div>
    <PageLayout :title="$t('episode.recent') ">
    <BaseContainer>
      <episodes-list :episodes="episodes" />
    </BaseContainer>
    </PageLayout>
    </div>

</template>
<script setup lang="ts">
const { refresh, episodes } = await useEpisodes();
const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
  if (route.query.refresh) refresh();
})
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {
    }
  }))
</script>
