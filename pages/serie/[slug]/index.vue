<template>
  <div>
    <PageLayout :title="$t('serie.episodes')" :submenu="submenu" @menuItemClicked="menuItemClicked">

    <SelectPodcastModal v-if="dialog" :error="error" :podcasts="podcasts" @cancel="() => dialog = false"
      @submit="changePodcast"></SelectPodcastModal>

    <div v-if="serie" class="flex flex-col items-center">
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
      <episodes-list v-if="episodes" :episodes="episodes" />
      <div class="h-screen"></div>
    </BaseContainer>
    </PageLayout>
  </div>
</template>
<script setup lang="ts">
import {
  EPISODEMOVE_AP,
  SERIE_AP,
} from '~~/base/Constants';
import { ContentFile } from '~~/base/ContentFile'

const {user} = useAuth();
const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;
const { refresh, remove, episodes, serie, loading } = useSerie(slug);

const { podcasts, loading: podcastLoading } = usePodcasts();
const submenu = ref([] as Array<any>);
const myFetch = useFetchApi();

const {on_mounted, on_before} = useMounted(refresh, user, false)
onMounted( on_mounted )
onBeforeMount( on_before )

const doneLoading = () => {
  if (!podcastLoading.value && !loading.value) {
    if (!serie.value || Object.keys(serie.value).length === 0) {
      router.push({ path: "/podcasts", query: {refresh: 'true', msg: 'serie.notfound' }})
    } else {
      router.replace({
        ...router.currentRoute,
        query: {},
      })
    }
  }
}
doneLoading()
watch( [podcastLoading, loading], doneLoading)

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

const dialog = ref(false);

async function menuItemClicked(value: string) {
  if (value=="#delete") {
      remove().then(() => router.push('/series?refresh=true'))
  } else if (value === '#change') {
    dialog.value = !dialog.value;
  }
}

const error = ref('')
async function changePodcast(podcastid: number) {
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
      result = await myFetch( EPISODEMOVE_AP, postData);
    }
    dialog.value = false;
  } catch (err: any) {
    error.value = err.message;
  }
}
</script>
