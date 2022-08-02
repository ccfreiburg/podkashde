<template>
  <div>
      <div class="flex flex-row">
        <img class="h-40 shrink-0" :src="podcast.cover_file" />
        <div class="h-40 pl-3 flex flex-col rounded-r-md">
          <div class="flex flex-row">
            <div class="text-2xl flex-grow">{{ podcast.title }}</div>
            <NuxtLink :to="'/admin/podcast/' + podcast.slug">
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
            <!-- <div class="text-sm text-white rounded-md bg-orange-300 px-1 mr-1">
              {{ podcastGenre.parentCategory }} - {{ podcastGenre.displaytext }}
            </div> -->
            <div
              v-if="podcast.explicit"
              class="text-sm text-white rounded-md bg-orange-900 px-1 mr-1"
            >
              explicit
            </div>
            <!-- <div class="text-sm text-white rounded-md bg-orange-300 px-1 mr-1">
              {{ language.displaytext }}
            </div> -->
          </div>
          <div class="pt-2 w-full text-sm break-normal overflow-y-auto">
            {{ podcast.summary }}
          </div>
        </div>
      </div>
      <div v-if="user!=null"> 
        <NuxtLink :to="'/admin/podcast/' + podcast.slug + '/new-episode'">
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
        </div>
        <podcast-episodes :episodes="podcast.episodes"/>
    <button class="ml-2 p-3 bg-orange-300 rounded-md" @click="refresh">Hallo</button>
  </div>
</template>
<script setup lang="ts">
//import { useEnumerations } from '~~/composables/enumerationdata';
import { usePodcast } from '~~/composables/podcastdata';

const user = useState('user')
const route = useRoute();
const slug = route.params.slug as string
// const {getLanguage, getGenre} = await useEnumerations()
const { refresh, podcast } = await usePodcast(slug)
// const language = ref(getLanguage(podcast.value.language_id))
// const podcastGenre = ref(getGenre(podcast.value.category_id))
</script>