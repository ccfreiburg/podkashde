<script setup lang="ts">
import { emptyISerieFactory } from "~~/base/types/ISerie";
definePageMeta({
  middleware: "authentication",
});
const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string
const serie = ref(emptyISerieFactory());
async function save(slug: string) {
  const { refresh } = await useSeries()
  await refresh()
  router.push("/serie/" + slug);
}
function cancel() {
  router.go(-1)
}
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
</script>
<template>
    <div>
<messge-toast></messge-toast>

        <serie-detail :serie="serie" @save="save" @cancel="cancel" />
    </div>
</template>