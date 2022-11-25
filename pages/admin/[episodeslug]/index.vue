<script setup lang="ts">
import { GENERATE_RSS_AP } from "~~/base/Constants";
import { useEpisode } from "~~/composables/episodedata";
definePageMeta({
  middleware: "authentication",
});
const route = useRoute();
const router = useRouter();
const slug = route.params.episodeslug as string;
const { refresh, episode, remove } = await useEpisode(slug);
const { podcast, series } = await usePodcast(episode.value?.podcast?.slug as string)

onBeforeMount( () => {
  if (route.query.refresh) refresh();
})
onMounted( () =>
router.replace({
  ...router.currentRoute,
  query: {
  }
}))

function onsaved() {
  $fetch(GENERATE_RSS_AP, { query: { slug: route.params.slug }})
  var url = router.options.history.state.back as string;
    if (url.includes("?"))
      url = url.substring(0,url.indexOf('?'))
    router.push({ path: url, query: { refresh: 'true', msg: 'episode.saved' } })
}
function oncancel() {
  router.go(-1);
}
</script>
<template>
    <div class="pb-10">
<messge-toast></messge-toast>

        <episode-detail 
          :podcast="podcast" 
          :episode="episode" 
          :series="series" 
          @save="onsaved"
          @cancel="oncancel"
          />
    </div>
</template>