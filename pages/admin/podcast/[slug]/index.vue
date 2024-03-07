<template>
  <div class="w-full h-full pb-10">
    <PageLayout>
      <BaseContainer>
      <podcast-detail
        v-if="user"
        :podcast="podcast"
        @onsaved="goBackSaved"
        @ondeleted="ondelete"
        @oncancel="goBack"
      />
    </BaseContainer>
    </PageLayout>
  </div>
</template>

<script setup lang="ts">
import { GENERATE_RSS_AP } from "~~/base/Constants";

const route = useRoute();
const router = useRouter();

const { podcast, refresh, remove } = usePodcast(route.params.slug as string);

const {user} = await useAuth()
const {on_mounted, on_before, on_user_changed} = useMounted(refresh, user)
onMounted( on_mounted )
onBeforeMount( on_before )
watch(user, on_user_changed);

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
</script>
