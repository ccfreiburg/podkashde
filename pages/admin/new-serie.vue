<script setup lang="ts">
import { emptyISerieFactory } from "~~/base/types/ISerie";
const router = useRouter();
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {
    }
  }))

const user = useAuth().useAuthUser()
const route = useRoute();
const slug = route.params.slug as string
const serie = ref(emptyISerieFactory());
async function save(slug: string) {
  const { refresh } = await useSeries()
  await refresh()
  router.push("/serie");
}
function cancel() {
  router.push("/serie");
}
watch(user, (newVal) => {
  if (!newVal)
    router.push({
      path: "/admin/login",
      query: { msg: 'login.sessionexpired' },
    });
})
setTimeout(() => { if (!user.value) router.push('/admin/login') }, 200)
</script>
<template>
  <div v-if="user">
    <messge-toast></messge-toast>

    <serie-detail :serie="serie" @save="save" @cancel="cancel" />
  </div>
</template>