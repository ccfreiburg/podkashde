import { booleanLiteral } from "@babel/types";
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
          <image-selector
            :filename="fields.image"
            @imageSelected="imageSelected"
          />
        </div>
        <div class="flex flex-col">
          <audio-file-selector
            :audioFileName="fields.link"
            @audioFileSelected="audioFileSelected"
            :cssclass="getClass('file')"
          />
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
      <div class="text-sm">{{ podcast.title }}</div>
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
        <input class="field" type="date" name="pubdate" v-model="pubdateText" />
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
        <input :disabled="isEdit" :class="getClass('slug')" type="text" name="slug" v-model="fields.slug" />
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
      <switch-box 
          :checked="fields.block" 
          @checkedChanged="(val)=>fields.block=val" 
          :labelChecked="$t('episodeDetail.label.block_true')"
          :labelUnChecked="$t('episodeDetail.label.block_false')"
       />
      <switch-box 
          :checked="fields.explicit" 
          @checkedChanged="(val)=>fields.explicit=val" 
          :labelChecked="$t('episodeDetail.label.explicit_true')"
          :labelUnChecked="$t('episodeDetail.label.explicit_false')"
       />

      <div v-if="errors.length > 0" class="mt-5 ml-5 test-xs text-red-600">
        <p>{{ $t("episodeDetail.label.errors") }}</p>
        <ul class="ml-5">
          <li class="list-disc" v-for="(err, index) in errors" :key="index">
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
          v-if="'id' in fields && fields['id'] > 0"
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
import { PropType } from "vue";
import {
  dateToIsoString,
  strToDurationInSec,
  strToDate,
  saveSlugFormText,
  durationInSecToStr,
} from "~~/base/Converters";
import IPodcast from "~~/base/types/IPodcast";
import IEpisode from "~~/base/types/IEpisode";
import validation from "~~/base/EpisodeDetailValidation";
import ISerie, { emptyISerieFactory } from "../base/types/ISerie";
import AudioFileMetadata from "~~/base/types/AudioFileMetadata";
import ImageMetadata from "~~/base/types/ImageMetadata";
import IValidationError from "~~/base/types/IValidationError";
import { COUNT_AP, EPISODE_AP, SERVER_IMG_PATH, SERVER_MP3_PATH, UPLOAD_AP } from "~~/base/Constants";

export default defineComponent({
  props: {
    episode: Object as PropType<IEpisode>,
    podcast: Object as PropType<IPodcast>,
    series: Object as PropType<Array<ISerie>>,
  },
  name: "EpisodeDetail",
  async setup(props, { emit }) {
    const errors = ref([] as Array<IValidationError>);
    const generateSlug = () => {
      if (!isEdit)
        fields.value.slug = saveSlugFormText(fields.value.title);
    };

    const fields = ref({...props.episode} as IEpisode);

    const serie = ref<ISerie>((props.episode.serie?props.episode.serie:emptyISerieFactory()));
    const serie_id = ref(serie.value.id);
    watch(serie_id, (newVal, oldVal) => {
      serie.value = props.podcast.series.find((item) => item.id == newVal);
      fields.value.keyword = serie.value.title;
      if (fields.value.image.length<1){
        fields.value.image = serie.value.cover_file;
        imgMetadata.value.preview = serie.value.cover_file;
      }
    });

    const audioMetadata = ref(new AudioFileMetadata())
    const audioFileSelected = (data: AudioFileMetadata) => {
      fields.value.link = data.selectedFile.name;
      audioMetadata.value = { ...data };
    };

    const durationText = ref(durationInSecToStr( fields.value.duration));
    watch(durationText, () => {
      fields.value.duration = strToDurationInSec(durationText.value);
    });

    const pubdateText = ref(dateToIsoString(new Date()));
    watch(pubdateText, (newVal, oldVal) => {
      fields.value.pubdate = strToDate(newVal);
    });
    const imgMetadata = ref(new ImageMetadata());
    function imageSelected(data: ImageMetadata) {
      imgMetadata.value = { ...data };
    };
  
    function getFields() {
      var tmp = { ...fields.value };
      delete tmp.podcast.episodes;
      delete tmp.podcast.series;
      if (!fields.value.serie) delete tmp.serie;
      return tmp;
    };

    function getFileInFormData(path: string, fileObj: File) {
      const fd = new FormData();
      if (fileObj) {
        fd.append("path", path + props.podcast.slug);
        fd.append("cover", fileObj, fileObj.name);
      }
      return fd;
    }

    async function upload(server_path: string, fileObj: File) {
      var linkToContent = "";
      var postResult = null;
      var postData = {
        method: "post",
        body: null,
      };
      if (fileObj) {
        postData.body = getFileInFormData(server_path, fileObj);
        postResult = await $fetch(UPLOAD_AP, postData);
      }
      if (postResult.status == 201 && fileObj) {
        linkToContent =
          server_path + props.podcast.slug + "/" + fileObj.name;
      }
      return {
        link: linkToContent,
        result: postResult,
        nothingToDo: !fileObj,
      }
    }

    async function save(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      // collect fields
      fields.value.duration = strToDurationInSec(durationText.value);
      fields.value.pubdate = strToDate(pubdateText.value);

      // validate fields
      errors.value = validation(
        fields.value,
        imgMetadata.value.imgWidth,
        imgMetadata.value.imgHeight
      );

      // server validation (if slug is unique)
      if (!isEdit) {
        var count = await $fetch(COUNT_AP + "?slug=" + fields.value.slug);
        if (count > 0) errors.value.push({ field: "slug", text: "slug" });
      }

      if (errors.value.length > 0) return;

      // set relations
      fields.value.serie =
        serie.value && "id" in serie.value ? serie.value : null;
      fields.value.podcast = props.podcast;

      // Upload Mp3
      if (audioMetadata.value.selectedFile) {
      var {result, link} = await upload(SERVER_MP3_PATH, audioMetadata.value.selectedFile)
        if (result.status != 201) {
          errors.value.push({field:"", text:"upload"})
          return
        }
        fields.value.link = link;
      }

      // Upload Image
      if (imgMetadata.value.selectedFile) {
      var {result, link, nothingToDo} = await upload(SERVER_IMG_PATH, imgMetadata.value.selectedFile)
        if (result.status != 201) {
          errors.value.push({field:"", text:"upoad"})
          return
        }
        fields.value.image = link;
      }

      // Episode Metadata
      const postData = {
        method: "post",
        body: getFields()
      }
      result = await $fetch(EPISODE_AP, postData);
      if (result.status != 201) {
        errors.value.push({field:"", text:"saving"})
        return
      }
      emit("onsaved", fields.value.title);
    }
    function remove() {
      emit("ondelete");
    }
    function cancel() {
      emit("oncancel");
    }
    const isEdit = computed(() => (fields.value as any).id != undefined);
    function hasError(fieldname) {
      return errors.value.find((error) => error.field === fieldname);
    };
    function getClass(fieldname) {
      var cssclass = "field";
      if (hasError(fieldname)) {
        cssclass = "field error";
      }
      return cssclass;
    };
    return {
      isEdit,
      imageSelected,
      imgMetadata,
      audioFileSelected,
      serie_id,
      fields,
      generateSlug,
      durationText,
      pubdateText,
      errors,
      getClass,
      save,
      remove,
      cancel,
    };
  }
})
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