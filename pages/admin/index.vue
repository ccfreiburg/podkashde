<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <div>
        {{ message }}
      </div>
      <button
        class="mt-5 h-10 border-2 rounded-md bg-orange-300 hover:bg-orange-400"
        @click="newPodcast"
      >
        New Podcast
      </button>
      <div class="flex felx-col flex-wrap text-sm">
        <div
          class="flex flex-row m-2"
          v-for="podcast in podcasts"
          :key="podcast.id"
          @click="openPodcast(podcast.id)"
        >
          <img
            class="w-32 h-32 rounded-l-md"
            :src="'../data/img/' + podcast.cover_file"
          />
          <div
            class="flex flex-col h-32 w-96 border-2 rounded-r-md flex-shrink-0"
          >
            <div class="p-3 text-2xl">{{ podcast.title }}</div>
            <div class="pl-3">{{ podcast.author }}</div>
            <button
              class="
                mt-5
                h-10
                border-2
                rounded-md
                bg-orange-300
                hover:bg-orange-400
              "
              :value="podcast.id"
              @click="newEpisode"
            >
              Add Episode
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Podcast from "~~/backend/entities/Podcast";

export default defineComponent({
  name: "Podcast",
  data: () => {
    return {
      podcasts: [] as Array<Podcast>,
      message: "",
    };
  },
  mounted() {
    this.fetchPodcastList();
  },
  methods: {
    async fetchPodcastList() {
      const result = await $fetch("/api/podcasts");
      if (!result) return;
      this.podcasts = result;
    },
    newPodcast() {
      // navigate
    },
    openPodcast(podcastid) {},
    newEpisode(event) {
      event.stopImmediatePropagation();
      const podcastid = event.target.value;
    },
  },
});
</script>
