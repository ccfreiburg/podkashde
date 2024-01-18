<template>
  <div>
    <!-- <messge-toast></messge-toast>
    <sub-menu v-if="user != null" :items="submenu" /> -->
    <div class="mt-4 md:mt-6 mb-10 md:mb-14 w-full flex justify-center">
      <BaseH1>
        {{ $t('serie.title') }}
      </BaseH1>
    </div>
    <BaseContainer>
      <div v-if="series?.length > 0" class="flex place-items-end place-content-end px-1 md:px-4">
        <div v-if="!searchHiden" class="flex flex-row flex-nowrap items-center">
          <input-area class="pb-8" :name="'search'" label="" v-model:value="search" />
          <div @click="
            () => {
              search = '';
              searchHiden = true;
            }
          ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <div v-else @click="searchHiden = !searchHiden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>
      <div v-for="serie in currentPage" :key="serie.id">
        <NuxtLink :to="localePath('/serie/' + serie.slug)">
          <div
            class="mt-4 p-4 bg-skin-light dark:bg-skin-dark flex flex-col sm:flex-row flex-wrap sm:flex-nowrap items-center sm:place-content-center">
            <img class="w-32 h-32" :src="ContentFile.getMediaUrl(serie.cover_file)" />
            <div class="sm:pl-12 py-2 flex-grow flex flex-col items-center justify-around sm:items-start">
              <div class="text-center sm:text-start">
                <div class="text-xs sm:text-xl sm:pb-2 font-semibold tracking-wider">
                  {{ serie.title }}
                </div>
                <div class="text-xs sm:text-sm sm:pb-4 tracking-wide break-words">
                  {{ serie.subtitle }}
                </div>
              </div>
              <div
                class="grow-0 text-xs underline md:text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
                {{ $t('serie.tothepisodes') }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
      <list-paginator :max="max" v-model:value="page" :itemsperpage="pagesize" />
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { NUM_ITEMS_PER_PAGE } from '~~/base/Constants';
import { ContentFile } from '~~/base/ContentFile'
import ISerie from '~~/base/types/ISerie';
import { useSeries } from '~~/composables/seriedata';
const pagesize = ref(4);
const page = ref(1);
const max = ref(1);
const search = ref('');
const searchHiden = ref(true);
const { refresh, series } = await useSeries();
const route = useRoute();
const router = useRouter();
const user = (await useAuth().useAuthUser()) as any;
const localePath = useLocalePath();

function sorter(a: ISerie, b: ISerie): number {
  return (
    (b.lastEpisode ? new Date(b.lastEpisode).getTime() : 0) -
    (a.lastEpisode ? new Date(a.lastEpisode).getTime() : 0)
  );
}
const seriesSortedFiltered = computed(() => {
  const list = series.value
    .filter((s) => !s.draft || user.value)
    .filter(
      (item) =>
        search.value.length < 3 ||
        item.title.toLowerCase().includes(search.value.toLowerCase())
    )
    .sort(sorter);
  max.value = list.length;
  return list;
});
const currentPage = computed(() => {
  return seriesSortedFiltered.value.filter((e, index) => {
    const start = (page.value - 1) * pagesize.value - 1;
    const end = start + pagesize.value;
    return index > start && index <= end;
  });
});
onBeforeMount(() => {
  if (route.query.refresh) refresh();
});
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {},
  })
);
const submenu = [
  {
    id: 0,
    name: 'serie.new',
    slug: '/admin/new-serie',
    layout: 'add',
  },
];
</script>
