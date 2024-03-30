<template>
  <PageLayout>
    <BaseContainerClean>
    <PodcastDetail :podcast="podcast" @oncancel="goBack" @onsaved="goBackSaved" />
  </BaseContainerClean>
  </PageLayout>
</template>

<script setup lang="ts">
import { emptyIPodcastFactory } from '~~/base/types/IPodcast';

const {user} = useAuth()
const {on_mounted, on_before, on_user_changed} = useMounted(()=>{}, user, true)
onMounted( on_mounted )
onBeforeMount( on_before )
watch(user, on_user_changed);

const podcast = ref(emptyIPodcastFactory());

const router = useRouter();

async function goBackSaved() {
  router.push('/podcasts?refresh=true');
}

const goBack = function () {
  router.go(-1);
}
</script>