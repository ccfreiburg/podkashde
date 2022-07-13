<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <div>
        {{ message }}
      </div>
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
              <img
                class="w-32 h-32 rounded-l-md"
                :src="imgUrl(podcast.cover_file)"
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
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IMAGES_BASE_URL, ROUTE_NEWPODCAST } from "~~/backend/Constants";
import Podcast from "~~/backend/entities/Podcast";

export default defineComponent({
  name: "Podcast",
  data: () => {
    return {
      podcasts: [] as Array<Podcast>,
      message: "",
      newPodcast: ROUTE_NEWPODCAST,
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
    imgUrl(cover_file) {
      if (cover_file && cover_file.length > 0) {
        if (
          cover_file.startsWith("http://") ||
          cover_file.startsWith("https://")
        )
          return cover_file;
        else return IMAGES_BASE_URL + cover_file;
      } else return "";
    },
  },
});
</script>
