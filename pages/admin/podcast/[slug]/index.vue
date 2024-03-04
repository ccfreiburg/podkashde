<template>
  <div class="w-full h-full pb-10">
    <PageLayout>
      <podcast-detail
        v-if="user"
        :podcast="podcast"
        @onsaved="goBackSaved"
        @ondeleted="ondelete"
        @oncancel="goBack"
      />
    </PageLayout>
  </div>
</template>

<script setup lang="ts">
import { GENERATE_RSS_AP } from "~~/base/Constants";

const route = useRoute();
const router = useRouter();
const {user} = useAuth()

const { podcast, refresh, remove } = usePodcast(route.params.slug as string);

onBeforeMount(() => {
  if (route.query.refresh) refresh();
})

onMounted(() => {
  if (!user.value) {
    router.push({
      path: "/admin/login",
      query: { refresh: "true", msg: "login.sessionexpired" },
    });
  } else
    router.replace({
      ...router.currentRoute,
      query: {},
    });
});

watch(user, (newVal) => {
  if (!newVal)
    router.push({
      path: "/admin/login",
      query: { msg: "login.sessionexpired" },
    });
});

async function goBackSaved() {
  const myFetch = useFetchApi();
  await myFetch(GENERATE_RSS_AP, { query: { slug: route.params.slug } });
  await refresh();
  router.push("/podcast/" + route.params.slug);
}

function goBack() {
  router.push("/podcast/" + route.params.slug);
}

async function ondelete() {
  await remove();
  (await usePodcasts()).refresh();
  router.push("/");
}
setTimeout(() => {
  if (!user.value) router.push("/admin/login");
}, 200);
</script>
