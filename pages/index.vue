<template>
  <div class="w-full h-full">
    <podcast-detail
      :podcast="currentPodcast"
      v-if="!listview"
      @onsaved="onsaved"
      @oncancel="listview = true"
    />
    <div v-else>
      <div class="flex flex-col">
        <div>
          {{ message }}
        </div>
        <button
          class="
            mt-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
          @click="listview = false"
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
              :src="'data/img/' + podcast.cover_file"
            />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Podcast from "~~/backend/entities/Podcast";

export default defineComponent({
  name: "PodcastDetail",
  data: () => {
    return {
      podcasts: [] as Array<Podcast>,
      currentPodcast: new Podcast(),
      listview: false,
      message: "",
    };
  },
  mounted() {
    this.fetchPodcastList();
  },
  methods: {
    async fetchPodcastList() {
      this.podcasts = (await $fetch("/api/podcasts")) as Array<Podcast>;
      console.log(this.podcasts);
    },
    onsaved(title) {
      this.message = "Successfully saved podcast " + title;
      this.fetchPodcastList();
      this.listview = true;
    },
    openPodcast(podcastid) {
      var found = this.podcasts.find((p) => p.id == podcastid);
      this.currentPodcast = found as Podcast;
      this.listview = false;
    },
  },
});
</script>
