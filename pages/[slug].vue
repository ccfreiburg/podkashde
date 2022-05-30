<template>
  <div class="w-full h-full">
    <div v-if="podcast" class="m-10 flex flex-col">
      <div class="flex flex-row">
        <img class="h-32 shrink-0" :src="imgUrl" />
        <div class="h-32 pl-3 flex flex-col rounded-r-md">
          <div class="flex flex-row">
            <div class="text-xl flex-grow">{{ podcast.title }}</div>
            <NuxtLink :to="'/admin/' + podcast.slug">
              <button
                class="
                  p-1
                  border-1 border-gray-700
                  text-orange-300
                  bg-gray-200
                  rounded-2xl
                  hover:bg-orange-800
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </NuxtLink>
          </div>
          <div class="text-xl">{{ podcast.author }}</div>
          <div class="flex flex-row">
            <div class="text-sm text-white rounded-md bg-orange-300 px-1">
              Religion - Christianity
            </div>
          </div>
          <div class="pt-2 w-full text-sm break-normal overflow-y-auto">
            {{ podcast.summary }}
          </div>
        </div>
      </div>
      <div v-if="view == PodcastView.PodcastEpisodes" class="mt-2">
        <podcast-episodes podcastid="podcast.id" />
      </div>
      <div v-else class="pt-2 w-full text-xs">{{ podcast.description }}</div>
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

enum PodcastView {
  PodcastDetail,
  PodcastEpisodes,
}

export default defineComponent({
  async setup() {
    const route = useRoute();
    var podcast = ref(new Podcast());
    var result = {};
    var view = ref(PodcastView.PodcastEpisodes);
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
      PodcastView,
      view,
    };
  },
});
</script>

<style>
</style>