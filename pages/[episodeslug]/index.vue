<template>
  <div>
    <messge-toast></messge-toast>
    <select-podcast-modal v-if="dialog" :error="error" :podcasts="podcasts" @cancel="() => dialog=false" @submit="changePodcast"></select-podcast-modal>
    <sub-menu
      v-if="user != null"
      :items="submenu"
      @menuItemClicked="menuItemClicked"
    />
    <div class="flex flex-col items-center">
      <div class="w-5/6 md:w-2/3 md:h-60 mt-6 md:mt-12 flex flex-row">
        <img class="h-28 md:h-60 w-28 md:w-60 shrink-0" :src="episode.image" />
        <div
          class="pl-6 md:pl-12 pt-2 pb-8 flex flex-col justify-around items-start rounded-r-md"
        >
        <div>
        <div
            class="text-sm md:text-md tracking-wide uppercase bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 font-bold"
          >
            <NuxtLink :to="('/serie/'+serie?.slug)">
              {{ serie?.title }} 
            </NuxtLink>
          </div>
          <div
            class="text-xs md:text-sm text-gray-400"
          >
            <NuxtLink :to="('/podcast/'+podcast?.slug)">
              {{ podcast?.title }} 
            </NuxtLink>
          </div>
        </div>
          <div class="flex flex-col">
            <div
              class="text-md md:text-2xl font-semibold tracking-wider"
              v-html="episode.title"
            />
            <div
              class="text-xs md:text-sm tracking-wide text-gray-400"
              v-html="episode.subtitle"
            />
          </div>
          <div class="text-xs md:text-sm tracking-wider">
            {{ episode.creator }}
          </div>
          <div class="flex flex-row flex-wrap">
            <div
              v-if="episode.explicit"
              class="text-xs text-white font-bold rounded-md bg-orange-900 px-1 m-1"
            >
              {{ $t('episode.explicit') }}
            </div>
            <div
              v-if="episode.block"
              class="text-xs text-white font-bold rounded-md bg-orange-900 px-1 m-1"
            >
              {{ $t('episode.blocked') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full relative flex flex-row">
      <div class="w-screen h-40 absolute -top-4 md:-top-8 bg-black -z-10"></div>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-5/6 md:w-2/3 pt-6">
        <audio-player
          :key="audioComponentKey"
          class="text-white bg-black"
          :file="link"
          @play="play"
        ></audio-player>
      </div>
    </div>
    <div class="h-4 w-screen bg-black"></div>
    <div class="h-screen w-screen bg-gray-200 flex justify-center">
      <div class="text-xs sm:text-sm flex flex-col w-5/6 md:w-2/3 pt-6">
        <div class="text-gray-400">{{ $t('episode.episode') }}</div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-row flex-wrap">
            {{ $t('episode.label.duration') + ' ' + duration() }}
          </div>
          <div class="mx-3 flex flex-row flex-wrap">
            {{
              $t('episode.label.pubdate') +
              ' ' +
              new Date(episode.pubdate).toLocaleDateString()
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
        <div class="pt-6 text-gray-400">
          {{ $t('episode.label.description') }}
        </div>
        <div
          v-if="episode.description != null"
          v-html="episode.description"
        />
        <div
          v-if="episode.summary != null"
          class="pt-2 break-normal"
          v-html="episode.summary"
        ></div>
        <div v-if="user != null" class="pt-10">
          <div class="text-orange-600" @click="showdetail = !showdetail">
            {{ showdetail ? 'less details' : 'more details' }}
          </div>
          <div v-if="showdetail">
            <table class="border-separate border-spacing-3">
              <thead>
                <tr>
                  <th class="bg-orange-200">Label</th>
                  <th class="bg-orange-200">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(objectkey, index) in Object.keys(episode)"
                  :key="index"
                >
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
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { EPISODEMOVE_AP, EPISODE_AP } from '~~/base/Constants';
import { durationInSecToStr } from '~~/base/Converters';
import { useEpisode } from '~~/composables/episodedata';

const route = useRoute();
const router = useRouter();
const user = await useAuth().useAuthUser();

const showdetail = ref(false);
const slug = route.params.episodeslug as string;
const { refresh, serie, podcast, remove, episode } = await useEpisode(slug);
const { podcasts } = await usePodcasts();
const link = ref(episode.value.link)
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
    await $fetch(EPISODE_AP, request);
    (await useEpisodes()).refresh();
    var url = router.options.history.state.back as string;
    if (url.includes('?')) url = url.substring(0, url.indexOf('?'));
    router.push({
      path: url,
      query: { refresh: 'true', msg: 'episode.deleted' },
    });
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
    result = await $fetch(EPISODEMOVE_AP, postData);
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
