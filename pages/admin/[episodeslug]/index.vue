<script setup lang="ts">
import { useEpisode } from "~~/composables/episodedata";
definePageMeta({
  middleware: "authentication",
});
const route = useRoute();
const router = useRouter();
const slug = route.params.episodeslug as string;
const { refresh, episode, remove } = await useEpisode(slug);
if (route.query.refresh)
  refresh();
const { podcast, series } = await usePodcast(episode.value.podcast.slug)

function onsaved() {
  const url = router.options.history.state.back;
  router.push(url+ "?refresh=true");
}
function oncancel() {
  router.go(-1);
}
</script>
<template>
    <div>
        <episode-detail 
          :podcast="podcast" 
          :episode="episode" 
          :series="series" 
          @save="onsaved"
          @cancel="oncancel"
          />
    </div>
</template>