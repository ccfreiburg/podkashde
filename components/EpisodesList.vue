<template>
  <div class="text-xs md:text-md lg:text-base w-full flex flex-col">
    <div v-if="(episodes?.length>0)" class="flex place-items-end place-content-end pt-1 px-1 md:px-4 text-gray-500">
      <div v-if="!searchHiden" class="flex flex-row flex-nowrap items-center">
        <input-area class="pb-8" :name="'search'" label="" v-model:value="search" />
        <div @click="() => {search='';searchHiden=true}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <div v-else @click="searchHiden=!searchHiden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>  
      </div>
    </div>
    <div
      class="flex flex-col"
      v-for="(episode, index) in sortedFilteredList"
      :key="index"
    >
      <NuxtLink :to="localePath(episode.nuxtlink)">
        <div class="mt-1 md:px-2 py-2 hover:bg-slate-100 md:rounded-xl 
        flex flex-col sm:flex-row place-content-center place-items-center 
        items-center bg-white sm:bg-transparent text-xs lg:text-sm xl:text-lg  2xl:text-xl">
          <div class="flex-shrink-0">
            <img class="max-w-20 max-h-20" :src="episode.image" />
          </div>
          <div class="flex-grow flex flex-col sm:flex-row place-content-center place-items-center">
            <div class="sm:w-9/12 pt-2 sm:pt-0 font-semibold text-center sm:font-normal sm:text-left pl-2 md:pl-8"> 
              <div v-html="episode.title" /> 
              <div class="invisible sm:visible" v-html="(episode.cross_ref)" /> 
            </div>
            <div class="sm:w-2/12 pl-1 text-center sm:text-left md:whitespace-nowrap sm:text-md">{{episode.creator}}</div>
          </div>
           <div class="sm:w-26 pr-1 text-center sm:text-right">{{ episode.datestring }}</div>
          <div class="sm:w-10 invisible sm:visible flex justify-end">
            <button class="ccfplay rounded-2xl h-6 w-6 md:h-8 md:w-8">
              <div class="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center">
                <svg
                  class="h-3 w-3 md:h-5 md:w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </NuxtLink>
    </div>
    <list-paginator :max="max" v-model:value="page" :itemsperpage="itemsperpage"/>
    <div class="h-10"></div>
  </div>
</template>

<script lang="ts">
import { tSImportType } from '@babel/types';
import { PropType } from 'vue';
import IEpisode from '~~/base/types/IEpisode';
import { NUM_ITEMS_PER_PAGE } from '~~/base/Constants';

interface IDisplayEpisode extends IEpisode {
  nuxtlink: string;
  datestring: string;
  sortdate: Date;
}

export default {
  props: {
    episodes: Object as PropType<Array<IEpisode>>,
  },
  name: 'EpisodesList',
  async setup(props) {
    const dateformat = (input: Date): string => input.toLocaleDateString();
    const localePath = useLocalePath();
    const search = ref("")
    const searchHiden = ref(true)
    const itemsperpage = ref(NUM_ITEMS_PER_PAGE)
    const page = ref(1)
    const max = ref(props.episodes?.length)
    const user = await useAuth().useAuthUser() as any;

    const pageFilter = (e, index) => {
        const start = (page.value-1)*itemsperpage.value -1
        const end = start + itemsperpage.value
        return index>start && index<=end
    }

    function expandAndFilter(list: Array<IEpisode>, search: string): Array<IDisplayEpisode> {
      if (!list || list.length < 1) return [];
      const filter = (e) =>  {
        return search.length<3 ||
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.creator.toLowerCase().includes(search.toLowerCase()) ||
          e.cross_ref?.toLowerCase().includes(search.toLowerCase())
      }
      return list.filter( (e) => !e.draft || user.value ).filter(filter).map((e) => {
        const date = new Date(e.pubdate);
        return {
          ...e,
          nuxtlink: '/' + e.slug,
          sortdate: date,
          datestring: date.toLocaleDateString(),
        };
      });
    }

    function sortList(list: Array<IDisplayEpisode>): Array<IDisplayEpisode> {
      return list.sort(
        (a: IDisplayEpisode, b: IDisplayEpisode) =>
          b.sortdate.valueOf() - a.sortdate.valueOf()
      );
    }
    const sortedFilteredList = computed(() =>{
        const sortlist = sortList(expandAndFilter(props.episodes, search.value))
        max.value = sortlist.length
        if (itemsperpage.value==0 || page.value==0) return sortlist
        return sortlist.filter(pageFilter)
      }
    );
    return {
      sortedFilteredList,
      searchHiden,
      search,
      itemsperpage,
      page,
      max,
      localePath
    };
  },
};
</script>
