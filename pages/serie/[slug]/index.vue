<template>
  <div>
    <messge-toast></messge-toast>
    <select-podcast-modal v-if="dialog" :error="error" :podcasts="podcasts" @cancel="() => dialog = false"
      @submit="changePodcast"></select-podcast-modal>
    <sub-menu v-if="user != null" :items="submenu" @menuItemClicked="menuItemClicked" />
    <div class="w-full flex justify-center mt-6 md:mt-12 mb-10 md:mb-14 ">
      <BaseH1>
        <div class="text-skin-muted dark:text-skin-muted-dark">{{ $t('serie.episodes') }}</div>
      </BaseH1>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-11/12 md:w-2/3 md:h-60 flex flex-row">
        <img class="relative z-10 h-20 md:h-60 shrink-0" :src="serie.cover_file" />
        <div class="pl-4 md:pl-14 pt-1 pb-10 flex flex-col justify-around rounded-r-md">
          <div>
            <div class="text-md md:text-2xl font-semibold tracking-wider">
              {{ serie.title }}
            </div>
            <div class="text-xs md:text-sm tracking-wide text-skin-muted dark:text-skin-muted-dark">
              {{ serie.subtitle }}
            </div>
          </div>
          <div class="hidden md:inline-flex pt-2 w-full h-12 text-sm break-normal overflow-y-auto">
            {{ serie.description }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-full relative z-0">
      <div class="p-4 w-full absolute -top-8 bg-skin-muted dark:bg-skin-muted-dark flex flex-col items-center"></div>
    </div>
    <BaseContainer>
      <div class="md:pt-14 text-sm md:text-ml tracking-widest font-bold text-center">
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
import { useSerie } from '~~/composables/seriedata';
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
    var postResult: Response = await $fetch(SERIE_AP, postData);
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
      result = await $fetch(EPISODEMOVE_AP, postData);
    }
    dialog.value = false;
  } catch (err) {
    error.value = err.message;
  }
}
</script>
