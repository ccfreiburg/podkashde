<template>
  <div class="w-full h-full">
    <episode-detail
      :episode="episode"
      @onsaved="oncancel"
      @ondeleted="oncancel"
      @oncancel="oncancel"
    />
  </div>
</template>

<script lang="ts">
import Episode from "~~/backend/entities/Episode";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const apiUrl = "/api/podcasts?slug=" + route.params.podcastslug;
    const { data: podcast } = useFetch(apiUrl);
    const episode = ref(new Episode());
    function oncancel() {
      router.go(-1);
    }
    return {
      episode,
      oncancel,
    };
  },
});
</script>

<style>
</style>