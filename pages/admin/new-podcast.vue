<template>
  <PageLayout>
    <PodcastDetail :podcast="podcast" @oncancel="goBack" @onsaved="onSave" />
  </PageLayout>
</template>

<script setup lang="ts">
import { emptyIPodcastFactory } from '~~/base/types/IPodcast';

const router = useRouter();
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {
    }
  }))

const {user, haveUser} = useAuth()
if (!user.value) router.push('/admin/login')

const podcast = ref(emptyIPodcastFactory());

const onSave = async function () {
  router.push('/podcasts?refresh=true');
}


const goBack = function () {
  router.go(-1);
}

watch( user, () => {
  if (!user.value)
    router.push({
        path: "/admin/login",
        query: { msg: 'login.sessionexpired' },
      });
})
</script>