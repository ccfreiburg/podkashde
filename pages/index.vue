<template>
  <div class="w-full h-full">
    <podcast-detail
      :podcast="currentPodcast"
      v-if="view == PodcastView.PodcastDetail"
      @onsaved="onsaved"
      @oncancel="view = PodcastView.PodcastList"
      @ondeleted="ondeleted"
    />
    <podcast-episodes
      v-else-if="view == PodcastView.PodcastEpisodes"
      :podcast="currentPodcast"
    />
    <div v-else-if="view == PodcastView.PodcastList">
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
          @click="newPodcast"
        >
          New Podcast
        </button>
        <div class="flex felx-col flex-wrap text-sm">
          <div v-for="podcast in podcasts" :key="podcast.id">
            <NuxtLink :to="podcast.slug">
              <div class="flex flex-row m-2">
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
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Podcast from "~~/backend/entities/Podcast";

enum PodcastView {
  PodcastDetail,
  PodcastList,
  PodcastEpisodes,
  EpisodeDetail,
}

export default defineComponent({
  name: "Podcast",
  data: () => {
    return {
      podcasts: [] as Array<Podcast>,
      currentPodcast: new Podcast(),
      PodcastView,
      view: PodcastView.PodcastList,
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
    onsaved(title) {
      this.message = "Successfully saved podcast " + title;
      this.fetchPodcastList();
      this.view = PodcastView.PodcastList;
    },
    ondeleted(title) {
      this.message = "Deleted podcast " + title;
      this.fetchPodcastList();
      this.view = PodcastView.PodcastList;
    },
    newPodcast() {
      this.view = PodcastView.PodcastDetail;
      this.currentPodcast = new Podcast();
    },
    openPodcast(podcastid) {
      var found = this.podcasts.find((podcast) => podcast.id == podcastid);
      this.view = PodcastView.PodcastDetail;
      if (found) this.currentPodcast = found;
    },
    newEpisode(event) {
      event.stopImmediatePropagation();
      const podcastid = event.target.value;
      var found = this.podcasts.find((podcast) => podcast.id == podcastid);
      if (found) {
        this.currentPodcast = found;
        this.view = PodcastView.PodcastEpisodes;
      }
    },
  },
});
</script>
