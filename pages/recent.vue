<template>
  <div>
    <messge-toast></messge-toast>
    <div class="flex justify-center w-full">
      <div class="mt-6 mb-10 italic uppercase md:mt-12 md:mb-14 grow-0 text-md md:text-2xl ccf-underline-xs">
        &nbsp;{{ $t('episode.recent') }}&nbsp;
      </div>
    </div>
    <div class="flex justify-center w-full h-screen bg-gray-200">
      <div class="flex flex-col w-11/12 md:w-2/3 md:h-60 md:py-10">
        <episodes-list :episodes="episodes" />
      </div>
    </div>
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
