<template>
  <div class="w-full h-full">
    <serie-detail
      :serie="serie"
      @save="save"
      @remove="removeSerie"
      @cancel="cancel"
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

    function save() {
      router.push("/serie/" + route.params.slug+"?refresh=true");
    }

    function cancel() {
      router.push("/serie/" + route.params.slug);
    }

    function removeSerie() {
      remove();
      router.push("/");
    }

    return {
      serie,
      save,
      cancel,
      removeSerie,
    };
  },
});
</script>