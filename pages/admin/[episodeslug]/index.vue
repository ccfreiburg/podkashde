<script setup lang="ts">
import { GENERATE_RSS_AP } from "~~/base/Constants";

const route = useRoute();
const slug = route.params.episodeslug as string;
const { refresh, episode, podcast, loading: loadingEpisode } = useEpisode(slug);
const { series, loading: loadingSeries } = useSeries();

const {user} = await useAuth()
const {on_mounted, on_before, on_user_changed} = useMounted(refresh, user, true)
onMounted( on_mounted )
onBeforeMount( on_before )
watch(user, on_user_changed);
onBeforeUpdate(()=> {
  console.log("Hi")
  refresh()})

const myFetch = useFetchApi()
const router = useRouter()

async function onsaved() {
  await myFetch( GENERATE_RSS_AP, { query: { slug: podcast.value?.slug }})
  await refresh()
  var url = router.options.history.state.back as string;
    if (url.includes("?"))
      url = url.substring(0,url.indexOf('?'))
    router.push({ path: url, query: { refresh: 'true', msg: 'episode.saved' } })
}
function oncancel() {
  router.go(-1);
}
</script>
<template>
  <div class="pb-10">
    <PageLayout v-if="series && episode">
      <BaseContainer>
        <EpisodeDetail v-if="user" 
          :podcast="podcast" 
          :episode="episode" 
          :series="series" 
          @save="onsaved"
          @episode-cancel="oncancel"
          />
        </BaseContainer>
      </PageLayout>
    </div>
</template>