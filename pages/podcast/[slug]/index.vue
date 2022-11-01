<template>
  <div>
    <div v-if="user != null" class="pb-2 h-10 text-orange-400 text-end">
      <NuxtLink :to="'/admin/podcast/' + podcast.slug">
        <button class="p-1 h-8 w-20 rounded-xl hover:bg-orange-800">
          <div class="h-8 w-20 flex">
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
            <div class="pl-1">Edit</div>
          </div>
        </button>
      </NuxtLink>
      <NuxtLink :to="'/admin/podcast/' + podcast.slug + '/new-episode'">
        <button class="p-1 h-8 rounded-xl hover:bg-orange-800">
          <div class="h-8 flex">
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>

            <div class="pl-1 whitespace-nowrap">Add Episode</div>
          </div>
        </button>
      </NuxtLink>
    </div>
    <div v-else class="pt-10"></div>
    <div class="flex flex-col items-center">
      <div class="md:w-2/3 md:h-60 flex flex-row">
        <img class="h-20 md:h-60 shrink-0" :src="podcast.cover_file" />
        <div class="pl-8 py-4 flex flex-col justify-around rounded-r-md">
          <div class="text-2xl font-semibold">{{ podcast.title }}</div>
          <div class="text-md">{{ podcast.subtitle }}</div>
          <div class="text-ml">{{ podcast.author }}</div>
          <div class="flex flex-row flex-wrap">
            <div
              class="text-xs text-white font-bold rounded-md ccfheader px-1 m-1 whitespace-nowrap"
            >
              {{ podcastGenre.parentCategory }} - {{ podcastGenre.displaytext }}
            </div>
            <div
              v-if="podcast.explicit"
              class="text-xs text-white font-bold rounded-md bg-orange-900 px-1 m-1"
            >
              explicit
            </div>
            <div class="text-xs text-white font-bold rounded-md ccfheader px-1 m-1">
              {{ language.displaytext }}
            </div>
          </div>
          <div class="pt-2 w-full text-sm break-normal overflow-y-auto">
            {{ podcast.summary }}
          </div>
        </div>
      </div>
      <div class="w-full relative flex flex-row">
        <div class="p-4 w-screen absolute -top-8 bg-gray-200 -z-10 flex flex-col items-center">
          <div class="md:w-2/3 pt-16 font-bold text-gray-700 text-center">
              in this series
          </div>
          <div class="md:w-2/3 pt-8">
            <podcast-episodes :episodes="episodes" />
          </div>
          <div class="h-screen bg-gray-200"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEnumerations } from '~~/composables/enumerationdata';
import { usePodcast } from '~~/composables/podcastdata';
const user = await useUser();
const route = useRoute();

const slug = route.params.slug as string;
const { refresh, podcast, episodes } = await usePodcast(slug);
if (route.query.refresh) await refresh();

const { enumerations } = await useEnumerations();
const language = ref(enumerations.getLanguage(podcast.value.language_id));
const podcastGenre = ref(enumerations.getGenre(podcast.value.category_id));
</script>
