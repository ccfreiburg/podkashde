<template>
  <div>
    <PageLayout :title="$t('podcast.title')" :submenu="submenu" @menuItemClicked="menuItemClicked">
    <div v-if="!(podcastLoading || enumsLoading)" class="flex flex-col items-center">
      <div class="flex flex-row w-11/12 md:w-2/3 md:h-60">
        <img class="relative z-10 h-20 md:h-60 shrink-0" :src="ContentFile.getMediaUrl(podcast.cover_file)" />
        <div class="flex flex-col justify-around pt-1 pb-10 pl-4 md:pl-14 rounded-r-md">
          <div>
            <div class="font-semibold tracking-wider text-md md:text-2xl">
              {{ podcast.title }}
            </div>
            <div class="text-xs tracking-wide text-gray-500 md:text-sm">
              {{ podcast.subtitle }}
            </div>
          </div>
          <div class="text-xs md:text-sm">{{ podcast.author }}</div>
          <div class="hidden w-full h-12 pt-2 overflow-y-auto text-sm break-normal md:inline-flex">
            {{ podcast.summary }}
          </div>
          <div class="hidden md:inline-flex">
            <div class="flex flex-row flex-wrap">
              <div
                class="px-1 my-1 mr-1 text-xs font-bold rounded-md text-skin-inverted bg-gradient-to-r from-skin-from via-skin-via to-skin-to whitespace-nowrap">
                {{ podcastGenre.parentCategory }} -
                {{ podcastGenre.displaytext }}
              </div>
              <div v-if="podcast.explicit"
                class="px-1 m-1 text-xs font-bold rounded-md text-skin-inverted bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
                explicit
              </div>
              <div
                class="px-1 m-1 text-xs font-bold rounded-md text-skin-inverted bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
                {{ language.displaytext }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="relative z-0 w-full">
        <div class="absolute flex flex-col items-center w-full p-4 -top-8 bg-skin-muted dark:bg-skin-muted-dark"></div>
      </div>
      <BaseContainer class="w-full pb-10">
        <div class="text-sm font-bold tracking-widest text-center md:pt-14 md:text-ml">
          {{ $t('podcast.inthis') }}
        </div>

        <EpisodesList :episodes="episodes" />
      </BaseContainer>
    </div>
    </PageLayout>
  </div>
</template>
<script setup lang="ts">
import { ContentFile } from '~~/base/ContentFile'

const {user} = useAuth()
const route = useRoute()
const router = useRouter()

const slug = route.params.slug as string;

const { refresh, remove, loading: podcastLoading, podcast, episodes } = usePodcast(slug);
const { enumerations, loading: enumsLoading } = useEnumerations();
const language = ref()
const podcastGenre = ref()

const {on_mounted, on_before} = useMounted(refresh, user, false)
onMounted( on_mounted )
onBeforeMount( on_before )

const doneLoading = () => {
  if (!podcastLoading.value && !enumsLoading.value) {
    if (!podcast.value || Object.keys(podcast.value).length === 0) {
      router.push({ path: "/podcasts", query: {refresh: 'true', msg: 'podcast.notfound' }})
    } else {
      router.replace({
        ...router.currentRoute,
        query: {},
      })
      language.value = enumerations.getLanguage(podcast.value.language_id);
      podcastGenre.value = enumerations.getGenre(podcast.value.category_id);
    }
  }
}
doneLoading()
watch( [podcastLoading, enumsLoading], doneLoading)

const submenu = ref([{
      id: 0,
      name: 'podcast.edit',
      slug: '/admin/podcast/' + slug,
      layout: 'edit',
    },
    {
      id: 1,
      name: 'episode.add',
      slug: '/admin/podcast/' + slug + '/new-episode',
      layout: 'add',
    },
  ])
if (user.value && user.value.username.toLowerCase().startsWith('admin'))
  submenu.value.push({
    id: 2,
    name: 'delete',
    slug: '#delete',
    layout: 'delete'
  })

async function menuItemClicked(value: string) {
  if (value=="#delete")
      remove().then(() => router.push('/podcasts?refresh=true'))
}
</script>