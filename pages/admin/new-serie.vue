<script setup lang="ts">
import { emptyISerieFactory } from "~~/base/types/ISerie";
definePageMeta({
  middleware: "authentication",
});
const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string
const serie = ref(emptyISerieFactory());
function onsave() {
  router.push("/serie/" + slug+ "?refresh=true");
}
function oncancel() {
  router.go(-1);
}
</script>
<template>
    <div>
        <serie-detail :serie="serie" />
    </div>
</template>