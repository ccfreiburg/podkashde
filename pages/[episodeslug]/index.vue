<template>
  <div>
    <div class="w-full h-full p-10">
      <div v-if="episode">
        <div class="flex flex-row">
          <img class="h-64 shrink-0" :src="episode.image" />
          <div class="h-64 pl-10 flex flex-col rounded-r-md">
            <div class="flex flex-col flex-grow">
              <div class="text-2xl" v-html="episode.title"></div>
              <div class="text-ml flex-grow" v-html="episode.subtitle"></div>
              <div class="text-xl">{{ episode.creator }}</div>
              <div class="text-xl" v-html="episode.summary"></div>
              <div v-if="episode.block" class="text-xl flex-grow">blocked</div>
              <div v-if="episode.explicit" class="text-xl flex-grow">
                explicit
              </div>
              <div class="flex flex-row flex-grow justify-between">
                <div class="text-ml">{{ episode.duration }}</div>
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
        <div class="text-orange-600" @click="showdetail=!showdetail">{{ (showdetail?"less details":"more details")}}</div>
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
              <td>{{ (["podcast","serie"].includes(objectkey)?episode[objectkey].title:episode[objectkey]) }}</td>
            </tr>
          </tbody>
        </table>
    </div>
  </div>
  </div>
</template>
<script setup lang="ts">
import { useEpisode } from "~~/composables/episodedata";
const route = useRoute();
const slug = route.params.episodeslug as string;
const showdetail = ref(false)
const { refresh, episode } = await useEpisode(slug);
</script>