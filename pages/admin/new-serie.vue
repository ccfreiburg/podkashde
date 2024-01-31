<script setup lang="ts">
import { emptyISerieFactory } from "~~/base/types/ISerie";
const router = useRouter();
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {
    }
  }))

const user = await useAuth().useAuthUser()
const route = useRoute();
const slug = route.params.slug as string
const serie = ref(emptyISerieFactory());
async function save(slug: string) {
  const { refresh } = await useSeries()
  await refresh()
  router.push("/series");
}
function cancel() {
  router.push("/series");
}
// watch(user, (newVal) => {
//   if (!newVal)
//     router.push({
//       path: "/admin/login",
//       query: { msg: 'login.sessionexpired' },
//     });
// })
// setTimeout(() => { if (!user.value) router.push('/admin/login') }, 200)
</script>
<template>
  <div>
  <div v-if="user">
    <MessageToast></MessageToast>
    <SerieDetail :serie="serie" @save="save" @cancel="cancel" />
  </div>
</div>
</template>