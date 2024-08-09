<template>
  <div class="w-full h-full pb-10">
    <PageLayout>
      <BaseContainer>

    <serie-detail v-if="user && !loading" :serie="serie" @save="save" @remove="removeSerie" @cancel="cancel" />
  </BaseContainer>
    </PageLayout>
  </div>
</template>

<script setup lang="ts">
    const route = useRoute();
    const router = useRouter();

    const { serie, loading, refresh, remove } = useSerie(route.params.slug as string);

    const {user} = useAuth()
    const {on_mounted, on_before, on_user_changed} = useMounted(refresh, user, true)
    onMounted( on_mounted )
    onBeforeMount( on_before )
    watch(user, on_user_changed);

    async function save() {
      await refresh()
      router.push('/serie/' + route.params.slug);
    }

    function cancel() {
      router.go(-1)
    }

    async function removeSerie() {
      await remove();
      router.push('/series');
    }
</script>
