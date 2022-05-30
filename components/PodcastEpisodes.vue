<template>
  <div class="m-10">
    <div class="flex flex-row">Liste</div>
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
    podcastid: Number,
  },
  name: "PodcastEpisodes",
  setup(props) {
    const list = [];
    return {
      list,
    };
  },
};
</script>

<style>
</style>