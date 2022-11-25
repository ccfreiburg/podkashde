<template>
  <div class="h-full w-full">
<messge-toast></messge-toast>

    <podcast-detail
      :podcast="podcast"
      @oncancel="goBack"
      @onsaved="goBack"
      @ondelete="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { emptyIPodcastFactory } from '~~/base/types/IPodcast.js';
definePageMeta({
  middleware: "authentication",
});

const podcast = ref(emptyIPodcastFactory());
const router = useRouter();

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