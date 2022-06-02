<template>
  <div class="w-full h-full">
    <podcast-detail
      :podcast="podcast"
      @onsaved="oncancel"
      @ondeleted="oncancel"
      @oncancel="oncancel"
    />
  </div>
</template>

<script lang="ts">
//import Podcast from "~~/backend/entities/Podcast";
export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const apiUrl = "/api/podcasts?slug=" + route.params.podcastslug;
    const { data: podcast } = useFetch(apiUrl);

    function oncancel() {
      router.go(-1);
    }
    return {
      podcast,
      oncancel,
    };
  },
});
</script>

<style>
</style>