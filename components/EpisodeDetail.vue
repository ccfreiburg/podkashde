<template>
  <div
    class="p-10 w-full h-full"
    v-on:keyup.enter="save"
    v-on:keyup.esc="cancel"
  >
    <div class="mb-5">
      <h1 class="text-2xl text-center">
        {{
          isEdit
            ? $t("episodeDetail.editEpisode")
            : $t("episodeDetail.newEpisode")
        }}
      </h1>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-row">
        <div>
          <image-selector :value="imgMetadata" @imageSelected="imageSelected" />
        </div>
        <div class="flex flex-col">
          <div class="flex flex-col mt-3" @click="chooseMp3File">
            <label class="pl-2 text-sm text-gray-500" for="file">{{
              $t("episodeDetail.label.file")
            }}</label>
            <input
              :class="getClass('file')"
              type="text"
              name="file"
              readonly
              v-model="audiofilename"
            />
            <input
              class="invisible"
              type="file"
              ref="mp3FileInput"
              name="fileChoser"
              @change="mp3FileSelected"
            />
          </div>
          <div class="flex flex-col mt-3">
            <label class="pl-2 text-sm text-gray-500" for="serie">{{
              $t("episodeDetail.label.serie")
            }}</label>
            <select
              :class="getClass('serie')"
              name="serie_id"
              v-model="serie_id"
            >
              <option v-for="serie in series" :key="serie.id" :value="serie.id">
                {{ serie.title }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <!-- Fields-->
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="title">{{
          $t("episodeDetail.label.title")
        }}</label>
        <input
          :class="getClass('title')"
          type="text"
          name="title"
          @change="generateSlug()"
          v-model="fields.title"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="subtitle">{{
          $t("episodeDetail.label.subtitle")
        }}</label>
        <input
          class="field"
          type="text"
          name="subtitle"
          v-model="fields.subtitle"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="keyword">{{
          $t("episodeDetail.label.keyword")
        }}</label>
        <input
          class="field"
          type="text"
          name="keyword"
          v-model="fields.keyword"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="pubdate">{{
          $t("episodeDetail.label.pubdate")
        }}</label>
        <input class="field" type="date" name="pubdate" v-model="pubdatetext" />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="duration">{{
          $t("episodeDetail.label.duration")
        }}</label>
        <input
          class="field"
          type="text"
          name="duration"
          v-model="durationText"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="slug">{{
          $t("episodeDetail.label.slug")
        }}</label>
        <input class="field" type="text" name="slug" v-model="fields.slug" />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="creator">{{
          $t("episodeDetail.label.creator")
        }}</label>
        <input
          :class="getClass('creator')"
          type="text"
          name="creator"
          @change="generateSlug()"
          v-model="fields.creator"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="summary">{{
          $t("episodeDetail.label.summary")
        }}</label>
        <textarea
          class="textarea h-28"
          type="text"
          name="summary"
          v-model="fields.summary"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="description">{{
          $t("episodeDetail.label.description")
        }}</label>
        <textarea
          class="textarea h-28"
          type="text"
          name="description"
          v-model="fields.description"
        />
      </div>
      <div class="flex flex-row mt-3">
        <div
          class="
            relative
            w-12
            h-6
            transition
            duration-200
            ease-linear
            rounded-2xl
          "
          :class="[fields.block ? 'bg-orange-300' : 'bg-gray-200']"
        >
          <label
            for="block"
            class="
              absolute
              left-0
              w-6
              h-6
              mb-2
              transition
              duration-100
              ease-linear
              transform
              bg-white
              border-2
              rounded-2xl
              cursor-pointer
            "
            :class="[
              fields.block
                ? 'translate-x-full border-orange-300'
                : 'translate-x-0 border-gray-300',
            ]"
          ></label>
          <input
            type="checkbox"
            id="block"
            name="block"
            class="w-full h-full appearance-none focus:outline-none"
            @click="fields.block = !fields.block"
          />
        </div>
        <span class="ml-3 text-gray-500 text-sm font-medium">{{
          fields.block
            ? $t("episodeDetail.label.block_true")
            : $t("episodeDetail.label.block_false")
        }}</span>
      </div>
      <div class="flex flex-row mt-3">
        <div
          class="
            relative
            w-12
            h-6
            transition
            duration-200
            ease-linear
            rounded-2xl
          "
          :class="[fields.explicit ? 'bg-orange-300' : 'bg-gray-200']"
        >
          <label
            for="toggle"
            class="
              absolute
              left-0
              w-6
              h-6
              mb-2
              transition
              duration-100
              ease-linear
              transform
              bg-white
              border-2
              rounded-2xl
              cursor-pointer
            "
            :class="[
              fields.explicit
                ? 'translate-x-full border-orange-300'
                : 'translate-x-0 border-gray-300',
            ]"
          ></label>
          <input
            type="checkbox"
            id="toggle"
            name="toggle"
            class="w-full h-full appearance-none focus:outline-none"
            @click="fields.explicit = !fields.explicit"
          />
        </div>
        <span class="ml-3 text-gray-500 text-sm font-medium">{{
          fields.explicit
            ? $t("episodeDetail.label.explicit_true")
            : $t("episodeDetail.label.explicit_false")
        }}</span>
      </div>
      <div v-if="errors.length > 0" class="mt-5 ml-5 test-xs text-red-600">
        <p>{{ $t("episodeDetail.label.errors") }}</p>
        <ul class="ml-5">
          <li class="list-disc" v-for="err in errors">
            {{ $t("episodeDetail.validation." + err.text) }}
          </li>
        </ul>
      </div>
      <!-- Buttons -->
      <div class="flex flex-row justify-end">
        <button
          class="
            mt-5
            px-5
            h-10
            border-2
            rounded-md
            bg-gray-300
            hover:bg-gray-400
          "
          @click="cancel"
        >
          {{ $t("cancel") }}
        </button>
        <button
          v-if="fields.id && fields.id > 0"
          class="mt-5 px-5 h-10 border-2 rounded-md bg-red-200 hover:bg-red-400"
          @click="remove"
        >
          {{ $t("delete") }}
        </button>
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
          @click="save"
        >
          {{ $t("episodeDetail.saveEpisode") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { IID3Tag } from "id3-parser/lib/interface";
import { defineComponent, PropType } from "vue";
import Episode, { getEpisode } from "~~/backend/entities/Episode";
import Serie from "~~/backend/entities/Serie";
import { ImageMetadata } from "~~/backend/ImageMetadata";
import universalParse from "id3-parser/lib/universal/index.js";
import {
  durationInSecToStr,
  strToDurationInSec,
  strToDate,
  dateToIsoString,
  saveSlugFormText,
} from "~~/backend/Converters";
import validation from "~~/backend/EpisodeDetailValidation";
import {
  COUNT_AP,
  EPISODE_AP,
  SERVER_IMG_PATH,
  SERVER_MP3_PATH,
  UPLOAD_AP,
} from "~~/backend/Constants";
import Podcast from "~~/backend/entities/Podcast";

export default defineComponent({
  props: {
    episode: Object as PropType<Episode>,
    series: Object as PropType<Array<Serie>>,
    podcast: Object as PropType<Podcast>,
  },
  name: "EpisodeDetail",
  setup(props, ctx) {
    const imgMetadata = ref(new ImageMetadata());
    const serie_id = ref(-1);
    const errors = ref([]);
    const fields = ref(new Episode());
    const serie = ref(new Serie());

    watch(props.episode, (newValue, oldValue) => {
      // immediate: true,
      // deep: true,
      if (!newValue) return;
      fields.value = getEpisode(newValue);
      durationText.value = durationInSecToStr(fields.value.duration);
      if (fields.value.image && fields.value.image.length > 0) {
        imgMetadata.value.preview = fields.value.image;
        imgMetadata.value.imgWidth = 1400; // Workaround satisfying validation later
        imgMetadata.value.imgHeight = 1400;
      } else {
        //PODCAST image als defailt
        imgMetadata.value.preview = null;
        imgMetadata.value.imgWidth = 0;
        imgMetadata.value.imgHeight = 0;
      }
    });

    const isEdit = computed(() => fields.value.id != undefined);

    const hasError = (fieldname) => {
      return errors.value.find((error) => error.field === fieldname);
    };
    const getClass = (fieldname) => {
      var cssclass = "field";
      if (hasError(fieldname)) {
        cssclass = "field error";
      }
      return cssclass;
    };

    const generateSlug = () => {
      fields.value.slug = saveSlugFormText(fields.value.title);
    };

    const getFileInFormData = (path: string, fileObj: File) => {
      const fd = new FormData();
      if (fileObj) {
        fd.append("path", path + props.podcast.slug);
        fd.append("cover", fileObj, fileObj.name);
      }
      return fd;
    };

    const getFields = () => {
      var tmp = { ...fields.value };
      delete tmp.podcast.episodes;
      delete tmp.podcast.series;
      if (!fields.value.serie) delete tmp.serie;
      return tmp;
    };

    const save = async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      // collect fields
      fields.value.duration = strToDurationInSec(durationText.value);
      fields.value.pubdate = strToDate(pubdatetext.value);

      // validate fields
      errors.value = validation(
        fields.value,
        imgMetadata.value.imgWidth,
        imgMetadata.value.imgHeight
      );

      // server validation (if slug is unique)
      var count = await $fetch(COUNT_AP + "?slug=" + fields.value.slug);
      if (count > 0) errors.value.push({ field: "slug", text: "slug" });

      if (errors.value.length > 0) return;

      // set relations
      fields.value.serie =
        serie.value && "id" in serie.value ? serie.value : null;
      fields.value.podcast = props.podcast;

      // Upload Mp3
      var postResult = null;
      var postData = {
        method: "post",
        body: null,
      };
      if (audiofile.value) {
        postData.body = getFileInFormData(SERVER_MP3_PATH, audiofile.value);
        postResult = await $fetch(UPLOAD_AP, postData);
      }
      if (postResult.status == 201 && imgMetadata.value.selectedFile) {
        fields.value.link =
          SERVER_MP3_PATH + props.podcast.slug + "/" + audiofile.value.name;

        // Upload Image
        postData.body = getFileInFormData(
          SERVER_IMG_PATH,
          imgMetadata.value.selectedFile
        );
        postResult = await $fetch(UPLOAD_AP, postData);
      }
      if (postResult.status == 201) {
        fields.value.image =
          SERVER_IMG_PATH +
          props.podcast.slug +
          "/" +
          imgMetadata.value.selectedFile.name;

        // Episode Metadata
        postData.body = getFields();
        postResult = await $fetch(EPISODE_AP, postData);
      }
      if (postResult.status == 201) ctx.emit("onsaved", fields.value.title);
    };

    const cancel = async (event) => {
      ctx.emit("oncancel");
    };

    const remove = async (event) => {};

    watch(serie_id, (newVal, oldVal) => {
      serie.value = props.series.find((item) => item.id == newVal);
      fields.value.image = serie.value.cover_file;
      fields.value.keyword = serie.value.title;
      imgMetadata.value.preview = serie.value.cover_file;
    });

    const pubdatetext = ref(dateToIsoString(new Date()));

    watch(pubdatetext, (newVal, oldVal) => {
      fields.value.pubdate = strToDate(newVal);
    });

    const imageSelected = (data: ImageMetadata) => {
      fields.value.image = data.selectedFile.name;
      imgMetadata.value.preview = data.preview;
      imgMetadata.value.selectedFile = data.selectedFile;
      imgMetadata.value.imgWidth = data.imgWidth;
      imgMetadata.value.imgHeight = data.imgHeight;
    };

    function array2base64(data, format) {
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }
      return `data:${format};base64,${window.btoa(base64String)}`;
    }

    const durationText = ref("");

    watch(durationText, (newVal, oldVal) => {
      fields.value.duration = strToDurationInSec(newVal);
    });

    const mp3FileInput = ref(null);
    const chooseMp3File = () => {
      mp3FileInput.value.click();
    };

    var audiofile = ref(null);
    const audiofilename = computed(() => {
      if (audiofile.value) return audiofile.value.name;
      else return "";
    });

    const mp3FileSelected = async (event) => {
      audiofile.value = event.target.files[0];
      fields.value.duration = await getDuration(
        URL.createObjectURL(audiofile.value)
      );
      fields.value.pubdate = strToDate(audiofile.value.name);
      pubdatetext.value = dateToIsoString(fields.value.pubdate);
      try {
        durationText.value = durationInSecToStr(fields.value.duration);
        const id3tags = await universalParse(event.target.files[0]);
        if (id3tags.title) fileSelected(id3tags);
        if (id3tags.image)
          imgMetadata.value.preview = array2base64(
            id3tags.image.data,
            id3tags.image.mime
          );
      } catch {}
    };

    function getDuration(file) {
      return new Promise<number>((resolve, reject) => {
        var audio = new Audio();
        audio.addEventListener("loadeddata", () => {
          resolve(audio.duration);
        });
        audio.src = file;
      });
    }

    const fileSelected = (data: IID3Tag) => {
      fields.value.title = data.title;
      fields.value.keyword = data.album;
      fields.value.creator = data.artist;
      fields.value.summary = data["set-part"];
      generateSlug();
      if ("initial-key" in data)
        fields.value.external_id = Number(data["initial-key"]);
      serie.value = props.series.find(
        (item) => item.title === fields.value.keyword
      );
    };
    return {
      fields,
      series: props.series,
      getClass,
      hasError,
      errors,
      isEdit,
      save,
      cancel,
      remove,
      pubdatetext,
      durationText,
      generateSlug,
      imgMetadata,
      imageSelected,
      chooseMp3File,
      mp3FileInput,
      mp3FileSelected,
      audiofilename,
      serie_id,
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