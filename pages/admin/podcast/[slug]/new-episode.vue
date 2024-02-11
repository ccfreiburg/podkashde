<script setup lang="ts">
import { emptyIEpisodeFactory } from "~~/base/types/IEpisode";
const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
const {user} = useAuth()
watch( user, (newVal) => {
  if (!newVal)
    router.push({
        path: "/admin/login",
        query: { msg: 'login.sessionexpired' },
      });
})
const {podcast, gernerateRss } = usePodcast(slug);
const {series} = useSeries(true);
const episode = ref(emptyIEpisodeFactory());
async function save() {
  await gernerateRss()
  router.push("/podcast/" + slug + "?refresh=true");
}
function cancel() {
  router.go(-1);
}
setTimeout(()=>{ if (!user.value) router.push('/admin/login')}, 200)
</script>
<template>
      <PageLayout>
        <BaseContainerClean>
          <episode-detail v-if="user" :podcast="podcast" :episode="episode" :series="series" @save="save" @episode-cancel="cancel"/>
        </BaseContainerClean>
      </PageLayout>
</template>