<script setup lang="ts">
import { emptyIEpisodeFactory } from "~~/base/types/IEpisode";
definePageMeta({
  middleware: "authentication",
});
const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string
const {podcast} = await usePodcast(slug);
const episode = ref(emptyIEpisodeFactory());
episode.value.title = "Hallo"
function onsave() {
router.push("/podcast/" + slug);
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