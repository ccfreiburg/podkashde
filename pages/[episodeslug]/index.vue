<template>
  <div>
    <PageLayout  v-if="episode" :title="$t('episode.episode')" :submenu="submenu" @menuItemClicked="menuItemClicked">
    <select-podcast-modal v-if="dialog" :error="error" :podcasts="podcasts" @cancel="() => dialog = false"
      @submit="changePodcast"></select-podcast-modal>
    <BaseContainerClean class="flex flex-col items-center ">
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
  </BaseContainerClean>
    <div class="relative flex flex-row w-full -z-0">
      <div class="absolute w-screen h-40 -top-4 md:-top-8 bg-skin-player"></div>
    </div>
    <div class="relative z-10 flex flex-col items-center">
    <BaseContainerClean>
      <div class="w-full pt-8">
        <AudioPlayer :key="audioComponentKey" class="bg-skin-player text-skin-inverted" :file="ContentFile.getMediaUrl(episode.link)" @play="play"></AudioPlayer>
      </div>
    </BaseContainerClean>
    </div>
    <div class="w-screen h-14 md:h-10"></div>

    <BaseContainerClean class="bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark">
      <div class="text-skin-muted">{{ $t('episode.episode') }}</div>
      <div class="flex flex-col justify-between sm:flex-row ">
        <div class="flex flex-row flex-wrap">
          {{ $t('episode.label.duration') + ' ' + duration() }}
        </div>
        <div class="flex flex-row flex-wrap sm:mx-3">
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
    </BaseContainerClean>

      <BaseContainerClean v-if="user != null" class="pt-10 bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark">
        <div class="text-skin-accent dark:text-skin-dark" @click="showdetail = !showdetail">
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
      </BaseContainerClean>
    </PageLayout>
  </div>
</template>
<script setup lang="ts">
import { EPISODEMOVE_AP, EPISODE_AP } from '~~/base/Constants';
import { durationInSecToStr } from '~~/base/Converters';
import { dateToString } from '~~/base/Converters'
import { ContentFile } from '~/base/ContentFile';

const route = useRoute();
const router = useRouter();

const slug = route.params.episodeslug as string;
const showdetail = ref(false);

const { podcasts, loading: podcastLoading } = usePodcasts();
const { refresh, remove, serie, podcast, episode, loading } = useEpisode(slug);

const {user, isSuperAdmin} = useAuth()
const {on_mounted, on_before} = useMounted(refresh, user, false)
onMounted( on_mounted )
onBeforeMount( on_before )

const { locale } = useI18n()

watch( [podcastLoading, loading], () => {
  if (!loading && !episode.value || episode.value && Object.keys(episode.value as Object).length === 0)
     router.push({ path: "/", query: {refresh: 'true', msg: 'episode.notfound' }})
})

const submenu = ref([
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
      }
    ] as Array<{id: number, name: string, slug: string, layout: string}>
  );
  if (isSuperAdmin())
    submenu.value.push({
      id: 2,
      name: 'podcast.change',
      slug: '#change',
      layout: 'change',
    });

const duration = () => durationInSecToStr(episode.value.duration);

const dialog = ref(false);
const error = ref("")

async function menuItemClicked(value: string) {
  if (value === '#delete') {
    const {generate} = useRss(podcast.value?.slug || '')
    await remove()
    if (!episode.value) {
      generate()
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
  const {generate: genOldPodcastRss} = useRss(podcast.value?.slug || '')
  const myFetch = useFetchApi()
  const newpodcast = podcasts.value.find((p) => p.id == podcastid) as any;
  const {generate: genNewPodcastRss} = useRss(newpodcast.slug)
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
    genNewPodcastRss()
    genOldPodcastRss()
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
