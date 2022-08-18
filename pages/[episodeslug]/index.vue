<template>
  <div>
    <div class="w-full h-full p-10">
      <div v-if="episode">
        <div class="flex flex-row">
          <img class="h-64 shrink-0" :src="episode.image" />
          <div class="h-64 pl-10 flex flex-col rounded-r-md">
            <div class="flex flex-col flex-grow">
              <div class="flex flex-row">
                <div class="text-2xl flex-grow" v-html="episode.title"></div>
                <div class="content-right flex-grow">
                  <NuxtLink v-if="user" :to="'/admin/' + slug">
                    <button class="
                  p-1
                  border-1 border-gray-700
                  text-orange-300
                  bg-gray-200
                  rounded-2xl
                  hover:bg-orange-800
                ">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </NuxtLink>
                </div>
              </div>
              <div class="text-ml flex-grow" v-html="episode.subtitle"></div>
              <div class="text-xl">{{ episode.creator }}</div>
              <div class="text-xl" v-html="episode.summary"></div>
              <div v-if="episode.block" class="text-xl flex-grow">blocked</div>
              <div v-if="episode.explicit" class="text-xl flex-grow">
                explicit
              </div>
              <div class="flex flex-row flex-grow justify-between">
                <div class="text-ml">{{ duration() }}</div>
                <div class="text-ml mx-3">
                  {{ new Date(episode.pubdate).toLocaleDateString() }}
                </div>
                <div class="text-ml">
                  {{ (episode.rawsize / (1024 * 1024)).toFixed(2) }}MB
                </div>
              </div>
            </div>
            <div class="text-sm mt-10 flex-grow" v-html="episode.description"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-sm mx-10">
      <div class="text-orange-600" @click="showdetail = !showdetail">{{ (showdetail ? "less details" : "more details")
      }}</div>
      <div v-if="showdetail">
        <table class="border-separate border-spacing-3">
          <thead>
            <tr>
              <th class="bg-orange-200">Label</th>
              <th class="bg-orange-200">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(objectkey, index) in Object.keys(episode)" :key="index">
              <td>{{ objectkey }}</td>
              <td>
                <div v-if="episode[objectkey]">
                  {{ (["podcast", "serie"].includes(objectkey) ? episode[objectkey].title : episode[objectkey]) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { durationInSecToStr } from "~~/base/Converters";
import { useEpisode } from "~~/composables/episodedata";
const route = useRoute();
const slug = route.params.episodeslug as string;
const showdetail = ref(false)
const { refresh, episode } = await useEpisode(slug);
if (route.query.refresh)
  refresh();
const user = await useState('user')
const duration = () => durationInSecToStr(episode.value.duration)
</script>