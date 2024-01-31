<script setup lang="ts">
import { GENERATE_RSS_AP } from "~~/base/Constants";
import { emptyIEpisodeFactory } from "~~/base/types/IEpisode";
const myFetch = useFetchApi();
const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
const user = await useAuth().useAuthUser()
watch( user, (newVal) => {
  if (!newVal)
    router.push({
        path: "/admin/login",
        query: { msg: 'login.sessionexpired' },
      });
})
const {podcast, refresh, series} = await usePodcast(slug);
const {series: allseries} = await useSeries();
const episode = ref(emptyIEpisodeFactory());
async function save() {
  await myFetch( GENERATE_RSS_AP, { query: { slug: route.params.slug }})
  await refresh()
  router.push("/podcast/" + slug);
}
function cancel() {
  router.go(-1);
}
setTimeout(()=>{ if (!user.value) router.push('/admin/login')}, 200)
</script>
<template>
    <div class="pb-10">
      <PageLayout>
        <episode-detail v-if="user" :podcast="podcast" :episode="episode" :series="allseries" @save="save" @episode-cancel="cancel"/>
      </PageLayout>
    </div>
</template>