<template>
  <div class="text-xs md:text-base w-full flex flex-col">
    <div
      class="flex flex-col"
      v-for="(episode, index) in sortedFilteredList"
      :key="index"
    >
      <NuxtLink :to="episode.nuxtlink">
        <div class="my-1 px-1 md:px-4 py-2 hover:bg-slate-100 md:rounded-xl flex flex-row place-items-center">
          <div class="w-2/12">
            <img class="max-w-20 max-h-20" :src="episode.image" />
          </div>
          <div class="w-5/12 pl-2 md:pl-8" v-html="episode.title" />
          <div class="w-3/12">{{episode.creator}}</div>
          <div class="w-2/12">{{ episode.datestring }}</div>
          <div class="w-1/12 flex justify-end">
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
  </div>
</template>

<script lang="ts">
import { tSImportType } from '@babel/types';
import { PropType } from 'vue';
import IEpisode from '~~/base/types/IEpisode';

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
  setup(props) {
    const dateformat = (input: Date): string => input.toLocaleDateString();

    function expandAndFilter(list: Array<IEpisode>): Array<IDisplayEpisode> {
      if (!list || list.length < 1) return [];
      const filter = (e) => true;
      return list.filter(filter).map((e) => {
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
    const sortedFilteredList = computed(() =>
      sortList(expandAndFilter(props.episodes))
    );
    return {
      sortedFilteredList,
    };
  },
};
</script>
