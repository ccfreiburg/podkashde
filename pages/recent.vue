<template>
  <div>
    <messge-toast></messge-toast>
    <div class="flex justify-center w-full mt-6 mb-10 md:mt-12 md:mb-14">
      <BaseH1>{{ $t('episode.recent') }}</BaseH1>
    </div>
    <BaseContainer>
      <episodes-list :episodes="episodes" />
    </BaseContainer>
  </div>
</template>
<script setup lang="ts">
import { useEnumerations } from '~~/composables/enumerationdata';
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
