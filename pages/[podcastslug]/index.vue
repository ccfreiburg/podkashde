<template>
  <div class="w-full h-full">
    <div v-if="podcast" class="m-10 flex flex-col">
      <div class="flex flex-row">
        <img class="h-40 shrink-0" :src="imgUrl" />
        <div class="h-40 pl-3 flex flex-col rounded-r-md">
          <div class="flex flex-row">
            <div class="text-2xl flex-grow">{{ podcast.title }}</div>
            <NuxtLink :to="'/' + podcast.slug + '/edit'">
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
          <div class="text-xl flex-grow">{{ podcast.subtitle }}</div>
          <div class="text-ml">{{ podcast.author }}</div>
          <div class="flex flex-row">
            <div class="text-sm text-white rounded-md bg-orange-300 px-1 mr-1">
              {{ podcastGenre.parentCategory }} - {{ podcastGenre.displaytext }}
            </div>
            <div
              v-if="podcast.explicit"
              class="text-sm text-white rounded-md bg-orange-900 px-1 mr-1"
            >
              explicit
            </div>
            <div class="text-sm text-white rounded-md bg-orange-300 px-1 mr-1">
              {{ language.displaytext }}
            </div>
          </div>
          <div class="pt-2 w-full text-sm break-normal overflow-y-auto">
            {{ podcast.summary }}
          </div>
        </div>
      </div>
      <div v-if="view == PodcastView.PodcastEpisodes" class="mt-2">
        <NuxtLink :to="'/' + podcast.slug + '/newepisode'">
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
            +
          </button>
        </NuxtLink>
        <podcast-episodes
          :episodes="podcast.episodes"
          :podcastSlug="podcast.slug"
        />
      </div>
      <div v-else class="pt-2 w-full text-xs">{{ podcast.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getPodcast } from "~~/backend/entities/Podcast";
import { ENUMERATIONS_AP, PODCASTS_AP } from "~~/backend/Constants";
import { Enumerations } from "~~/backend/Enumerations";
import Enumerator from "~~/backend/entities/Enumerator";

enum PodcastView {
  PodcastDetail,
  PodcastEpisodes,
}

const route = useRoute();
const view = ref(PodcastView.PodcastEpisodes);

const result = await useFetch(
  PODCASTS_AP + "?slug=" + route.params.podcastslug
);

if (!result.data) {
  navigateTo({
    path: "/",
  });
}
const podcast = ref(getPodcast(result.data.value[0]));

const enumerations = new Enumerations();
const enums: Array<Enumerator> = await $fetch(ENUMERATIONS_AP);
enumerations.init(enums);
const podcastGenre = ref(
  Enumerations.byIdOne(enumerations.podcastGenres, podcast.value.category_id)
);
const language = ref(
  Enumerations.byIdOne(enumerations.languages, podcast.value.language_id)
);

const imgUrl = computed(() => {
  return podcast.value.cover_file;
});
</script>