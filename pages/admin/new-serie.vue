<script setup lang="ts">
import { emptyISerieFactory } from "~~/base/types/ISerie";
definePageMeta({
  middleware: "authentication",
});
const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string
const serie = ref(emptyISerieFactory());
function save(slug) {
  router.push("/serie/" + slug);
}
function cancel() {
  router.push("/serie");
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