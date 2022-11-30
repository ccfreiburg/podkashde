<template>
  <div class="w-full h-full pb-10">
    <messge-toast></messge-toast>

    <podcast-detail
      :podcast="podcast"
      @onsaved="goBackSaved"
      @ondeleted="ondelete"
      @oncancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { GENERATE_RSS_AP } from '~~/base/Constants';
definePageMeta({
  middleware: 'authentication',
});

    const route = useRoute();
    const router = useRouter();
    const { podcast, refresh, remove } = await usePodcast(route.params.slug as string);

    async function goBackSaved() {
      await $fetch(GENERATE_RSS_AP, { query: { slug: route.params.slug } });
      await refresh()
      router.push('/podcast/' + route.params.slug);
    }

    function goBack() {
      router.push('/podcast/' + route.params.slug);
    }

    async function ondelete() {
      await remove();
      (await usePodcasts()).refresh()
      router.push('/');
    }
    onBeforeMount(() =>
      router.replace({
        ...router.currentRoute,
        query: {},
      })
    );
</script>
