<template>
  <div v-if="user" class="w-full h-full">
    <serie-detail :serie="serie" @save="save" @remove="removeSerie" @cancel="cancel" />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  async setup() {
    const route = useRoute();
    const router = useRouter();
    onMounted(() =>
      router.replace({
        ...router.currentRoute,
        query: {},
      })
    );

    const user = useAuth().useAuthUser()
    watch(user, (newVal) => {
      if (!newVal)
        router.push({
          path: "/admin/login",
        query: { msg: 'login.sessionexpired' },
        });
    })

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
    setTimeout(()=>{ if (!user.value) router.push('/admin/login')}, 200)

    return {
      serie,
      user,
      save,
      cancel,
      removeSerie,
    };
  },
});
</script>
