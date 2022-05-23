<template>
  <div class="w-full h-full">
    <div v-if="podcast" class="m-10 flex flex-col">
      <div class="flex flex-row">
        <img class="w-1/4 h-32" :src="imgUrl" />
        <div class="flex flex-col flex-grow rounded-r-md flex-shrink-0">
          <div class="p-3 text-2xl">{{ podcast.title }}</div>
          <div class="pl-3">{{ podcast.author }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import Podcast from "~~/backend/entities/Podcast";
import {
  IMAGES_BASE_URL,
  PODCAST_AP,
  ENUMERATIONS_AP,
} from "~~/backend/Constants";

export default defineComponent({
  async setup() {
    const route = useRoute();
    var podcast = ref(new Podcast());
    var result = {};
    result = await useFetch("/api/podcasts?slug=" + route.params.slug);
    podcast = ref(result.data);
    if (!podcast.value) {
      return navigateTo({
        path: "/",
      });
    }
    var imgUrl = computed(() =>
      podcast.value.id ? IMAGES_BASE_URL + podcast.value.cover_file : ""
    );
    return {
      imgUrl,
      podcast,
    };
  },
});
</script>

<style>
</style>