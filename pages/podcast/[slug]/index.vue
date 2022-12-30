<template>
  <div>
    <messge-toast></messge-toast>
    <sub-menu
      v-if="user != null"
      :items="submenu"
      @menuItemClicked="menuItemClicked"
    />
    <div class="w-full flex justify-center">
      <div
        class="mt-6 md:mt-12 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;{{ $t('podcast.title') }}&nbsp;
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
                {{ podcastGenre.parentCategory }} -
                {{ podcastGenre.displaytext }}
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
      <div class="w-full bg-gray-200 flex flex-col items-center">
        <div class="w-11/12 md:w-2/3 flex flex-col justify-center">
          <div
            class="md:pt-14 text-sm md:text-ml tracking-widest font-bold text-gray-500 text-center"
          >
            {{ $t('podcast.inthis') }}
          </div>

          <episodes-list :episodes="episodes" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NUM_ITEMS_PER_PAGE, PODCAST_AP } from '~~/base/Constants';
import { IUser } from '~~/base/types/IUser';
import { useEnumerations } from '~~/composables/enumerationdata';
import { usePodcast, usePodcasts } from '~~/composables/podcastdata';

const user = (await useAuth().useAuthUser()) as any;
const route = useRoute();
const slug = route.params.slug as string;

const { refresh, podcast, episodes } = await usePodcast(slug);
const { enumerations } = await useEnumerations();
const language = ref(enumerations.getLanguage(podcast.value.language_id));
const podcastGenre = ref(enumerations.getGenre(podcast.value.category_id));
const submenu = ref([]);
onBeforeMount(() => {
  refresh();
  submenu.value = [
    {
      id: 0,
      name: 'podcast.edit',
      slug: '/admin/podcast/' + slug,
      layout: 'edit',
    },
    {
      id: 1,
      name: 'episode.add',
      slug: '/admin/podcast/' + slug + '/new-episode',
      layout: 'add',
    },
  ];
  if (user.value && user.value.username.startsWith('admin'))
    submenu.value.push({
      id: 2,
      name: 'delete',
      slug: '#delete',
      layout: 'delete',
    });
});
const router = useRouter();
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {},
  })
);
async function menuItemClicked(value: string) {
  if (value === '#delete') {
    const postData = {
      method: 'delete',
      body: {
        id: podcast.value.id,
        title: podcast.value.title,
      },
    };
    var postResult: Response = await $fetch(PODCAST_AP, postData);

    if (postResult.status == 201) {
      const { refresh } = await usePodcasts();
      await refresh();
      router.push('/podcasts');
    }
  }
}
</script>
