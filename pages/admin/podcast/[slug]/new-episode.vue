<script setup lang="ts">
import { emptyIEpisodeFactory } from "~~/base/types/IEpisode";
const route = useRoute();
const router = useRouter();

const {podcast, loading, refresh, gernerateRss } = usePodcast(route.params.slug as string);
const {series, loading: seriesLoading} = useSeries(true,true);

const {user} = await useAuth()
const {on_mounted, on_before, on_user_changed} = useMounted(refresh, user, true)
onMounted( on_mounted )
onBeforeMount( on_before )
watch(user, on_user_changed);

const episode = ref(emptyIEpisodeFactory());

async function save() {
  await gernerateRss()
  router.push("/podcast/" + route.params.slug as string + "?refresh=true");
}

function cancel() {
  router.go(-1);
}
</script>
<template>
      <PageLayout>
        <BaseContainerClean>
          <episode-detail v-if="user && !loading && !seriesLoading" :podcast="podcast" :episode="episode" :series="series" @save="save" @episode-cancel="cancel"/>
        </BaseContainerClean>
      </PageLayout>
</template>