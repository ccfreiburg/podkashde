<template>
  <div class="m-3">
    <h1 class="text-sm">{{ $t("import.title") }}</h1>
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="wpurl">{{
        $t("import.label.wpurl")
      }}</label>
      <input class="field" type="text" name="wpurl" v-model="wpurl" />
    </div>
    <button
      class="
        mt-5
        ml-5
        px-5
        h-10
        border-2
        rounded-md
        bg-orange-300
        hover:bg-orange-400
      "
      @click="metadata"
    >
      {{ $t("import.metadata") }}
    </button>
    <div
      class="
        text-sm
        flex
        sm:flex-row
        flex-col
        place-content-stretch
        items-stretch
      "
    >
      <multi-select
        class="m-2 w-80"
        title="Series"
        :showAllways="true"
        :options="series"
        @checked="onCheckSeries"
      ></multi-select>
      <button
        class="
          mx-3
          mt-4
          p-2
          h-10
          border-2
          rounded-md
          bg-orange-300
          hover:bg-orange-400
        "
        @click="selectPodcasts"
      >
        {{ $t("import.selectPodcasts") }}
      </button>
      <div class="m-3 border-orange-300 border-2 rounded-md mt-4">
        <div class="text-ml bg-orange-300 p-1">Selected as Podcasts</div>
        <div class="p-1">
          <div v-for="(podcast, index) in podcasts" :key="index">
            {{ podcast.text }}
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-end">
        <button
          class="
            mt-5
            px-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
          @click="preview"
        >
          {{ $t("import.preview") }}
        </button>
        <button
          class="
            mt-5
            px-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
          @click="importEnums"
        >
          {{ $t("import.importEnums") }}
        </button>
        <button
          class="
            mt-5
            px-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
          @click="importPodcasts"
        >
          {{ $t("import.importPodcasts") }}
        </button>
        <button
          class="
            mt-5
            px-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
          @click="importSeries"
        >
          {{ $t("import.importSeries") }}</button
        ><button
          class="
            mt-5
            px-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
          @click="importEposides"
        >
          {{ $t("import.importEposides") }}
        </button>
        <button
          class="
            mt-5
            px-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
          @click="importCoverImages"
        >
          {{ $t("import.importCoverImages") }}
        </button>
        <button
          class="
            mt-5
            px-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
          @click="importMp3s"
        >
          {{ $t("import.importMp3s") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Podcast from "~~/backend/entities/Podcast";
import {
  SERIES_AP,
  PODCASTS_AP,
  ENUMERATIONS_AP,
  WP_API_SLUG,
  WP_PER_PAGE,
  WPEPISODES_AP,
} from "~~/backend/Constants";
import { ContentState, Enumerations, EnumKey } from "~~/backend/Enumerations";
import Episode from "~~/backend/entities/Episode";
import Serie from "~~/backend/entities/Serie";
import {
  enumsfromWpMetadata,
  episodeFromWpMetadata,
  podcastsFromWpMetadata,
  seriesfromWpMetadata,
} from "~~/backend/WpImport";
import { type } from "os";
import Enumerator from "~~/backend/entities/Enumerator";

const CCF = "https://ccfreiburg.de/";

export default defineComponent({
  async setup() {
    var wpurl = ref(CCF);
    var series = ref([]);
    var checkedSeries = [];
    var podcasts = ref([]);
    var speakers = ref([]);
    var tags = ref([]);
    var enumerations = new Enumerations();
    var enumer = (await $fetch(ENUMERATIONS_AP)) as Array<Enumerator>;
    enumerations.init(enumer);

    async function getWpKeyValue(category: string) {
      const list = await $fetch(
        wpurl.value + WP_API_SLUG + category + WP_PER_PAGE
      );
      return (list as Array<Object>).map((item) => {
        return { value: item.id, text: item.name, ...item };
      });
    }

    async function importEposides() {
      var totalSum = podcasts.value.reduce((sum, item) => sum + item, 0);
      podcasts.value.forEach(async (podcast) => {
        var page = 1;
        while ((page - 1) * 100 < podcast.count) {
          var list = (await $fetch(
            "https://ccfreiburg.de/wp-json/wp/v2/posts?series=" +
              podcast.id +
              "&per_page=100&page=" +
              page
          )) as [];
          page++;
          var typedEpisodeList = episodeFromWpMetadata(
            list,
            podcast.id,
            enumerations
          );
          const postData = {
            method: "post",
            body: typedEpisodeList,
          };
          var postResult: Response = await $fetch(WPEPISODES_AP, postData);
        }
      });
    }

    async function importPodcasts() {
      var typedPodcastList = podcastsFromWpMetadata(
        podcasts.value,
        enumerations
      );
      const postData = {
        method: "post",
        body: typedPodcastList,
      };
      var postResult: Response = await $fetch(PODCASTS_AP, postData);
    }

    async function importSeries() {
      var typedSeriesList = seriesfromWpMetadata(
        series.value.filter(
          (serie) => !podcasts.value.find((podcast) => podcast.id == serie.id)
        )
      );
      const postData = {
        method: "post",
        body: typedSeriesList,
      };
      var postResult: Response = await $fetch(SERIES_AP, postData);
    }

    async function importEnums() {
      var enums = enumsfromWpMetadata(speakers.value, EnumKey.Authors);
      enumsfromWpMetadata(tags.value, EnumKey.Tags).forEach((item) =>
        enums.push(item)
      );
      const postData = {
        method: "post",
        body: enums,
      };
      var postResult: Response = await $fetch(ENUMERATIONS_AP, postData);
      if (postResult.status == 201) {
        enumerations.addList(enums);
      }
    }

    async function importCoverImages() {}
    async function importMp3s() {}

    function onCheckSeries(value) {
      checkedSeries = value;
    }
    function selectPodcasts() {
      podcasts.value = [];
      checkedSeries.forEach((element) => {
        var item = series.value.find((el) => el.value == element);
        if (item) podcasts.value.push(item);
      });
    }
    async function metadata() {
      series.value = await getWpKeyValue("series");
      speakers.value = await getWpKeyValue("speaker");
      tags.value = await getWpKeyValue("tags");
    }
    async function preview() {}
    return {
      wpurl,
      preview,
      importEnums,
      importPodcasts,
      importSeries,
      importEposides,
      importCoverImages,
      importMp3s,
      metadata,
      selectPodcasts,
      series,
      podcasts,
      onCheckSeries,
      speakers,
      tags,
    };
  },
});
</script>
<style lang="postcss" scoped>
.field {
  @apply border-2
              h-10
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              valid:border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300;
}
.error {
  @apply ring-orange-700 ring-1;
}
.textarea {
  @apply border-2
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300;
}
</style>