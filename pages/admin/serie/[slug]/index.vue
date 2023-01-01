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
  middleware: 'authentication',
});

export default defineComponent({
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const { serie, refresh, remove } = await useSerie(route.params.slug as string);

    async function save() {
      await refresh()
      (await useSeries()).refresh()
      router.push('/serie/' + route.params.slug);
    }

    function cancel() {
      router.go(-1)
    }

    async function removeSerie() {
      await remove();
      (await useSeries()).refresh()
      router.push('/serie');
    }
    onMounted(() =>
      router.replace({
        ...router.currentRoute,
        query: {},
      })
    );
    return {
      serie,
      save,
      cancel,
      removeSerie,
    };
  },
});
</script>
