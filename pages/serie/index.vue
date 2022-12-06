<template>
<div>
  <messge-toast></messge-toast>
<div class="w-full flex justify-center">
        <div
          class="mt-6 md:mt-10 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
        >&nbsp;Series&nbsp;
        </div>
  </div>
  <div class="w-full h-screen bg-gray-200 flex justify-center">

    <div class="py-6 md:py-10 w-5/6 md:w-2/3 md:h-60 flex flex-col">
      <div v-if="series?.length>0" class="flex place-items-end place-content-end px-1 md:px-4 text-gray-800">
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
        <div v-for="serie in currentPage" :key="serie.id">
          <NuxtLink :to="'/serie/' + serie.slug">
            <div class="mt-4 p-4 bg-white flex flex-row">
              <img class="w-32 h-32" :src="serie.cover_file" />
              <div
                class="pl-6 md:pl-12 py-2 flex flex-col justify-around items-start rounded-r-md"
              >
              <div>
                <div class="text-md md:text-xl font-semibold tracking-wider">
                  {{ serie.title }}
                </div>
                <div class="text-xs md:text-sm tracking-wide text-gray-500">
                  {{ serie.subtitle }}
                </div>
              </div>
              <div class="grow-0 text-xs underline md:text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700"
        >To the episodes...</div>
              </div>
            </div>
          </NuxtLink>
        </div>
      <list-paginator :max="max" v-model:value="page" :itemsperpage="pagesize"/>

      </div>   
    </div>
  </div>
</template>

<script setup lang="ts">
import { NUM_ITEMS_PER_PAGE } from '~~/base/Constants';
import ISerie from '~~/base/types/ISerie';
import { useSeries } from '~~/composables/seriedata';
const pagesize = ref(4)
const page = ref(1)
const max = ref(1)
const search = ref("")
const searchHiden = ref(true)
const { refresh, series } = await useSeries();
const route = useRoute();
const router = useRouter();

function sorter( a: ISerie, b: ISerie ) : number{
  return (b.lastEpisode?new Date(b.lastEpisode).getTime():0)-(a.lastEpisode?new Date(a.lastEpisode).getTime():0)

}
const seriesSortedFiltered = computed( () => {
  const list = series.value.filter( 
    (item) =>
      (search.value.length<3 ||
      item.title.includes(search.value))
  ).sort(sorter)
  max.value=list.length
  return list
})
const currentPage = computed( () => {
  return seriesSortedFiltered.value.filter((e, index)=>{
    const start = (page.value-1)*pagesize.value-1
    const end = start + pagesize.value
    return index>start && index<=end
  })
})
onBeforeMount( () => {
  if (route.query.refresh) refresh();
})
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
</script>
