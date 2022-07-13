<template>
  <div class="h-full w-full">
    <podcast-detail
      :podcast="podcast"
      @oncancel="goBack"
      @onsaved="goBack"
      @ondelete="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Podcast from "~~/backend/entities/Podcast";

const podcast = ref(new Podcast());
const router = useRouter();

const goBack = function () {
  router.go(-1);
};
</script>

<style>
</style>