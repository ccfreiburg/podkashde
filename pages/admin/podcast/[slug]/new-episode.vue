<script setup lang="ts">
import { emptyIEpisodeFactory } from "~~/base/types/IEpisode";
definePageMeta({
  middleware: "authentication",
});
const route = useRoute();
const router = useRouter();
const {podcast} = await usePodcast(route.params.slug as string);
const episode = ref(emptyIEpisodeFactory());
episode.value.title = "Hallo"
function onsave() {
router.push("/podcast/" + route.params.slug);
}
function oncancel() {
router.go(-1);
}
</script>
<template>
    <div>
        <episode-detail :podcast="podcast" :episode="episode" :series="[]" />
    </div>
</template>