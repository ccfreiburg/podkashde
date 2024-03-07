<script setup lang="ts">
import { emptyISerieFactory } from "~~/base/types/ISerie";
const { user } = useAuth()
const {on_mounted, on_before} = useMounted(()=>{}, user, true)
onMounted( on_mounted )
onBeforeMount( on_before )

const serie = ref(emptyISerieFactory());

const router = useRouter();
async function save(slug: string) {
  router.push("/series");
}
function cancel() {
  router.push("/series");
}
</script>
<template>
  <div>
  <div v-if="user">
    <MessageToast></MessageToast>
    <SerieDetail :serie="serie" @save="save" @cancel="cancel" />
  </div>
</div>
</template>