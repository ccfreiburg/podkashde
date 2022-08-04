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
definePageMeta({
  middleware: "authentication",
});

export default defineComponent({
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const {podcast} = await usePodcast(route.params.slug as string)

    function goBack() {
      router.push("/podcast/" + route.params.slug);
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