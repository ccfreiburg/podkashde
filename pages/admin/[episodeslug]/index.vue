<script setup lang="ts">
import { GENERATE_RSS_AP } from "~~/base/Constants";

const router = useRouter()
const route = useRoute();
const {user} = await useAuth()

const slug = route.params.episodeslug as string;
const { refresh, episode, podcast, loading: loadingEpisode } = useEpisode(slug);

const myFetch = useFetchApi()



onMounted( () => {
  if (!user.value) {
    router.push({
      path: "/admin/login",
      query: { refresh: 'true', msg: 'login.sessionexpired' },
    })
  } else
  router.replace({
    ...router.currentRoute,
    query: {}
})})

onBeforeMount( () => {
  if (route.query.refresh) refresh();
})

async function onsaved() {
  await myFetch( GENERATE_RSS_AP, { query: { slug: podcast.value?.slug }})
  await refresh()
  await prefresh()
  var url = router.options.history.state.back as string;
    if (url.includes("?"))
      url = url.substring(0,url.indexOf('?'))
    router.push({ path: url, query: { refresh: 'true', msg: 'episode.saved' } })
}
function oncancel() {
  router.go(-1);
}
setTimeout(()=>{ if (!user.value) router.push('/admin/login')}, 200)
</script>
<template>
  <div class="pb-10">
    <PageLayout>
        <EpisodeDetail v-if="user" 
          :podcast="podcast" 
          :episode="episode" 
          :series="series" 
          @save="onsaved"
          @episode-cancel="oncancel"
          />
        </PageLayout>
    </div>
</template>