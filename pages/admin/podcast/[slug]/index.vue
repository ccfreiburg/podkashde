<template>
  <div class="w-full h-full">
    <podcast-detail
      :podcast="podcast"
      @onsaved="goBackSaved"
      @ondeleted="ondelete"
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
    const {podcast, remove} = await usePodcast(route.params.slug as string)

    function goBackSaved() {
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