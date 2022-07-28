<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <div></div>
      <!--NuxtLink :to="newPodcast">
        <div
          class="
            mt-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
        >
          {{ $t("newPodcast") }}
        </div>
      </NuxtLink-->
      <div class="flex felx-col flex-wrap text-sm">
        <div v-for="podcast in podcasts" :key="podcast.id">
          <NuxtLink :to="'/podcast/'+podcast.slug">
            <div class="flex flex-row m-2">
              <img class="w-32 h-32 rounded-l-md" :src="podcast.cover_file" />
              <div
                class="
                  flex flex-col
                  h-32
                  w-96
                  border-2
                  rounded-r-md
                  flex-shrink-0
                "
              >
                <div class="p-3 text-2xl">{{ podcast.title }}</div>
                <div class="pl-3">{{ podcast.author }}</div>
              </div>
            </div>
            </NuxtLink>
        </div>
      </div>
    </div>
    <button class="ml-2 p-3 bg-orange-300 rounded-md" @click="refresh">Hallo</button>
  </div>
</template>

<script setup lang="ts">
import { usePodcasts } from '~~/composables/data';
const { refresh, podcasts } = await usePodcasts()
</script>
