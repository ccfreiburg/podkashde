<template>
  <div>
    <div class="w-full flex justify-center">
        <div
          class="mt-6 md:mt-10 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
        >&nbsp;Podcasts&nbsp;
        </div>
  </div>
  <div class="w-full h-screen bg-gray-200 flex justify-center">
    <div class="pt-6 md:pt-10 w-5/6 md:w-2/3 md:h-60 flex flex-col">
      <div v-for="podcast in podcasts" :key="podcast.id">
          <NuxtLink :to="'/podcast/' + podcast.slug">
            <div class="mt-4 p-4 bg-white flex flex-row">
              <img class="w-32 h-32" :src="podcast.cover_file" />
              <div
                class="pl-6 md:pl-12 py-2 flex flex-col justify-around items-start rounded-r-md"
              >
              <div>
                <div class="text-md md:text-xl font-semibold tracking-wider">
                  {{ podcast.title }}
                </div>
                <div class="text-xs md:text-sm tracking-wide text-gray-500">
                  {{ podcast.subtitle }}
                </div>
              </div>
              <div class="text-xs md:text-sm tracking-wide">
                  {{ podcast.author }}</div>
              <div class="grow-0 text-xs underline md:text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700"
        >To the episodes...</div>
      </div>
            </div>
          </NuxtLink>
        </div>
      </div>      
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePodcasts } from '~~/composables/podcastdata';
import { loginWithEmail } from '../composables/authentication';
const { refresh, podcasts } = await usePodcasts()
const route = useRoute();
if (route.query.refresh)
  refresh();
</script>
