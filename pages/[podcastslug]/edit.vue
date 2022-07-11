import Podcast from "~~/backend/entities/Podcast";

import Podcast from "~~/backend/entities/Podcast";

<template>
  <div class="w-full h-full">
    <podcast-detail
      :podcast="podcast"
      @onsaved="onSaved"
      @ondeleted="oncancel"
      @oncancel="oncancel"
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
    const podcast = ref(data as Podcast);

    function onSaved() {}

    function oncancel() {
      router.go(-1);
    }
    return {
      podcast,
      onSaved,
      oncancel,
    };
  },
});
</script>

<style>
</style>