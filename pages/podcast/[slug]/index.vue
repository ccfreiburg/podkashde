<template>
  <div>
    <sub-menu v-if="user != null" :items="submenu"/>
    <div class="w-full flex justify-center">
      <div
        class="mt-6 md:mt-12 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;Podcast Episodes&nbsp;
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-11/12 md:w-2/3 md:h-60 flex flex-row">
        <img class="h-20 md:h-60 shrink-0" :src="podcast.cover_file" />
        <div
          class="pl-4 md:pl-14 pt-1 pb-10 flex flex-col justify-around rounded-r-md"
        >
          <div>
            <div class="text-md md:text-2xl font-semibold tracking-wider">
              {{ podcast.title }}
            </div>
            <div class="text-xs md:text-sm tracking-wide text-gray-500">
              {{ podcast.subtitle }}
            </div>
          </div>
          <div class="text-xs md:text-sm">{{ podcast.author }}</div>
          <div
            class="hidden md:inline-flex pt-2 w-full h-12 text-sm break-normal overflow-y-auto"
          >
            {{ podcast.summary }}
          </div>
          <div class="hidden md:inline-flex">
            <div class="flex flex-row flex-wrap">
            <div
              class="text-xs text-white font-bold rounded-md ccfheader px-1 my-1 mr-1 whitespace-nowrap"
            >
              {{ podcastGenre.parentCategory }} - {{ podcastGenre.displaytext }}
            </div>
            <div
              v-if="podcast.explicit"
              class="text-xs text-white font-bold rounded-md bg-orange-900 px-1 m-1"
            >
              explicit
            </div>
            <div
              class="text-xs text-white font-bold rounded-md ccfheader px-1 m-1"
            >
              {{ language.displaytext }}
            </div>
          </div>
          </div>
        </div>
      </div>
      <div class="w-full relative">
        <div
          class="p-4 w-screen absolute -top-8 bg-gray-200 -z-10 flex flex-col items-center"
        ></div>
      </div>
      <div class="w-full h-screen bg-gray-200 flex flex-col items-center">
        <div class="w-11/12 md:w-2/3 flex flex-col justify-center">
          <div
            class="md:pt-14 text-sm md:text-ml tracking-widest font-bold text-gray-500 text-center"
          >
            in this series
          </div>
          <podcast-episodes :episodes="episodes" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEnumerations } from '~~/composables/enumerationdata';
import { usePodcast } from '~~/composables/podcastdata';

const user = await useUser();
const route = useRoute();
const slug = route.params.slug as string;
const submenu = [
{
    id: 0,
    name: "podcast.edit",
    slug: "/admin/podcast/"+slug,
    layout: "edit"
  },
  {
    id: 1,
    name: "episode.add",
    slug: "/admin/podcast/"+slug+"/new-episode",
    layout: "add"
  }
]
const { refresh, podcast, episodes } = await usePodcast(slug);
if (route.query.refresh) await refresh();

const { enumerations } = await useEnumerations();
const language = ref(enumerations.getLanguage(podcast.value.language_id));
const podcastGenre = ref(enumerations.getGenre(podcast.value.category_id));
</script>
