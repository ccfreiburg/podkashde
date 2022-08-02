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
import { emptyIPodcastFactory } from "~~/base/types/IPodcast";

definePageMeta({
  middleware: "authentication",
});

const podcast = ref(emptyIPodcastFactory());

const goBack = function () {
  const router = useRouter();
  router.go(-1);
};
</script>