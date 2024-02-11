<template>
  <div class="flex flex-col w-full text-xs md:text-md lg:text-base">
    <div v-if="(episodes?.length > 0)" class="flex px-1 pt-1 place-items-end place-content-end md:px-2">
      <div v-if="!searchHiden" class="flex flex-row items-center flex-nowrap">
        <input-area class="pb-8" :name="'search'" label="" v-model:value="search" />
        <div @click="() => { search = ''; searchHiden = true }">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <div v-else @click="toggleSearch" class="pt-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
    </div>
    <div class="flex flex-col" v-for="(episode, index) in sortedFilteredList" :key="index">
      <NuxtLink :to="localePath(episode.nuxtlink)">
        <div class="flex flex-col items-center py-2 mt-1 text-xs md:px-2 md:rounded-xl lg:text-sm xl:text-lg 2xl:text-xl place-content-center place-items-center hover:bg-skin-light dark:hover:bg-skin-dark sm:flex-row sm:bg-transparent">
          <div class="flex-shrink-0">
            <img class="h-20" :src="ContentFile.getMediaUrl(episode.image)" />
          </div>
          <div class="flex flex-col items-center flex-grow sm:flex-row ">
            <div class="pt-2 pl-2 text-center sm:w-9/12 sm:pt-0 sm:text-left lg:pl-4 2xl:pl-8">
              <div class="font-semibold " v-html="episode.title" />
              <div class="invisible sm:visible sm:pt-1 text-skin-muted dark:text-skin-muted-dark"
                v-html="(episode.cross_ref)" />
            </div>
            <div class="pl-1 overflow-hidden text-center sm:w-3/12 sm:text-left sm:text-md">
              {{ episode.creator }}</div>
          </div>
          <div class="pr-1 text-center sm:w-26 sm:text-right">{{ episode.datestring }}</div>
          <div class="flex justify-end invisible sm:w-10 sm:visible text-skin-inverted">
            <button class="w-6 h-6 bg-gradient-to-r from-skin-from via-skin-via to-skin-to rounded-2xl md:h-8 md:w-8">
              <div class="flex items-center justify-center w-6 h-6 md:h-8 md:w-8">
                <svg class="w-3 h-3 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </NuxtLink>
    </div>
    <list-paginator :max="max" v-model:value="page" :itemsperpage="itemsperpage" />
    <div class="h-10"></div>
  </div>
</template>

<script lang="ts">
import type IEpisode from '~~/base/types/IEpisode';
import { NUM_ITEMS_PER_PAGE } from '~~/base/Constants';
import { ContentFile } from '~~/base/ContentFile'
import { dateToString } from '~~/base/Converters'


interface IDisplayEpisode extends IEpisode {
  nuxtlink: string;
  datestring: string;
  sortdate: Date;
}

export default {
  props: {
    episodes: Object as PropType<Array<IEpisode>>,
    showDrafts: {
      type: Boolean,
      default: false
    } 
  },
  name: 'EpisodesList',
  async setup(props) {
    const {locale} = useI18n();
    const localePath = useLocalePath();
    const search = ref("")
    const searchHiden = ref(true)
    const itemsperpage = ref(NUM_ITEMS_PER_PAGE)
    const page = ref(1)
    const max = ref(props.episodes?.length)

    const pageFilter = (e, index) => {
      const start = (page.value - 1) * itemsperpage.value - 1
      const end = start + itemsperpage.value
      return index > start && index <= end
    }

    function expandAndFilter(list: Array<IEpisode>, search: string): Array<IDisplayEpisode> {
      if (!list || list.length < 1) return [];
      const filter = (e) => {
        return search.length < 3 ||
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.creator.toLowerCase().includes(search.toLowerCase()) ||
          e.cross_ref?.toLowerCase().includes(search.toLowerCase())
      }
      return list.filter((e) => !e.draft || props.showDrafts).filter(filter).map((e) => {
        const date = new Date(e.pubdate);
        return {
          ...e,
          nuxtlink: '/' + e.slug,
          sortdate: date,
          datestring: dateToString(date,locale.value),
        };
      });
    }

    function sortList(list: Array<IDisplayEpisode>): Array<IDisplayEpisode> {
      return list.sort(
        (a: IDisplayEpisode, b: IDisplayEpisode) =>
          b.sortdate.valueOf() - a.sortdate.valueOf()
      );
    }
    const sortedFilteredList = computed(() => {
      const sortlist = sortList(expandAndFilter(props.episodes, search.value))
      max.value = sortlist.length
      if (itemsperpage.value == 0 || page.value == 0) return sortlist
      return sortlist.filter(pageFilter)
    }
    );
    const toggleSearch = function () {
      searchHiden.value = !searchHiden.value;
      nextTick(() => {
        if (!searchHiden.value) {
          const el = document.getElementById('search')
          if (el)
            el.focus()
        }
      })
    }
    return {
      sortedFilteredList,
      searchHiden,
      toggleSearch,
      search,
      itemsperpage,
      page,
      max,
      localePath,
      ContentFile
    };
  },
};
</script>
