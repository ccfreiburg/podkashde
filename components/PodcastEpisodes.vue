<template>
  <div>
    <div class="flex flex-row m-10">
      <img class="w-1/4 h-32" :src="imgUrl" />
      <div class="flex flex-col flex-grow rounded-r-md flex-shrink-0">
        <div class="p-3 text-2xl">{{ podcast.title }}</div>
        <div class="pl-3">{{ podcast.author }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import Podcast from "~~/backend/entities/Podcast";
import {
  IMAGES_BASE_URL,
  PODCAST_AP,
  ENUMERATIONS_AP,
} from "~~/backend/Constants";

export default {
  props: {
    podcast: Object as PropType<Podcast>,
  },
  name: "PodcastEpisodes",
  setup(props) {
    var imgUrl = computed(() => IMAGES_BASE_URL + props.podcast.cover_file);
    return {
      imgUrl,
    };
  },
};
</script>

<style>
</style>