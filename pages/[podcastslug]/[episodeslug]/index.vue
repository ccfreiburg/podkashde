<template>
  <div class="w-full h-full p-10">
    <div v-if="episode">
      <div class="flex flex-row">
        <img class="h-64 shrink-0" :src="imgUrl" />
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
        </div>
      </div>
    </div>
    <div class="text-sm mt-10 flex-grow" v-html="episode.description"></div>
    <div class="text sm">
      {{ JSON.stringify(episode) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { EPISODES_AP } from "~~/backend/Constants";
import { getEpisode } from "~~/backend/entities/Episode";

const route = useRoute();
const result = await useFetch(
  EPISODES_AP + "?slug=" + route.params.episodeslug
);
const episode = ref(getEpisode(result.data.value));

const pubDateFmt = computed(() => {
  var d = episode.value.pubdate as Date;
  return d.toLocaleDateString();
});
const imgUrl = computed(() => {
  return episode.value.image;
});
</script>