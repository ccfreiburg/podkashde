<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="w-5/6 md:w-2/3 flex flex-row justify-end">
        <NuxtLink
          class="text-orange-500 text-xs"
          v-if="user"
          :to="'/admin/' + slug"
        >
          {{ $t('episode.edit_short') }}
        </NuxtLink>
        <div v-else class="pt-4 md:pt-14"></div>
      </div>
      <div class="w-5/6 md:w-2/3 md:h-60 flex flex-row">
        <img class="h-28 md:h-60 w-28 md:w-60 shrink-0" :src="episode.image" />
        <div
          class="pl-6 md:pl-12 pt-2 pb-8 flex flex-col justify-around items-start rounded-r-md"
        >
          <div
            class="text-xs md:text-sm tracking-wide uppercase bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 font-bold"
          >
            {{ serie.title }}
          </div>
          <div class="flex flex-col">
            <div class="text-md md:text-2xl font-semibold tracking-wider">
              {{ episode.title }}
            </div>
            <div class="text-xs md:text-sm tracking-wide text-gray-500">
              {{ episode.subtitle }}
            </div>
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
          class="text-white bg-black"
          :file="episode.link"
        ></audio-player>
      </div>
      <div class="h-4 w-screen bg-black"></div>
      <div class="h-screen w-screen bg-gray-200 flex flex-col items-center">
        <div class="md:w-2/3 pt-6">
          <div class="flex flex-row">
            <div class="w-28 md:w-60 shrink-0">
              <div class="text-gray-400">{{ $t('episode.episode') }}</div>
              <div class="pt-6 text-gray-400">
                {{ $t('episode.label.description') }}
              </div>
            </div>
            <div class="pl-12 grow-0">
              <div class="flex flex-row flex-grow justify-between">
                <div class="text-sm">
                  {{ $t('episode.label.duration') + ' ' + duration() }}
                </div>
                <div class="text-sm mx-3">
                  {{
                    $t('episode.label.pubdate') +
                    ' ' +
                    new Date(episode.pubdate).toLocaleDateString()
                  }}
                </div>
                <div class="text-sm">
                  {{
                    $t('episode.label.filesize') +
                    ' ' +
                    (episode.rawsize / (1024 * 1024)).toFixed(2)
                  }}MB
                </div>
              </div>
              <div class="pt-6 text-sm break-normal">
                {{ episode.summary }}
              </div>
              <div
                class="text-sm mt-10 flex-grow"
                v-html="episode.description"
              ></div>
            </div>
          </div>
          <div class="text-sm">
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
  </div>
</template>
<script setup lang="ts">
import { durationInSecToStr } from '~~/base/Converters';
import { useEpisode } from '~~/composables/episodedata';
const route = useRoute();
const slug = route.params.episodeslug as string;
const showdetail = ref(false);
const { refresh, serie, podcast, episode } = await useEpisode(slug);
if (route.query.refresh) refresh();
const user = await useUser();
const duration = () => durationInSecToStr(episode.value.duration);
</script>
