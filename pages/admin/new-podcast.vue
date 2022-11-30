<template>
  <div class="h-full w-full pb-10">
<messge-toast></messge-toast>

    <podcast-detail
      :podcast="podcast"
      @oncancel="goBack"
      @onsaved="onSave"
    />
  </div>
</template>

<script setup lang="ts">
import { emptyIPodcastFactory } from '~~/base/types/IPodcast.js';
import { usePodcasts } from '~~/composables/podcastdata';
definePageMeta({
  middleware: "authentication",
});

const { refresh } = await usePodcasts();
const podcast = ref(emptyIPodcastFactory());
const router = useRouter();

(await usePodcasts()).refresh()

const onSave = async function () {
  await refresh()
  router.push('/podcasts');
};


const goBack = function () {
  router.go(-1);
};
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
</script>