<template>
  <div class="m-10">
    <div class="flex flex-col">
      <div class="flex flex-row" v-for="episode in sortedList">
        <NuxtLink :to="getEpisodeUrl(episode)">
          <div class="flex flex-row m-2">
            <img class="w-16 h-16 rounded-l-md" :src="getImageUrl(episode)" />
            <div class="text-sm flex flex-col ml-3">
              <div v-html="episode.title"></div>
              <div class="mt-1" v-html="episode.creator"></div>
              <div>
                {{ new Date(episode.pubdate).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IMAGES_BASE_URL } from "~~/backend/Constants";
import Episode from "~~/backend/entities/Episode";

export default {
  props: {
    podcastSlug: String,
    episodes: Object as PropType<Array<Episode>>,
  },
  name: "PodcastEpisodes",
  async setup(props) {
    var episodes = ref(props.episodes);
    var getImageUrl = function (episode: Episode): string {
      if (episode.image && episode.image.length > 0) {
        if (
          episode.image.startsWith("http://") ||
          episode.image.startsWith("https://")
        )
          return episode.image;
        else return IMAGES_BASE_URL + episode.image;
      }
    };
    var getEpisodeUrl = function (episode: Episode): string {
      return "/" + props.podcastSlug + "/" + episode.slug;
    };
    const sortedList = computed(() => {
      if (!episodes) return [];
      return episodes.value.sort((a, b) => b.pubdate - a.pubdate);
    });
    return {
      sortedList,
      getImageUrl,
      getEpisodeUrl,
    };
  },
};
</script>

<style>
</style>