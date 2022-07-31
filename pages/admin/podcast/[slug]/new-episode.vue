<template>
  <div class="w-full h-full">
    <episode-detail
      :episode="episode"
      :series="series"
      :podcast="podcast"
      @onsaved="onsave"
      @ondeleted="oncancel"
      @oncancel="oncancel"
    />
  </div>
</template>

<script lang="ts">
import { PODCASTS_AP } from "~~/base/Constants";
import Episode from "~~/server/db/entities/Episode";
definePageMeta({
  middleware: "authentication",
});
export default defineComponent({
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const result = await useFetch(
      PODCASTS_AP + "?slug=" + route.params.podcastslug
    );

    if (!result.data) {
      navigateTo({
        path: "/",
      });
    }
    const podcast = ref(result.data.value[0]);
    const series = ref(podcast.value.series);
    const episode = ref(new Episode());

    function onsave() {
      router.push("/" + route.params.podcastslug);
    }
    function oncancel() {
      router.go(-1);
    }
    return {
      episode,
      series,
      podcast,
      oncancel,
      onsave,
    };
  },
});
</script>

<style>
</style>