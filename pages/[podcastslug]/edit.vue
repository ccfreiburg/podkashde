import Podcast from "~~/backend/entities/Podcast";

import Podcast from "~~/backend/entities/Podcast";

<template>
  <div class="w-full h-full">
    <podcast-detail
      :podcast="podcast"
      @onsaved="goBack"
      @ondeleted="goRoot"
      @oncancel="goBack"
    />
  </div>
</template>

<script lang="ts">
import Podcast from "~~/backend/entities/Podcast";

export default defineComponent({
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const apiUrl = "/api/podcasts?slug=" + route.params.podcastslug;
    const data = await $fetch(apiUrl);
    const podcast = ref(data[0] as Podcast);

    function goBack() {
      router.go(-1);
    }

    function goRoot() {
      router.push("/");
    }

    return {
      podcast,
      goBack,
      goRoot,
    };
  },
});
</script>

<style>
</style>