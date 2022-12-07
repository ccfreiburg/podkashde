<template>
  <div>
    <messge-toast></messge-toast>

    <div class="w-full flex justify-center">
      <div
        class="mt-6 md:mt-10 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;{{ $t('podcast.headline') }}&nbsp;
      </div>
    </div>
    <div class="w-full h-screen bg-gray-200 flex justify-center">
      <div class="pt-6 md:pt-10 w-5/6 md:w-2/3 md:h-60 flex flex-col">
        <div v-for="podcast in sortedPodcasts" :key="podcast.id">
          <div class="mt-4 p-4 bg-white flex flex-row">
            <NuxtLink :to="'/podcast/' + podcast.slug">
              <img class="w-32 h-32" :src="podcast.cover_file" />
            </NuxtLink>
            <div
              class="pl-6 md:pl-12 py-2 flex-grow flex flex-col justify-around items-start rounded-r-md"
            >
              <NuxtLink :to="'/podcast/' + podcast.slug">
                <div>
                  <div class="text-md md:text-xl font-semibold tracking-wider">
                    {{ podcast.title }}
                  </div>
                  <div class="text-xs md:text-sm tracking-wide text-gray-500">
                    {{ podcast.subtitle }}
                  </div>
                </div>
                <div class="text-xs md:text-sm tracking-wide">
                  {{ podcast.author }}
                </div>
                <div
                  class="grow-0 text-xs underline md:text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700"
                >
                  {{ $t('podcast.tothepisodes') }}
                </div>
              </NuxtLink>
            </div>
            <div>
              <a :href="getFeedUrl(podcast.slug)" target="_new">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <defs>
                    <linearGradient
                      id="gradient-ccf-1"
                      gradientUnits="userSpaceOnUse"
                      x1="12"
                      y1="3.75"
                      x2="12"
                      y2="20.25"
                      gradientTransform="matrix(1, 0, 0, 1, -0.000031, -0.000823)"
                      xlink:href="#gradient-ccf"
                    ></linearGradient>
                    <linearGradient id="gradient-ccf">
                      <stop
                        offset="0"
                        style="stop-color: rgb(239, 170, 34)"
                      ></stop>
                      <stop
                        offset="0.36"
                        style="stop-color: rgb(239, 170, 34)"
                      ></stop>
                      <stop
                        offset="0.65"
                        style="stop-color: rgb(218, 109, 41)"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <rect
                    width="24"
                    height="24"
                    stroke="none"
                    fill="#000000"
                    opacity="0"
                  ></rect>
                  <path
                    fill-rule="evenodd"
                    d="M 3.75 4.499 C 3.75 4.085 4.086 3.749 4.5 3.749 L 5.25 3.749 C 13.534 3.749 20.25 10.465 20.25 18.749 L 20.25 19.499 C 20.25 19.913 19.915 20.249 19.5 20.249 L 18.75 20.249 C 18.336 20.249 18 19.913 18 19.499 L 18 18.749 C 18 11.707 12.292 5.999 5.25 5.999 L 4.5 5.999 C 4.086 5.999 3.75 5.663 3.75 5.249 L 3.75 4.499 Z M 3.75 11.249 C 3.75 10.835 4.086 10.499 4.5 10.499 L 5.25 10.499 C 9.807 10.499 13.5 14.193 13.5 18.749 L 13.5 19.499 C 13.5 19.913 13.165 20.249 12.75 20.249 L 12 20.249 C 11.586 20.249 11.25 19.913 11.25 19.499 L 11.25 18.749 C 11.25 15.435 8.564 12.749 5.25 12.749 L 4.5 12.749 C 4.086 12.749 3.75 12.413 3.75 11.999 L 3.75 11.249 Z M 3.75 18.749 C 3.75 17.594 5 16.873 6 17.45 C 6.465 17.718 6.75 18.213 6.75 18.749 C 6.75 19.904 5.5 20.625 4.5 20.048 C 4.036 19.78 3.75 19.285 3.75 18.749 Z"
                    clip-rule="evenodd"
                    style="fill: url(#gradient-ccf-1)"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FEED_SLUG } from '~~/base/Constants';
import IPodcast from '~~/base/types/IPodcast';
import { usePodcasts } from '~~/composables/podcastdata';
const { refresh, podcasts } = await usePodcasts();

const route = useRoute();

const toasterMessage = ref('');
const showToast = ref(false);

const sortedPodcasts = computed(() => {
  return podcasts.value.sort((a : IPodcast, b : IPodcast) : number => {
    return (b.updatedAt?new Date(b.updatedAt).getTime():0)-(a.updatedAt?new Date(a.updatedAt).getTime():0)
  })
})

const getFeedUrl = (slug: string): string => {
  return FEED_SLUG + slug + '.xml';
}
onBeforeMount( () => {
  if (route.query.refresh) refresh();
})
const router = useRouter();
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
</script>
