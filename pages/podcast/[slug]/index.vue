<template>
  <div>
    <PageLayout :title="$t('podcast.title')" :submenu="submenu" @menuItemClicked="menuItemClicked">
    <div class="flex flex-col items-center">
      <div class="flex flex-row w-11/12 md:w-2/3 md:h-60">
        <img class="relative z-10 h-20 md:h-60 shrink-0" :src="ContentFile.getMediaUrl(podcast.cover_file)" />
        <div class="flex flex-col justify-around pt-1 pb-10 pl-4 md:pl-14 rounded-r-md">
          <div>
            <div class="font-semibold tracking-wider text-md md:text-2xl">
              {{ podcast.title }}
            </div>
            <div class="text-xs tracking-wide text-gray-500 md:text-sm">
              {{ podcast.subtitle }}
            </div>
          </div>
          <div class="text-xs md:text-sm">{{ podcast.author }}</div>
          <div class="hidden w-full h-12 pt-2 overflow-y-auto text-sm break-normal md:inline-flex">
            {{ podcast.summary }}
          </div>
          <div class="hidden md:inline-flex">
            <div class="flex flex-row flex-wrap">
              <div
                class="px-1 my-1 mr-1 text-xs font-bold rounded-md text-skin-inverted bg-gradient-to-r from-skin-from via-skin-via to-skin-to whitespace-nowrap">
                {{ podcastGenre.parentCategory }} -
                {{ podcastGenre.displaytext }}
              </div>
              <div v-if="podcast.explicit"
                class="px-1 m-1 text-xs font-bold rounded-md text-skin-inverted bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
                explicit
              </div>
              <div
                class="px-1 m-1 text-xs font-bold rounded-md text-skin-inverted bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
                {{ language.displaytext }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="relative z-0 w-full">
        <div class="absolute flex flex-col items-center w-full p-4 -top-8 bg-skin-muted dark:bg-skin-muted-dark"></div>
      </div>
      <BaseContainer>
        <div class="text-sm font-bold tracking-widest text-center md:pt-14 md:text-ml">
          {{ $t('podcast.inthis') }}
        </div>

        <EpisodesList :episodes="episodes" />
        <div class="h-screen"></div>
      </BaseContainer>
    </div>
    </PageLayout>
  </div>
</template>
<script setup lang="ts">
import { NUM_ITEMS_PER_PAGE, PODCAST_AP } from '~~/base/Constants';
import type { IUser } from '~~/base/types/IUser';
import { useEnumerations } from '~~/composables/enumerationdata';
import { usePodcast, usePodcasts } from '~~/composables/podcastdata';
import { ContentFile } from '~~/base/ContentFile'
const { apiBase } = useRuntimeConfig().public


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
onMounted(() => {
  if (!podcast.value || Object.keys(podcast.value).length === 0)
    router.push({ path: "/podcasts", query: {refresh: 'true', msg: 'podcast.notfound' }})
  else

  router.replace({
    ...router.currentRoute,
    query: {},
  })
})

async function menuItemClicked(value: string) {
  if (value === '#delete') {
    const postData = {
      method: 'DELETE',
      body: {
        id: podcast.value.id,
        title: podcast.value.title,
      },
    };
    var postResult: Response = await useFetchApi()( apiBase + PODCAST_AP, postData);

    if (postResult.statusCode == 201) {
      const { refresh } = await usePodcasts();
      await refresh();
      router.push('/podcasts');
    }
  }
}
</script>
