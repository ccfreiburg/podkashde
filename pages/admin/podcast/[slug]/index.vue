<template>
  <div class="w-full h-full">
    <podcast-detail
      :podcast="podcast"
      @onsaved="goBack"
      @ondeleted="goRoot"
      @oncancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { PODCAST_AP } from "~~/base/Constants";
import IPodcast from "~~/base/types/IPodcast";

definePageMeta({
  middleware: "authentication",
});
const route = useRoute();
const router = useRouter();
const apiUrl = PODCAST_AP + "?slug=" + route.params.slug;
const data = await $fetch(apiUrl);
const podcast = ref(data as IPodcast);
function goBack() {
  router.push("/podcast/" + route.params.slug);
}
function goRoot() {
  router.push("/");
}
</script>

<style>
</style>