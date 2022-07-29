<template>
  <div class="m-10">
    <div class="flex flex-col">
      <div class="flex flex-row" v-for="(episode, index) in sortedFilteredList" :key="index">
        <NuxtLink :to="episode.nuxtlink">
          <div class="flex flex-row m-2">
            <img class="w-16 h-16 rounded-l-md" :src="episode.image" />
            <div class="text-sm flex flex-col ml-3">
              <div v-html="episode.title"></div>
              <div class="mt-1" v-html="episode.creator"></div>
              <div>
                {{ episode.datestring }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { tSImportType } from "@babel/types";
import { PropType } from "vue";
import IEpisode from "~~/base/types/IEpisode";

interface IDisplayEpisode extends IEpisode {
  nuxtlink: string;
  datestring: string;
  sortdate: Date;
}

export default {
  props: {
    episodes: Object as PropType<Array<IEpisode>>,
  },
  name: "PodcastEpisodes",
  setup(props) {
    
    const dateformat = (input: Date) : string => input.toLocaleDateString();

    function expandAndFilter(list : Array<IEpisode>) : Array<IDisplayEpisode> {
      if (!list || list.length<1) 
        return [];
      const filter = (e)=>true
      return list.filter(filter).map((e)=> {
          const date = new Date(e.pubdate)
         return { 
          ...e, 
          nuxtlink: "/" + e.slug,
          sortdate: date,
          datestring: date.toLocaleDateString(),
          }
        });
    }
    function sortList(list : Array<IDisplayEpisode>) : Array<IDisplayEpisode> {
      return list.sort((a : IDisplayEpisode, b : IDisplayEpisode) => (b.sortdate.valueOf() - a.sortdate.valueOf()))
    }
    const sortedFilteredList = ref([]);
    onMounted(() => {
      sortedFilteredList.value = sortList(expandAndFilter(props.episodes))
    })
    return {
      sortedFilteredList,
    };
  },
};
</script>
