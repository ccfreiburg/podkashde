<template>
  <div class="h-full w-full pb-10">
    <messge-toast></messge-toast>

    <podcast-detail :podcast="podcast" @oncancel="goBack" @onsaved="onSave" />
  </div>
</template>

<script setup lang="ts">
import { emptyIPodcastFactory } from '~~/base/types/IPodcast.js';
import { usePodcasts } from '~~/composables/podcastdata';

const router = useRouter();
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {
    }
  }))

const user = useAuth().useAuthUser()

const podcast = ref(emptyIPodcastFactory());
const { refresh } = await usePodcasts();
(await usePodcasts()).refresh()

const onSave = async function () {
  await refresh()
  router.push('/podcasts');
};


const goBack = function () {
  router.go(-1);
};
watch( user, (newVal) => {
  if (!newVal)
    router.push({
        path: "/admin/login",
        query: { msg: 'login.sessionexpired' },
      });
})
setTimeout(()=>{ if (!user.value) router.push('/admin/login')}, 200)
</script>