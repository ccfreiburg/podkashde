<template>
  <div>
    <messge-toast></messge-toast>
    <sub-menu v-if="user != null" :items="submenu"/>
    <div class="w-full flex justify-center">
      <div
      class="mt-4 md:mt-6 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;{{ $t('podcast.headline') }}&nbsp;
      </div>
    </div>
    <div class="w-full bg-gray-200 flex justify-center">
      <div class="pt-6 md:pt-10 w-5/6 md:w-2/3 flex flex-col">
        <div v-for="podcast in sortedPodcasts" :key="podcast.id">
          <div class="p-4 mt-4 bg-white flex flex-row flex-wrap sm:flex-nowrap place-content-center">
            <NuxtLink :to="localePath('/podcast/' + podcast.slug)">
              <img class="w-32 h-32 object-scale-down" :src="podcast.cover_file" />
            </NuxtLink>
            <div
              class="px-4 sm:pl-12 py-2 flex-grow flex flex-col justify-around items-start rounded-r-md"
            >
              <NuxtLink :to="localePath('/podcast/' + podcast.slug)">
                <div>
                  <div class="text-xs sm:text-xl md:text-2xl font-semibold tracking-wider">
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
            <div class="flex flex-col justify-start items-center">
            <div class="w-6 h-6">
              <a :href="getFeedUrl(podcast.slug)" target="_new">
              <svg viewBox="0 0 24 24">
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
            <div class="w-4 h-4 mt-2">
<svg viewBox="0 0 24 24">
  <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"></rect>
  <ellipse style="stroke-width: 1.5px; fill: none; stroke: rgb(146, 146, 146);" cx="12" cy="12" rx="10" ry="10"></ellipse>
  <path d="M 15.018 16.51 C 15.614 16.347 16.034 15.95 16.206 15.39 L 16.257 15.225 L 16.264 10.809 C 16.268 7.502 16.264 6.372 16.244 6.311 C 16.224 6.245 16.191 6.191 16.148 6.147 C 16.085 6.111 16.009 6.092 15.924 6.092 C 15.864 6.092 15.658 6.119 15.467 6.151 C 14.617 6.296 9.613 7.229 9.527 7.258 C 9.396 7.304 9.264 7.413 9.202 7.528 L 9.149 7.626 C 9.149 7.626 9.125 14.547 9.086 14.625 C 9.028 14.744 8.898 14.856 8.779 14.893 C 8.723 14.909 8.5 14.956 8.282 14.996 C 7.278 15.183 6.906 15.318 6.59 15.608 C 6.411 15.772 6.278 15.997 6.221 16.233 C 6.166 16.458 6.185 16.795 6.262 17 C 6.344 17.214 6.476 17.397 6.648 17.542 C 6.805 17.655 6.99 17.738 7.198 17.789 C 7.658 17.899 8.518 17.776 8.957 17.538 C 9.142 17.438 9.379 17.23 9.501 17.057 C 9.55 16.99 9.624 16.853 9.664 16.754 C 9.808 16.405 9.812 10.204 9.831 10.126 C 9.861 9.993 9.958 9.896 10.092 9.864 C 10.213 9.834 15.031 8.943 15.166 8.925 C 15.286 8.909 15.398 8.946 15.46 9.016 C 15.496 9.035 15.527 9.059 15.549 9.09 C 15.588 9.144 15.59 9.252 15.596 11.215 C 15.603 13.475 15.606 13.422 15.475 13.565 C 15.379 13.668 15.26 13.709 14.77 13.802 C 14.025 13.944 13.77 14.012 13.484 14.143 C 13.128 14.305 12.93 14.484 12.778 14.78 C 12.669 14.99 12.629 15.147 12.629 15.356 C 12.63 15.728 12.767 16.02 13.077 16.305 C 13.106 16.332 13.134 16.356 13.162 16.379 C 13.319 16.492 13.479 16.561 13.679 16.604 C 13.981 16.669 14.596 16.626 15.018 16.51 Z" style="paint-order: fill; fill: rgb(146, 146, 146);"></path>
</svg>
            </div>
            <div class="w-4 h-4 mt-1">
<svg viewBox="0 0 24 24">
  <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"></rect>
  <path d="M 11.806 2.403 C 6.966 2.403 3.038 6.644 3.038 11.869 C 3.038 17.094 6.966 21.335 11.806 21.335 C 16.646 21.335 20.574 17.094 20.574 11.869 C 20.574 6.644 16.646 2.403 11.806 2.403 Z" style="fill: rgb(146, 146, 146);"></path>
  <path d="M 17.803 11.017 C 17.619 11.017 17.506 10.967 17.347 10.868 C 14.83 9.246 10.329 8.856 7.416 9.734 C 7.289 9.772 7.13 9.833 6.96 9.833 C 6.493 9.833 6.136 9.44 6.136 8.933 C 6.136 8.413 6.433 8.119 6.752 8.02 C 7.996 7.627 9.389 7.44 10.905 7.44 C 13.486 7.44 16.191 8.02 18.167 9.265 C 18.443 9.437 18.623 9.673 18.623 10.127 C 18.623 10.646 18.234 11.017 17.803 11.017 Z M 16.707 13.925 C 16.523 13.925 16.399 13.837 16.272 13.765 C 14.063 12.352 10.768 11.784 7.837 12.643 C 7.667 12.692 7.575 12.742 7.416 12.742 C 7.038 12.742 6.73 12.41 6.73 12.001 C 6.73 11.593 6.914 11.322 7.278 11.211 C 8.261 10.914 9.265 10.692 10.736 10.692 C 13.03 10.692 15.247 11.307 16.993 12.429 C 17.28 12.612 17.393 12.849 17.393 13.181 C 17.389 13.593 17.092 13.925 16.707 13.925 Z M 15.756 16.429 C 15.607 16.429 15.516 16.38 15.378 16.291 C 13.172 14.856 10.605 14.795 8.07 15.357 C 7.932 15.395 7.752 15.456 7.649 15.456 C 7.307 15.456 7.091 15.162 7.091 14.853 C 7.091 14.46 7.307 14.272 7.571 14.211 C 10.467 13.521 13.426 13.582 15.95 15.211 C 16.166 15.36 16.293 15.494 16.293 15.841 C 16.293 16.189 16.042 16.429 15.756 16.429 Z" style="fill: rgb(255, 255, 255);"></path>
</svg>
</div>

<div class="w-4 h-4 mt-1">
<svg viewBox="0 0 24 24">
  <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"></rect>
  <g stroke-linecap="round" stroke-width="48.5" transform="matrix(0.042163, 0, 0, 0.051314, 3.701367, 1.886807)" style="">
    <path d="m24.26 186.32v27.351" style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);"></path>
    <path d="m375.74 186.32v27.351" style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);"></path>
    <path d="m112.13 104.27v89.46m0 74.645v27.351" style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);"></path>
    <path d="m287.87 206.26v89.46m0-191.46v27.351" style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);"></path>
    <path d="m200 127.06v145.87m0-248.68v27.351m0 296.78v27.351" style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);"></path>
  </g>
</svg>
</div>
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
const localePath = useLocalePath();
const route = useRoute();
const user = await useAuth().useAuthUser() as any;

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
const submenu = [
{
    id: 0,
    name: "podcast.new",
    slug: "/admin/new-podcast",
    layout: "add"
  }
]

</script>
