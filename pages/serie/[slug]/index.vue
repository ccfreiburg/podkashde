<template>
  <div>
      <div class="flex flex-row">
        <img class="h-40 shrink-0" :src="serie.cover_file" />
        <div class="h-40 pl-3 flex flex-col rounded-r-md">
          <div class="flex flex-row">
            <div class="text-2xl flex-grow">{{ serie.title }}</div>
            <NuxtLink v-if="user" :to="'/admin/serie/' + serie.slug">
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
          <div class="text-xl flex-grow">{{ serie.subtitle }}</div>
          <div class="pt-2 w-full text-sm break-normal overflow-y-auto">
            {{ serie.description }}
          </div>
        </div>
      </div>
            <!-- <div v-if="user!=null"> 
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
        </div> -->

        <!-- <podcast-episodes :episodes="episodes"/> -->
    <button class="ml-2 p-3 bg-orange-300 rounded-md" @click="refresh">Hallo</button>
  </div>
</template>
<script setup lang="ts">
import { useEnumerations } from '~~/composables/enumerationdata';
import { useSerie } from '~~/composables/seriedata';
const user = await useUser()
const route = useRoute();

const slug = route.params.slug as string
const { refresh, serie } = await useSerie(slug)
if (route.query.refresh)
  await refresh();
</script>