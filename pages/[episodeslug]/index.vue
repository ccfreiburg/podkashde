<template>
  <div>
    <PageLayout :title="$t('episode.episode')" :submenu="submenu" @menuItemClicked="menuItemClicked">
    <div class="flex flex-col items-center ">
      <div class="relative z-20 flex flex-row w-11/12 mt-6 lg:w-4/5 md:h-60 md:mt-12">
        <img class="h-28 md:h-60 w-28 md:w-60 shrink-0" :src="ContentFile.getMediaUrl(episode.image)" />
        <div class="flex flex-col items-start justify-around pt-2 pb-8 pl-6 md:pl-12 rounded-r-md">
          <div>
            <div
              class="text-xs font-bold tracking-wide text-transparent uppercase grow-0 md:text-sm bg-clip-text bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
              <NuxtLink :to="('/serie/' + serie?.slug)">
                {{ serie?.title }}
              </NuxtLink>
            </div>
            <div class="text-xs md:text-sm text-skin-muted dark:text-skin-muted-dark">
              <NuxtLink :to="('/podcast/' + podcast?.slug)">
                {{ podcast?.title }}
              </NuxtLink>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm font-semibold tracking-wider md:text-xl" v-html="episode.title" />
            <div class="text-xs tracking-wide md:text-sm text-skin-muted dark:text-skin-muted-dark"
              v-html="episode.subtitle" />
          </div>
          <div class="text-xs tracking-wider md:text-sm">
            {{ episode.creator }}
          </div>
          <div class="flex flex-row flex-wrap">
            <div v-if="episode.explicit"
              class="px-2 m-1 text-xs font-bold rounded-md text-skin-inverted bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
              {{ $t('episode.explicit') }}
            </div>
            <div v-if="episode.block"
              class="px-2 m-1 text-xs font-bold rounded-md text-skin-inverted bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
              {{ $t('episode.blocked') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative flex flex-row w-full -z-0">
      <div class="absolute w-screen h-40 -top-4 md:-top-8 bg-skin-player"></div>
    </div>
    <div class="relative z-10 flex flex-col items-center">
      <div class="w-11/12 pt-6 lg:w-4/5">
        <AudioPlayer :key="audioComponentKey" class="bg-skin-player text-skin-inverted" :file="ContentFile.getMediaUrl(link)" @play="play"></AudioPlayer>
      </div>
    </div>
    <div class="w-screen h-4 bg-skin-light"></div>

    <BaseContainer class="px-2 text-skin-base dark:text-skin-dark">
      <div class="text-skin-muted">{{ $t('episode.episode') }}</div>
      <div class="flex flex-row justify-between">
        <div class="flex flex-row flex-wrap">
          {{ $t('episode.label.duration') + ' ' + duration() }}
        </div>
        <div class="flex flex-row flex-wrap mx-3">
          {{
            $t('episode.label.pubdate') +
            ' ' +
            dateToString(new Date(episode.pubdate), locale)
          }}
        </div>
        <div class="flex flex-row flex-wrap">
          {{
            $t('episode.label.filesize') +
            ' ' +
            (episode.rawsize / (1024 * 1024)).toFixed(2)
          }}MB
        </div>
      </div>
      <div class="pt-6 text-skin-muted">
        {{ $t('episode.label.description') }}
      </div>
      <div v-if="episode.description != null" v-html="episode.description" />
      <div v-if="episode.summary != null" class="pt-2 break-normal" v-html="episode.summary"></div>
      <div v-if="user != null" class="pt-10">
        <div class="text-skin-accent" @click="showdetail = !showdetail">
          {{ showdetail ? 'less details' : 'more details' }}
        </div>
        <div v-if="showdetail">
          <table class="border-separate border-spacing-3">
            <thead>
              <tr>
                <th class="bg-skin-button-accent text-skin-inverted">Label</th>
                <th class="bg-skin-button-accent text-skin-inverted">Value</th>
              </tr>
            </thead>
            <tbody class="text-skin-muted dark:text-skin-muted-dark">
              <tr v-for="(objectkey, index) in Object.keys(episode)" :key="index">
                <td>{{ objectkey }}</td>
                <td>
                  <div v-if="episode[objectkey]">
                    {{
                      ['podcast', 'serie'].includes(objectkey)
                      ? episode[objectkey].title
                      : episode[objectkey]
                    }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="h-screen"></div>
    </BaseContainer>
    </PageLayout>
  </div>
</template>
<script setup lang="ts">
import { EPISODEMOVE_AP, EPISODE_AP } from '~~/base/Constants';
import { durationInSecToStr } from '~~/base/Converters';
import { useEpisode } from '~~/composables/episodedata';
import { dateToString } from '~~/base/Converters'
import { ContentFile } from '~/base/ContentFile';

const route = useRoute();
const router = useRouter();
const user = await useAuth().useAuthUser();
const myFetch = useFetchApi()
const { locale } = useI18n();

const slug = route.params.episodeslug as string;
const showdetail = ref(false);

const { podcasts } = await usePodcasts();
const { refresh, serie, podcast, remove, episode } = await useEpisode(slug);
const link = ref(episode.value?.link)
const submenu = ref([])

onBeforeMount(() => {
  refresh();
  submenu.value = [
    {
      id: 0,
      name: 'episode.edit',
      slug: '/admin/' + slug,
      layout: 'edit',
    },
    {
      id: 1,
      name: 'delete',
      slug: '#delete',
      layout: 'delete',
    },
  ] as Array<{id: number, name: string, slug: string, layout: string}>;
  if (user.value && user.value.username.startsWith('admin'))
    submenu.value.push({
      id: 2,
      name: 'podcast.change',
      slug: '#change',
      layout: 'change',
    });
});

onMounted(() => {
  if (!episode.value || Object.keys(episode.value).length === 0)
    router.push({ path: "/", query: {refresh: 'true', msg: 'episode.notfound' }})
  else
    router.replace({
      ...router.currentRoute,
      query: {},
    })
})

const duration = () => durationInSecToStr(episode.value.duration);

const dialog = ref(false);
const error = ref("")

async function menuItemClicked(value: string) {
  if (value === '#delete') {
    const request: IPostdata = {
      method: 'DELETE',
      body: {
        id: episode.value.id,
      },
    };
    const result = await myFetch( EPISODE_AP, request);
    if (result.resutlCode="201") {
    var url = router.options.history.state.back as string;
    if (url.includes('?')) url = url.substring(0, url.indexOf('?'));
    router.push({
      path: url,
      query: { refresh: 'true', msg: 'episode.deleted' },
    });
  }
  } else if (value === '#change') {
    dialog.value = !dialog.value
  }
}
const audioComponentKey = ref(0)
async function changePodcast(podcastid: number) {
  const newpodcast = podcasts.value.find((p) => p.id == podcastid);
  var result;
  try {
    const postData = {
      method: 'post',
      body: {
        episode: episode.value,
        podcast: newpodcast,
        serie: serie.value,
      },
    };
    result = await myFetch( EPISODEMOVE_AP, postData);
    await refresh()
    link.value = episode.value.link
    audioComponentKey.value++
    dialog.value = false;
  } catch (err) {
    error.value = err.message;
  }
}
function play() {
  const { $umami } = useNuxtApp();
  $umami("Playing " + episode.value.title)
}
</script>
