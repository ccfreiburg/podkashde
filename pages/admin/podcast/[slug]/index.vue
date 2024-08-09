<template>
  <div class="w-full h-full pb-10">
    <PageLayout>
      <BaseContainer>
      <podcast-detail
        v-if="user && podcast && !loading"
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

const route = useRoute();
const router = useRouter();

const { podcast, refresh, remove, loading, gernerateRss } = usePodcast(route.params.slug as string);

const {user} = await useAuth()
const {on_mounted, on_before, on_user_changed} = useMounted(refresh, user, true)
onMounted( on_mounted )
onBeforeMount( on_before )
watch(user, on_user_changed);

async function goBackSaved() {
  await refresh()
  await gernerateRss()
  router.push("/podcast/" + route.params.slug);
}

function goBack() {
  router.push("/podcast/" + route.params.slug);
}

async function ondelete() {
  await remove();
  router.push("/");
}
</script>
