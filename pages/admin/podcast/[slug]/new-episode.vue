<script setup lang="ts">
import { GENERATE_RSS_AP } from "~~/base/Constants";
import { emptyIEpisodeFactory } from "~~/base/types/IEpisode";
definePageMeta({
  middleware: "authentication",
});
const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string
const {podcast, series} = await usePodcast(slug);
const {series: allseries} = await useSeries();
const episode = ref(emptyIEpisodeFactory());
function save() {
  $fetch(GENERATE_RSS_AP, { query: { slug: route.params.slug }})
  router.push("/podcast/" + slug+ "?refresh=true");
}
function cancel() {
  router.go(-1);
}
</script>
<template>
    <div>
        <episode-detail :podcast="podcast" :episode="episode" :series="allseries" :save="save" :cancel="cancel"/>
    </div>
</template>