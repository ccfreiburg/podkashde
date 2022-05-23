<template>
  <div class="w-full h-full">
    <podcast-detail :podcast="podcast" />
  </div>
</template>

<script lang="ts">
//import Podcast from "~~/backend/entities/Podcast";
export default defineComponent({
  setup() {
    const route = useRoute();
    const apiUrl = "/api/podcasts?slug=" + route.params.slug;
    console.log(apiUrl);
    const { data: podcast } = useFetch(apiUrl);
    return {
      podcast,
    };
  },
});
</script>

<style>
</style>