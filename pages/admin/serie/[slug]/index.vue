<template>
  <div class="w-full h-full">
    <serie-detail
      :serie="serie"
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
    const {serie, remove} = await useSerie(route.params.slug as string)

    function goBackSaved() {
      router.push("/serie/" + route.params.slug+"?refresh=true");
    }

    function goBack() {
      router.push("/serie/" + route.params.slug);
    }

    function ondelete() {
      remove();
      router.push("/");
    }

    return {
      serie,
      goBackSaved,
      goBack,
      ondelete,
    };
  },
});
</script>