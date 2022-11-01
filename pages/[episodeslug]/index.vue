<template>
  <div>
    <NuxtLink v-if="user" :to="'/admin/' + slug">
      <button
        class="p-1 border-1 border-gray-700 text-orange-300 bg-gray-200 rounded-2xl hover:bg-orange-800"
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
    <div v-else class="pt-10"></div>
    <div class="flex flex-col items-center">
      <div class="md:w-2/3 md:h-60 flex flex-row">
        <img class="h-20 md:h-60 shrink-0" :src="episode.image" />
        <div class="pl-8 py-4 flex flex-col justify-around rounded-r-md">
          <div class="text-2xl font-semibold">{{ episode.title }}</div>
          <div class="text-md">{{ episode.subtitle }}</div>
          <div class="text-ml">{{ episode.creator }}</div>
          <div class="flex flex-row flex-wrap">
            <div
              v-if="episode.explicit"
              class="text-xs text-white font-bold rounded-md bg-orange-900 px-1 m-1"
            >
              explicit
            </div>
            <div
              v-if="episode.block"
              class="text-xs text-white font-bold rounded-md bg-orange-900 px-1 m-1"
            >
              blocked
            </div>
          </div>
          <div class="pt-2 w-full text-sm break-normal overflow-y-auto">
            {{ episode.summary }}
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
          <div
            class="text-sm mt-10 flex-grow"
            v-html="episode.description"
          ></div>
        </div>
      </div>
    </div>
    <div class="w-full relative flex flex-row">
      <div
        class="p-4 w-screen absolute -top-8 bg-gray-200 -z-10 flex flex-col items-center"
      >
        <div class="md:w-2/3 pt-16 font-bold text-gray-700 text-center">
        </div>
        <div class="md:w-2/3 pt-8"></div>
        <div class="h-screen bg-gray-200">
          <div class="text-sm mx-10">
            <div class="text-orange-600" @click="showdetail = !showdetail">
              {{ showdetail ? 'less details' : 'more details' }}
            </div>
            <div v-if="showdetail">
              <table class="border-separate border-spacing-3">
                <thead>
                  <tr>
                    <th class="bg-orange-200">Label</th>
                    <th class="bg-orange-200">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(objectkey, index) in Object.keys(episode)"
                    :key="index"
                  >
                    <td>{{ objectkey }}</td>
                    <td>
                      <div v-if="episode[objectkey]">
                        {{
                          ['podcast', 'serie'].includes(objectkey)
                            ? episode[objectkey].title
                            : episode[objectkey]
                        }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { durationInSecToStr } from '~~/base/Converters';
import { useEpisode } from '~~/composables/episodedata';
const route = useRoute();
const slug = route.params.episodeslug as string;
const showdetail = ref(false);
const { refresh, episode } = await useEpisode(slug);
if (route.query.refresh) refresh();
const user = await useState('user');
const duration = () => durationInSecToStr(episode.value.duration);
</script>
