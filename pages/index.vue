<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <div></div>
      <NuxtLink :to="newPodcast">
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
      </NuxtLink>
      <div class="flex felx-col flex-wrap text-sm">
        <div v-for="podcast in podcasts" :key="podcast.id">
          <NuxtLink :to="podcast.slug">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PODCASTS_AP, ROUTE_NEWPODCAST } from "~~/backend/Constants";
import Podcast from "~~/backend/entities/Podcast";
import { ImageMetadata } from "~~/backend/ImageMetadata";

const newPodcast = ref(ROUTE_NEWPODCAST);
const result = await useFetch(PODCASTS_AP);

const podcasts = ref(result.data.value as Array<Podcast>);
</script>
