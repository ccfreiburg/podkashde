<template>
  <div class="m-10">
    <div class="flex flex-col">
      <div class="flex flex-row" v-for="episode in sortedList">
        <NuxtLink :to="getEpisodeUrl(episode)">
          <div class="flex flex-row m-2">
            <img class="w-16 h-16 rounded-l-md" :src="episode.image" />
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
import Episode from "~~/backend/entities/Episode";

export default {
  props: {
    podcastSlug: String,
    episodes: Object as PropType<Array<Episode>>,
  },
  name: "PodcastEpisodes",
  async setup(props) {
    var episodes = ref(props.episodes);
    var getEpisodeUrl = function (episode: Episode): string {
      return "/" + props.podcastSlug + "/" + episode.slug;
    };
    const sortedList = computed(() => {
      if (!episodes) return [];
      return episodes.value.sort((a, b) => b.pubdate - a.pubdate);
    });
    return {
      sortedList,
      getEpisodeUrl,
    };
  },
};
</script>

<style>
</style>