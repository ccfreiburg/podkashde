<template>
  <div class="w-full h-full pb-10">
    <podcast-detail
      :podcast="podcast"
      @onsaved="goBackSaved"
      @ondeleted="ondelete"
      @oncancel="goBack"
    />
  </div>
</template>

<script lang="ts">
import { GENERATE_RSS_AP } from "~~/base/Constants";
definePageMeta({
  middleware: "authentication",
});

export default defineComponent({
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const {podcast, remove} = await usePodcast(route.params.slug as string)

    function goBackSaved() {
      $fetch(GENERATE_RSS_AP, { query: { slug: route.params.slug }})
      router.push("/podcast/" + route.params.slug+"?refresh=true");
    }

    function goBack() {
      router.push("/podcast/" + route.params.slug);
    }

    function ondelete() {
      remove();
      router.push("/");
    }

    return {
      podcast,
      goBackSaved,
      goBack,
      ondelete,
    };
  },
});
</script>