<script setup lang="ts">
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
function onsave() {
  router.push("/podcast/" + slug+ "?refresh=true");
}
function oncancel() {
  router.go(-1);
}
</script>
<template>
    <div>
        <episode-detail :podcast="podcast" :episode="episode" :series="allseries" />
    </div>
</template>