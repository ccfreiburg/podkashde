<template>
  <div>
  <messge-toast></messge-toast>
    <sub-menu v-if="user != null" :items="submenu" @menuItemClicked="menuItemClicked"/>
    <div class="w-full flex justify-center">
      <div
        class="mt-6 md:mt-12 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;Series Episodes&nbsp;
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-11/12 md:w-2/3 md:h-60 flex flex-row">
        <img class="h-20 md:h-60 shrink-0" :src="serie.cover_file" />
        <div
          class="pl-4 md:pl-14 pt-1 pb-10 flex flex-col justify-around rounded-r-md"
        >
          <div>
            <div class="text-md md:text-2xl font-semibold tracking-wider">
              {{ serie.title }}
            </div>
            <div class="text-xs md:text-sm tracking-wide text-gray-500">
              {{ serie.subtitle }}
            </div>
          </div>
          <div
            class="hidden md:inline-flex pt-2 w-full h-12 text-sm break-normal overflow-y-auto"
          >
            {{ serie.description }}
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
          {{ $t('serie.inthis') }}
          </div>
          <episodes-list :episodes="episodes"/>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
import { NUM_ITEMS_PER_PAGE, SERIE_AP } from '~~/base/Constants';
import { useEnumerations } from '~~/composables/enumerationdata';
import { useSerie } from '~~/composables/seriedata';
const user = await useAuth().useAuthUser();
const route = useRoute();
const router = useRouter();

const slug = route.params.slug as string
const { refresh, episodes, serie } = await useSerie(slug)
onBeforeMount( () => {
  if (route.query.refresh) refresh();
})
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
const submenu = [
{
    id: 0,
    name: "serie.edit",
    slug: "/admin/serie/"+slug,
    layout: "edit"
  },
  {
    id: 1,
    name: "delete",
    slug: "#delete",
    layout: "delete"
  }
]
async function menuItemClicked(value: string) {
  if (value === "#delete") {
    const postData = {
        method: "delete",
        body: {
          id: serie.value.id,
          title: serie.value.title,
        },
      };
      var postResult: Response = await $fetch(SERIE_AP, postData);
      if (postResult.status == 201) {
        router.go(-1)
      }
  }
}


</script>