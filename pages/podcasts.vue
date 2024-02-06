<template>
  <div>
    <PageLayout :title="$t('podcast.headline')" :submenu="submenu">
    <BaseContainer>
      <div v-for="podcast in sortedPodcasts" :key="podcast.id">
        <div :data-testid="'podcast.' + podcast.slug"
          class="flex flex-row flex-wrap p-4 mt-4 bg-skin-light dark:bg-skin-dark sm:flex-nowrap place-content-center">
          <div class="flex-shrink-0 w-32 h-32">
            <NuxtLink :to="localePath('/podcast/' + podcast.slug)">
              <img class="object-scale-down w-32 h-32" :src="ContentFile.getMediaUrl(podcast.cover_file)" />
            </NuxtLink>
          </div>
          <div class="flex flex-col items-start justify-around flex-grow px-4 py-2 sm:pl-12 rounded-r-md">
            <NuxtLink :to="localePath('/podcast/' + podcast.slug)">
              <div>
                <div class="text-xs font-semibold tracking-wider sm:text-xl md:text-2xl">
                  {{ podcast.title }}
                </div>
                <div class="text-xs tracking-wide md:text-sm text-skin-muted dark:text-skin-muted-dark">
                  {{ podcast.subtitle }}
                </div>
              </div>
              <div class="text-xs tracking-wide md:text-sm">
                {{ podcast.author }}
              </div>
              <div
                class="text-xs tracking-wide text-transparent underline grow-0 md:text-sm bg-clip-text bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
                {{ $t('podcast.tothepisodes') }}
              </div>
            </NuxtLink>
          </div>
          <div class="flex flex-col items-center justify-start">
            <div class="w-6 h-6">
              <a :href="getFeedUrl(podcast.slug)" target="_new">
                <svg viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="gradient-ccf-1" gradientUnits="userSpaceOnUse" x1="12" y1="3.75" x2="12"
                      y2="20.25" gradientTransform="matrix(1, 0, 0, 1, -0.000031, -0.000823)"
                      xlink:href="#gradient-ccf">
                    </linearGradient>
                    <linearGradient id="gradient-ccf">
                      <stop offset="0" style="stop-color: rgb(var(--color-grad-start))"></stop>
                      <stop offset="0.36" style="stop-color: rgb(var(--color-grad-via))"></stop>
                      <stop offset="0.65" style="stop-color: rgb(var(--color-grad-end))"></stop>
                    </linearGradient>
                  </defs>
                  <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"></rect>
                  <path fill-rule="evenodd"
                    d="M 3.75 4.499 C 3.75 4.085 4.086 3.749 4.5 3.749 L 5.25 3.749 C 13.534 3.749 20.25 10.465 20.25 18.749 L 20.25 19.499 C 20.25 19.913 19.915 20.249 19.5 20.249 L 18.75 20.249 C 18.336 20.249 18 19.913 18 19.499 L 18 18.749 C 18 11.707 12.292 5.999 5.25 5.999 L 4.5 5.999 C 4.086 5.999 3.75 5.663 3.75 5.249 L 3.75 4.499 Z M 3.75 11.249 C 3.75 10.835 4.086 10.499 4.5 10.499 L 5.25 10.499 C 9.807 10.499 13.5 14.193 13.5 18.749 L 13.5 19.499 C 13.5 19.913 13.165 20.249 12.75 20.249 L 12 20.249 C 11.586 20.249 11.25 19.913 11.25 19.499 L 11.25 18.749 C 11.25 15.435 8.564 12.749 5.25 12.749 L 4.5 12.749 C 4.086 12.749 3.75 12.413 3.75 11.999 L 3.75 11.249 Z M 3.75 18.749 C 3.75 17.594 5 16.873 6 17.45 C 6.465 17.718 6.75 18.213 6.75 18.749 C 6.75 19.904 5.5 20.625 4.5 20.048 C 4.036 19.78 3.75 19.285 3.75 18.749 Z"
                    clip-rule="evenodd" style="fill: url(#gradient-ccf-1)"></path>
                </svg>
              </a>
            </div>
            <div class="w-4 h-4 mt-2">
              <a :href="podcast.apple_url" target="_new">
                <svg viewBox="0 0 24 24">
                  <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"></rect>
                  <path
                    d="M 13.939 21.084 C 13.709 21.826 12.842 22 12 22 C 11.159 22 10.291 21.826 10.062 21.084 C 9.72 19.974 9.142 17.192 9.142 15.897 C 9.142 14.523 10.535 14.187 12 14.187 C 13.466 14.187 14.858 14.523 14.858 15.897 C 14.858 17.183 14.283 19.965 13.939 21.084 Z M 9.003 13.272 C 8.168 12.557 7.665 11.546 7.719 10.436 C 7.809 8.494 9.612 6.922 11.831 6.846 C 14.271 6.764 16.286 8.477 16.286 10.594 C 16.286 11.641 15.793 12.591 14.997 13.272 C 14.878 13.374 14.891 13.543 15.025 13.631 C 15.441 13.895 15.761 14.229 15.975 14.621 C 16.052 14.764 16.263 14.803 16.395 14.695 C 17.682 13.638 18.474 12.125 18.427 10.454 C 18.345 7.477 15.587 5.056 12.185 4.971 C 8.557 4.881 5.572 7.438 5.572 10.594 C 5.572 12.209 6.355 13.668 7.605 14.695 C 7.737 14.803 7.948 14.764 8.027 14.621 C 8.24 14.229 8.559 13.895 8.975 13.631 C 9.109 13.543 9.122 13.374 9.003 13.272 Z M 12 2 C 6.474 2 2 5.913 2 10.751 C 2 14.265 4.347 17.221 7.614 18.617 C 7.806 18.7 8.027 18.557 7.995 18.371 C 7.888 17.765 7.8 17.163 7.754 16.639 C 7.746 16.567 7.702 16.502 7.634 16.463 C 5.517 15.22 4.125 13.102 4.143 10.706 C 4.169 6.947 7.682 3.884 11.979 3.875 C 16.321 3.864 19.858 6.953 19.858 10.751 C 19.858 13.169 18.422 15.3 16.257 16.525 C 16.213 17.074 16.12 17.721 16.006 18.371 C 15.975 18.557 16.194 18.7 16.386 18.617 C 19.645 17.223 22 14.274 22 10.751 C 22 5.914 17.527 2 12 2 Z M 12 8.249 C 10.422 8.249 9.142 9.368 9.142 10.751 C 9.142 12.131 10.422 13.249 12 13.249 C 13.579 13.249 14.858 12.131 14.858 10.751 C 14.858 9.368 13.579 8.249 12 8.249 Z"
                    style="fill: rgb(146, 146, 146);" data-bx-origin="-1.09575 -0.7138"></path>
                </svg></a>
            </div>
            <div class="w-4 h-4 mt-1">
              <a :href="podcast.spotify_url" target="_new">

                <svg viewBox="0 0 24 24">
                  <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"></rect>
                  <path
                    d="M 11.806 2.403 C 6.966 2.403 3.038 6.644 3.038 11.869 C 3.038 17.094 6.966 21.335 11.806 21.335 C 16.646 21.335 20.574 17.094 20.574 11.869 C 20.574 6.644 16.646 2.403 11.806 2.403 Z"
                    style="fill: rgb(146, 146, 146);"></path>
                  <path
                    d="M 17.803 11.017 C 17.619 11.017 17.506 10.967 17.347 10.868 C 14.83 9.246 10.329 8.856 7.416 9.734 C 7.289 9.772 7.13 9.833 6.96 9.833 C 6.493 9.833 6.136 9.44 6.136 8.933 C 6.136 8.413 6.433 8.119 6.752 8.02 C 7.996 7.627 9.389 7.44 10.905 7.44 C 13.486 7.44 16.191 8.02 18.167 9.265 C 18.443 9.437 18.623 9.673 18.623 10.127 C 18.623 10.646 18.234 11.017 17.803 11.017 Z M 16.707 13.925 C 16.523 13.925 16.399 13.837 16.272 13.765 C 14.063 12.352 10.768 11.784 7.837 12.643 C 7.667 12.692 7.575 12.742 7.416 12.742 C 7.038 12.742 6.73 12.41 6.73 12.001 C 6.73 11.593 6.914 11.322 7.278 11.211 C 8.261 10.914 9.265 10.692 10.736 10.692 C 13.03 10.692 15.247 11.307 16.993 12.429 C 17.28 12.612 17.393 12.849 17.393 13.181 C 17.389 13.593 17.092 13.925 16.707 13.925 Z M 15.756 16.429 C 15.607 16.429 15.516 16.38 15.378 16.291 C 13.172 14.856 10.605 14.795 8.07 15.357 C 7.932 15.395 7.752 15.456 7.649 15.456 C 7.307 15.456 7.091 15.162 7.091 14.853 C 7.091 14.46 7.307 14.272 7.571 14.211 C 10.467 13.521 13.426 13.582 15.95 15.211 C 16.166 15.36 16.293 15.494 16.293 15.841 C 16.293 16.189 16.042 16.429 15.756 16.429 Z"
                    style="fill: rgb(255, 255, 255);"></path>
                </svg>
              </a>
            </div>

            <div class="w-4 h-4 mt-1">
              <a :href="podcast.google_url" target="_new">

                <svg viewBox="0 0 24 24">
                  <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"></rect>
                  <g stroke-linecap="round" stroke-width="48.5"
                    transform="matrix(0.042163, 0, 0, 0.051314, 3.701367, 1.886807)" style="">
                    <path d="m24.26 186.32v27.351" style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);">
                    </path>
                    <path d="m375.74 186.32v27.351" style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);">
                    </path>
                    <path d="m112.13 104.27v89.46m0 74.645v27.351"
                      style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);"></path>
                    <path d="m287.87 206.26v89.46m0-191.46v27.351"
                      style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);"></path>
                    <path d="m200 127.06v145.87m0-248.68v27.351m0 296.78v27.351"
                      style="fill: rgb(146, 146, 146); stroke: rgb(146, 146, 146);"></path>
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  </PageLayout>
  </div>
</template>

<script setup lang="ts">
import { FEED_SLUG } from '~~/base/Constants';
import type IPodcast from '~~/base/types/IPodcast';
import { ContentFile } from '~~/base/ContentFile'
import {usePodcasts} from '~/composables/usePodcast';

const { refresh, podcasts } = usePodcasts()
const localePath = useLocalePath()
const route = useRoute()
const {user} = useAuth()

const sortedPodcasts = computed(() => {
  if (!podcasts.value) return []
  return podcasts.value.filter((p) => !p.draft || user.value).sort((a: IPodcast, b: IPodcast): number => {
    return (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) - (a.updatedAt ? new Date(a.updatedAt).getTime() : 0)
  })
})

const getFeedUrl = (slug: string): string => {
  return ContentFile.getMediaUrl(FEED_SLUG) + slug + '.xml';
}
onBeforeMount(() => {
  if (route.query.refresh) refresh();
})
const router = useRouter();
onMounted(() =>
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
