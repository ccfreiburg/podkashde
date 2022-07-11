<template>
  <div class="m-10">
    <div class="flex flex-col">
      <div class="text-sm" v-for="episode in episodes">
        {{ episode.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import {
  IMAGES_BASE_URL,
  EPISODES_AP,
  ENUMERATIONS_AP,
} from "~~/backend/Constants";
import Episode from "~~/backend/entities/Episode";

export default {
  props: {
    episodes: Object as PropType<Array<Episode>>,
  },
  name: "PodcastEpisodes",
  async setup(props) {
    var episodes = ref(props.episodes);
    console.log(episodes.value);
    return {
      episodes,
    };
  },
};
</script>

<style>
</style>