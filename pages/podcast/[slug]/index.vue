<template>
  <div>
    <!-- <messge-toast></messge-toast>
    <sub-menu v-if="user != null" :items="submenu" @menuItemClicked="menuItemClicked" /> -->
    <div class="w-full mt-6 md:mt-12 mb-10 md:mb-14 flex justify-center">
      <BaseH1>
        {{ $t('podcast.title') }}
      </BaseH1>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-11/12 md:w-2/3 md:h-60 flex flex-row">
        <img class="relative z-10 h-20 md:h-60 shrink-0" :src="ContentFile.getMediaUrl(podcast.cover_file)" />
        <div class="pl-4 md:pl-14 pt-1 pb-10 flex flex-col justify-around rounded-r-md">
          <div>
            <div class="text-md md:text-2xl font-semibold tracking-wider">
              {{ podcast.title }}
            </div>
            <div class="text-xs md:text-sm tracking-wide text-gray-500">
              {{ podcast.subtitle }}
            </div>
          </div>
          <div class="text-xs md:text-sm">{{ podcast.author }}</div>
          <div class="hidden md:inline-flex pt-2 w-full h-12 text-sm break-normal overflow-y-auto">
            {{ podcast.summary }}
          </div>
          <div class="hidden md:inline-flex">
            <div class="flex flex-row flex-wrap">
              <div
                class="text-xs text-skin-inverted font-bold rounded-md bg-gradient-to-r from-skin-from via-skin-via to-skin-to px-1 my-1 mr-1 whitespace-nowrap">
                {{ podcastGenre.parentCategory }} -
                {{ podcastGenre.displaytext }}
              </div>
              <div v-if="podcast.explicit"
                class="text-xs text-skin-inverted font-bold rounded-md bg-gradient-to-r from-skin-from via-skin-via to-skin-to px-1 m-1">
                explicit
              </div>
              <div
                class="text-xs text-skin-inverted font-bold rounded-md bg-gradient-to-r from-skin-from via-skin-via to-skin-to px-1 m-1">
                {{ language.displaytext }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full relative z-0">
        <div class="p-4 w-full absolute -top-8 bg-skin-muted dark:bg-skin-muted-dark flex flex-col items-center"></div>
      </div>
      <BaseContainer>
        <div class="md:pt-14 text-sm md:text-ml tracking-widest font-bold text-center">
          {{ $t('podcast.inthis') }}
        </div>

        <EpisodesList :episodes="episodes" />
        <div class="h-screen"></div>
      </BaseContainer>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NUM_ITEMS_PER_PAGE, PODCAST_AP } from '~~/base/Constants';
import type { IUser } from '~~/base/types/IUser';
import { useEnumerations } from '~~/composables/enumerationdata';
import { usePodcast, usePodcasts } from '~~/composables/podcastdata';
import { ContentFile } from '~~/base/ContentFile'


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
    var postResult: Response = await $fetch( API_BASE + PODCAST_AP, postData);

    if (postResult.status == 201) {
      const { refresh } = await usePodcasts();
      await refresh();
      router.push('/podcasts');
    }
  }
}
</script>
