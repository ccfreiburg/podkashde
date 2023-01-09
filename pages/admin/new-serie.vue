<script setup lang="ts">
import { emptyISerieFactory } from "~~/base/types/ISerie";
definePageMeta({
  middleware: "authentication",
});
const router = useRouter();
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {
    }
  }))

const user = useAuth().useAuthUser()
watch(user, (newVal) => {
  if (!newVal)
    router.push({
      path: "/admin/login",
        query: { msg: 'login.sessionexpired' },
    });
})
const route = useRoute();
const slug = route.params.slug as string
const serie = ref(emptyISerieFactory());
async function save(slug: string) {
  const { refresh } = await useSeries()
  await refresh()
  router.push("/serie");
}
function cancel() {
  router.go(-1)
}
</script>
<template>
  <div>
    <messge-toast></messge-toast>

    <serie-detail :serie="serie" @save="save" @cancel="cancel" />
  </div>
</template>