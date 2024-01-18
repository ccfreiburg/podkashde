<template>
  <div>
    <!-- <messge-toast></messge-toast>
    <select-podcast-modal v-if="dialog" :error="error" :podcasts="podcasts" @cancel="() => dialog = false"
      @submit="changePodcast"></select-podcast-modal>
    <sub-menu v-if="user != null" :items="submenu" @menuItemClicked="menuItemClicked" /> -->
    <div class="flex justify-center w-full mt-6 mb-10 md:mt-12 md:mb-14 ">
      <BaseH1>
        <div class="text-skin-muted dark:text-skin-muted-dark">{{ $t('serie.episodes') }}</div>
      </BaseH1>
    </div>
    <div class="flex flex-col items-center">
      <div class="flex flex-row w-11/12 md:w-2/3 md:h-60">
        <img class="relative z-10 h-20 md:h-60 shrink-0" :src="ContentFile.getMediaUrl(serie.cover_file)" />
        <div class="flex flex-col justify-around pt-1 pb-10 pl-4 md:pl-14 rounded-r-md">
          <div>
            <div class="font-semibold tracking-wider text-md md:text-2xl">
              {{ serie.title }}
            </div>
            <div class="text-xs tracking-wide md:text-sm text-skin-muted dark:text-skin-muted-dark">
              {{ serie.subtitle }}
            </div>
          </div>
          <div class="hidden w-full h-12 pt-2 overflow-y-auto text-sm break-normal md:inline-flex">
            {{ serie.description }}
          </div>
        </div>
      </div>
    </div>
    <div class="relative z-0 w-full">
      <div class="absolute flex flex-col items-center w-full p-4 -top-8 bg-skin-muted dark:bg-skin-muted-dark"></div>
    </div>
    <BaseContainer>
      <div class="text-sm font-bold tracking-widest text-center md:pt-14 md:text-ml">
        {{ $t('serie.inthis') }}
      </div>
      <episodes-list :episodes="episodes" />
      <div class="h-screen"></div>
    </BaseContainer>
  </div>
</template>
<script setup lang="ts">
import {
  EPISODEMOVE_AP,
  NUM_ITEMS_PER_PAGE,
  SERIE_AP,
} from '~~/base/Constants';
import { useEnumerations } from '~~/composables/enumerationdata';
import { ContentFile } from '~~/base/ContentFile'
import { useSerie } from '~~/composables/seriedata';
const { apiBase } = useRuntimeConfig()

const user = await useAuth().useAuthUser();
const route = useRoute();
const router = useRouter();

const slug = route.params.slug as string;
const { refresh, episodes, serie } = await useSerie(slug);
const { podcasts } = await usePodcasts();
const submenu = ref([]);
onBeforeMount(() => {
  refresh();
  submenu.value = [
    {
      id: 0,
      name: 'serie.edit',
      slug: '/admin/serie/' + slug,
      layout: 'edit',
    },
    {
      id: 1,
      name: 'delete',
      slug: '#delete',
      layout: 'delete',
    },
  ];
  if (user.value && user.value.username.startsWith('admin'))
    submenu.value.push({
      id: 2,
      name: 'podcast.change',
      slug: '#change',
      layout: 'change',
    });
});
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {},
  })
);

const dialog = ref(false);
async function menuItemClicked(value: string) {
  if (value === '#delete') {
    const postData = {
      method: 'delete',
      body: {
        id: serie.value.id,
        title: serie.value.title,
      },
    };
    var postResult: Response = await $fetch( apiBase + SERIE_AP, postData);
    if (postResult.status == 201) {
      refresh()
      router.go(-1)
    }
  } else if (value === '#change') {
    dialog.value = !dialog.value;
  }
}
const error = ref('')
async function changePodcast(podcastid) {
  const podcast = podcasts.value.find((p) => p.id == podcastid);
  var result;
  try {
    for (const idx in episodes.value) {
      const postData = {
        method: 'post',
        body: {
          episode: episodes.value[idx],
          podcast,
          serie: serie.value,
        },
      };
      result = await $fetch( apiBase + EPISODEMOVE_AP, postData);
    }
    dialog.value = false;
  } catch (err) {
    error.value = err.message;
  }
}
</script>
