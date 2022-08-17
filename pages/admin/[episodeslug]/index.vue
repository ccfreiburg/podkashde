<script setup lang="ts">
import { useEpisode } from "~~/composables/episodedata";
const route = useRoute();
const router = useRouter();
const slug = route.params.episodeslug as string;
const { refresh, episode, remove } = await useEpisode(slug);
if (route.query.refresh)
  refresh();
const { podcast, series } = await usePodcast(episode.value.podcast.slug)

function onsaved() {
  router.push("/" + slug+ "?refresh=true");
}
function oncancel() {
  router.go(-1);
}
function ondelete() {
  const redir = "/podcast/"+episode.value.podcast.slug+"?refresh=true"
  remove();
  router.push(redir);
}
</script>
<template>
    <div>
        <episode-detail 
          :podcast="podcast" 
          :episode="episode" 
          :series="series" 
          @onsaved="onsaved"
          @oncancel="oncancel"
          @ondelete="ondelete"
          />
    </div>
</template>