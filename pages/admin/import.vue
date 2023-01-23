<template>
  <div class="m-3">
    <!-- Modal Dialog -->
    <div v-show="loading" class="fixed pin z-50 overflow-auto inset-0 bg-gray-600 bg-opacity-50 h-full w-full"
      id="modal">
      <div class="relative h-screen flex justify-center items-center">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg">
          <!-- Modal header -->
          <div class="flex flex-col justify-between items-start p-4 rounded-t border-b">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ $t('import.loading') }}
            </h3>
            <div class="mt-4 h-80 overflow-scroll flex flex-col">
              <div v-for="(status, index) in statusLog" :key="index" class="text-sm">
                {{ status.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col">
      <div class="shrink ccfunderline">
        <h1 class="text-2xl font-semibold">&nbsp;{{ $t("import.title") }}&nbsp;</h1>
      </div>
      <div>
        <p class="text-sm mt-2 mb-4 font-thin">{{ $t("import.subtitle") }}</p>
      </div>
      <!-- Enter API Url for Wordpress -->
      <div class="flex flex-row items-end mt-3">
        <input-area class="flex-grow" :name="'wpurl'" :label="'import.label.wpurl'" :errors="[]"
          v-model:value="wpurl" />
        <button class="
                mt-5
                ml-5
                px-2
                h-10
                rounded-md
                ccfbutton-border
                " @click="loadMetadata">
          {{ $t("import.metadata") }}
        </button>
      </div>
      <!-- Select Podcasts from Categories -->
      <div class="
        mt-10
        text-sm
        flex
        sm:flex-row
        flex-col
        place-content-stretch
      ">
        <multi-select class="sm:w-1/2 w-full" title="WordPress Categories" :showAllways="true"
          :options="wpMetadata.series" @checked="onCheckSeries"></multi-select>
        <div class="flex flex-col sm:w-1/2 w-full">

          <single-select class="mx-3" :options="podcastOptions" :name="'test'" label="podcast.change"
            v-model:value="selectedPodcast"></single-select>
          <button class="
                mt-5
                mx-3
                px-2
                h-14
                rounded-md
                ccfbutton-border
            " @click="selectWpSeries">
            {{ (selectedPodcast > 0 ? $t("import.selectSeries") : $t("import.selectWpSeries")) }}
          </button>
          <div class="m-3 h-full border-2 rounded-md mt-4">
            <div class="text-ml p-1">Selected</div>
            <div class="p-1">
              <div v-for="(podcast, index) in wpPodcasts" :key="index">
                {{ podcast.text }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analyse Data -->
      <div class="mt-10 flex flex-col justify-end">
        <h1 class="text-xl">{{ $t("import.preview") }}</h1>
        <div class="
        mt-10
        text-sm
        flex
        sm:flex-row
        flex-col
        place-content-stretch
      ">
          <button class="
            mt-5
            px-3
            h-10
            rounded-md
            ccfbutton-border
          " @click="loadPreview">
            {{ $t("import.preview") }}
          </button>
          <div class="ml-8 w-fill flex flex-col">
            <div>{{ wpMetadata.speakers.length }} - speakers</div>
            <div>{{ wpMetadata.tags.length }} - tags</div>
            <div>{{ wpMetadata.series.length }} - series</div>
            <div>{{ wpPodcasts.length }} - {{(selectedPodcast > 0 ? "Series" : "Podcasts")}}</div>
            <div v-for="(episodes, index) in wpPodcastEpisodesCount" :key="index">
              {{(selectedPodcast > 0 ? "Serie" : "Podcast")}}: {{ wpPodcasts[index].title }} - {{ episodes }} Episodes
            </div>
          </div>
        </div>
      </div>
      <div class="
        mt-10
        flex
        flex-col
        place-content-stretch
        items-stretch
      ">
        <h1 class="text-xl">{{ $t("import.options") }}</h1>
        <div class="flex flex-col sm:flex-row justify-end content-between">
          <div class="flex flex-col">
            <switch-box :checked="isCheckedImportFromArchiv" @checkedChanged="(val) => isCheckedImportFromArchiv = val"
              :labelChecked="$t('import.importArchive')" />
            <switch-box :checked="isCheckedImportMp3s" @checkedChanged="(val) => isCheckedImportMp3s = val"
              :labelChecked="$t('import.importMp3s')" />
            <switch-box :checked="isCheckedImportCovers" @checkedChanged="(val) => isCheckedImportCovers = val"
              :labelChecked="$t('import.importCoverImages')" />
            <switch-box :checked="isCheckedImportMetadata" :disabled="!isEnabledMetadata"
              @checkedChanged="(val) => isCheckedImportMetadata = val" :labelChecked="$t('import.importMetadata')" />
          </div>
          <div class="flex-grow"></div>
          <button class="
                mt-5
                ml-5
                px-2
                h-10
                rounded-md
                ccfbutton-border
          " @click="importAll">
            {{ $t("import.import") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  SERIES_AP,
  ENUMERATIONS_AP,
  FETCHLOCAL_AP,
  SERVER_IMG_PATH,
  SERVER_MP3_PATH,
  SERIES_IMG_PATH,
  PODCAST_AP,
  EPISODEWP_AP,
  SERVER_POSTIMG_PATH,
  GENERATE_RSS_AP,
  FROMARCHIVE_AP,
} from "~~/base/Constants";
import {
  enumsfromWpMetadata,
  episodeFromWpMetadata,
  getSerieFromWp,
  podcastFromWpMetadata,
  seriesfromWpMetadata,
} from "~~/base/WpImport";
import { ContentFile } from "~~/base/ContentFile";
import { IWpKeyValue, useWpEpisodeCount, useWpEpisodes, useWpMetadata, WpMetadata } from "~~/composables/wpimportdata";
import { EnumKey } from "~~/base/Enumerations";
import ProgressInfo from "~~/base/types/ProgressInfo";
import IEnumerator from "~~/base/types/IEnumerator";
import IPodcast from "~~/base/types/IPodcast";
import ISerie from "~~/base/types/ISerie";
import { IFetchFileResult } from "~~/base/types/IFetchFileResult";
import { addState, ContentState } from "~~/base/types/ContentState";

const CCF = "https://ccfreiburg.de/";

definePageMeta({
  middleware: "authentication",
});

const wpurl = ref(CCF);
const loading = ref(false);
const wpPodcasts = ref([] as Array<Object>);
const wpPodcastEpisodesCount = ref(new Array<number>());
const wpMetadata = ref(new WpMetadata())
const statusLog = ref([] as Array<Object>);
const { refresh, enums, enumerations } = await useEnumerations();
const isCheckedImportMp3s = ref(false)
const isCheckedImportCovers = ref(false)
const isEnabledMetadata = ref(enumerations.authors.length < 1 || enumerations.tags.length < 1)
const isCheckedImportMetadata = ref(isEnabledMetadata.value)
const isCheckedImportFromArchiv = ref(false)

const { podcasts } = await usePodcasts()
const podcastOptions = podcasts.value.map((p) => {
  return {
    enumvalue_id: p.id,
    displaytext: p.title,
  }
})
const selectedPodcast = ref(0)

var checkedSeries = [] as Array<Object>;
var wpPodcastEpisodes = [] as Array<Object>;

async function post<T>(endpoint: string, data: T) {
  const postData = {
    method: "post",
    body: data as T,
  };
  var postResult: Response = await $fetch(endpoint, postData);
  if (postResult.status != 201)
    throw ("A problem saving the data on server")
}

async function importEnums() {
  statusLog.value.push({ message: "Saving tags and authors to server" })
  var enums = enumsfromWpMetadata(enumerations.getAuthor, wpMetadata.value.speakers, EnumKey.Authors);
  enumsfromWpMetadata(enumerations.getTag, wpMetadata.value.tags, EnumKey.Tags).forEach((item) =>
    enums.push(item)
  );
  await post<Array<IEnumerator>>(ENUMERATIONS_AP, enums)
  refresh()
}

async function importSeries() {
  statusLog.value.push({ message: "Saving series metadata to server" })
  const { series } = await useSeries()
  var pk_series = seriesfromWpMetadata(
    series.value,
    wpMetadata.value.series.filter(
      (serie: IWpKeyValue) => !wpPodcasts.value.find((podcast) => podcast.id == serie.id)
    ))
  if (isCheckedImportCovers.value) {
    for await (var serie of pk_series) {
      serie.cover_file = await downloadFile(SERVER_IMG_PATH, SERIES_IMG_PATH, serie.cover_file)
      serie.state = addState(serie.state, ContentState.image)
    }
  }
  await post<Array<ISerie>>(SERIES_AP, pk_series)
}

async function downloadFile(serverPath: string, slug: string, file: string, altslug?: string): Promise<string> {
  // Download cover to server
  var ret = {}
  if (isCheckedImportFromArchiv.value)
    ret = await fetchArchive(
      serverPath,
      slug,
      file,
    );
  else
    ret = await fetchFile(
      serverPath,
      slug,
      file,
      altslug
    );
  // If download successfull return new address of cover_image 
  if (ret.path && ret.status == 201 || ret.status == 423) {
    return ret.path as string;
  }
  else
    return file;
}

async function fetchArchive(serverPath: string, slug: string, file: string): Promise<IFetchFileResult> {
  const name = ContentFile.getFilename(file)
  statusLog.value.push({ message: "Looking for " + name + " in archive" })
  return await $fetch(FROMARCHIVE_AP, {
    method: "post",
    body: {
      serverPath,
      slug,
      name
    } as Object,
  }) as IFetchFileResult;
}

async function fetchFile(
  serverPath: string,
  slug: string,
  file: string,
  altslug?: string
): Promise<IFetchFileResult> {
  statusLog.value.push({ message: "Downloading " + file + " to server" })
  const newpath = ContentFile.getPathFromUrl(serverPath, slug);
  const newfile = ContentFile.getFilename(file);
  if (ContentFile.isQualifiedUrl(file)) {
    const postData = {
      method: "post",
      body: {
        orgurl: file,
        newpath,
        newfile,
        altpath: (altslug ? ContentFile.getPathFromUrl(serverPath, altslug) : "")
      } as Object,
    };
    const ret = (await $fetch(FETCHLOCAL_AP, postData)) as IFetchFileResult;
    return ret;
  }
  return { status: 501, message: "Something went wrong" }
}
// 
async function importPodcast(podcast: any) {
  statusLog.value.push({ message: "Saving podcast " + podcast.title + " to server" })
  var contentState = ContentState.allmeta;
  const { podcasts } = await usePodcasts()
  const { episodes } = await useEpisodes()
  var podkashde = podcastFromWpMetadata(podcasts.value, podcast, enums.value)
  if (isCheckedImportCovers.value) {
    podkashde.cover_file = await downloadFile(SERVER_IMG_PATH, podkashde.slug, podkashde.cover_file)
    podkashde.state = addState(contentState, ContentState.image)
  }
  await post<IPodcast>(PODCAST_AP, podkashde)
  const wpEpisodes = await useWpEpisodes(wpurl.value, podcast.id)
  await refresh() // enums refresh
  for await (var episode of wpEpisodes.value) {
    contentState = ContentState.allmeta;
    var seriesId = episode.series.find((serieId) => serieId != podkashde.external_id);
    var pk_episode = episodeFromWpMetadata(
      episodes.value,
      episode,
      podkashde.external_id,
      seriesId,
      podkashde.cover_file,
      enumerations
    )
    if (isCheckedImportCovers.value) {
      if (pk_episode.image) {
        pk_episode.image = await downloadFile(SERVER_IMG_PATH, podkashde.slug, pk_episode.image, SERIES_IMG_PATH)
        contentState = addState(contentState, ContentState.image)
      }
      if (pk_episode.postimage)
        pk_episode.postimage = await downloadFile(SERVER_POSTIMG_PATH, podkashde.slug, pk_episode.postimage)
    }
    if (isCheckedImportMp3s.value) {
      pk_episode.link = await downloadFile(SERVER_MP3_PATH, podkashde.slug, pk_episode.link)
      contentState = addState(contentState, ContentState.files)
    }
    pk_episode.state = contentState;
    statusLog.value.push({ message: "Saving episode " + pk_episode.title + " to server" })
    await post(EPISODEWP_AP, { episode: pk_episode })
  }
  $fetch(GENERATE_RSS_AP, { query: { slug: podkashde.slug } })
}

async function importSerie(wpserie: any, podkashde: IPodcast) {
  statusLog.value.push({ message: "Saving series " + wpserie.title + " to server" })
  var contentState = ContentState.allmeta;
  const { episodes } = await useEpisodes()
  const { series } = await useSeries()
  var podkSerie = getSerieFromWp(series.value, wpserie)
  if (isCheckedImportCovers.value) {
    podkSerie.cover_file = await downloadFile(SERVER_IMG_PATH, SERIES_IMG_PATH, podkSerie.cover_file)
    podkSerie.state = addState(contentState, ContentState.image)
  }
  await post<Array<ISerie>>(SERIES_AP, [podkSerie])
  await refresh() // enums refresh
  const wpEpisodes = await useWpEpisodes(wpurl.value, wpserie.id)
  for await (var episode of wpEpisodes.value) {
    contentState = ContentState.allmeta;
    var pk_episode = episodeFromWpMetadata(
      episodes.value,
      episode,
      podkashde.external_id,
      wpserie.id,
      podkashde.cover_file,
      enumerations
    )
    if (isCheckedImportCovers.value) {
      if (pk_episode.image) {
        pk_episode.image = await downloadFile(SERVER_IMG_PATH, podkashde.slug, pk_episode.image, SERIES_IMG_PATH)
        contentState = addState(contentState, ContentState.image)
      }
      if (pk_episode.postimage)
        pk_episode.postimage = await downloadFile(SERVER_POSTIMG_PATH, podkashde.slug, pk_episode.postimage)
    }
    if (isCheckedImportMp3s.value) {
      pk_episode.link = await downloadFile(SERVER_MP3_PATH, podkashde.slug, pk_episode.link)
      contentState = addState(contentState, ContentState.files)
    }
    pk_episode.state = contentState;
    statusLog.value.push({ message: "Saving episode " + pk_episode.title + " to server" })
    await post(EPISODEWP_AP, { podcastId: podkashde.id, episode: pk_episode })
  }
  $fetch(GENERATE_RSS_AP, { query: { slug: podkashde.slug } })
}

// Event Handlers

function onCheckSeries(value: Array<Object>) {
  checkedSeries = value;
}

function selectWpSeries() {
  wpPodcasts.value = [];
  wpPodcastEpisodesCount.value = [];
  checkedSeries.forEach((element) => {
    var item = wpMetadata.value.series.find((el) => el.value == element);
    if (item) wpPodcasts.value.push(item);
  });
}

async function loadMetadata() {
  statusLog.value = [];
  loading.value = true;
  const { wpm } = await useWpMetadata(wpurl.value, (progress: ProgressInfo) => statusLog.value.push(progress));
  wpMetadata.value = wpm.value;
  loading.value = false;
}

async function loadPreview() {
  statusLog.value = [];
  loading.value = true;
  for await (var element of wpPodcasts.value) {
    statusLog.value.push({ message: "Loading Episode counts for " + (element as any).title })
    const episodes = await useWpEpisodeCount(wpurl.value, (element as any).id)
    wpPodcastEpisodesCount.value.push(episodes.value)
  }
  loading.value = false;
}
async function importAll() {
  statusLog.value = [];
  loading.value = true;
  if (isCheckedImportMetadata.value) {
    await importEnums();
    await importSeries();
  }
  if (selectedPodcast.value > 0) {
    const podcast = podcasts.value.find((p) => p.id == selectedPodcast.value)
    for await (var wpserie of wpPodcasts.value) {
      await importSerie(wpserie, podcast);
    }
  } else {
    for await (var wppodcast of wpPodcasts.value) {
      await importPodcast(wppodcast);
    }
  }
  loading.value = false;
}
</script>