<template>
  <PageLayout>
    <BaseContainerClean>
      <SerieDetail :serie="serie" @save="save" @cancel="cancel" />
    </BaseContainerClean>
  </PageLayout>
</template>

<script setup lang="ts">

import { emptyISerieFactory } from "~~/base/types/ISerie";

const { user } = useAuth()
const { on_mounted, on_before, on_user_changed } = useMounted(() => { }, user, true)
onMounted(on_mounted)
onBeforeMount(on_before)
watch(user, on_user_changed);

const serie = ref(emptyISerieFactory());

const router = useRouter();

async function save(slug: string) {
  router.push("/series?refresh=true");
}

function cancel() {
  router.push("/series");
}
</script>
