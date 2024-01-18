<template>
  <div v-if="user" class="w-full h-full pb-10">
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

    const route = useRoute();
    const router = useRouter();
    onBeforeMount(() =>
      router.replace({
        ...router.currentRoute,
        query: {},
      })
    )
    const user = useAuth().useAuthUser()
    watch( user, (newVal) => {
    if (!newVal)
      router.push({
        path: "/admin/login",
        query: { msg: 'login.sessionexpired' },
      });
    })
    const { podcast, refresh, remove } = await usePodcast(route.params.slug as string);

    async function goBackSaved() {
      await $fetch( API_BASE + GENERATE_RSS_AP, { query: { slug: route.params.slug } });
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
  setTimeout(()=>{ if (!user.value) router.push('/admin/login')}, 200)
 </script>
