<template>
  <div class="w-full h-full" :class="(uploadIndicator ? 'overflow-hidden' : 'overflow-auto')" v-on:keyup.enter="save"
    v-on:keyup.esc="cancel">
    <Spinner :active="uploadIndicator">Uploading ...</Spinner>
    <div class="flex justify-center w-full mt-6 md:mt-12">
      <BaseH1>
        {{
  isEdit
  ? $t("episode.edit")
    : $t("episode.new")
        }}
      </BaseH1>
    </div>
    <div
      class="flex flex-col content-center justify-center w-full mb-8 md:mb-10 text-skin-muted dark:text-skin-muted-dark">
      <div class="mt-2 tracking-widest text-center text-ml">{{ $t('episode.forpodcast') }}</div>
      <div v-if="podcast" class="mt-1 tracking-widest text-center text-ml">{{ podcast.title }}</div>
    </div>
      <div class="flex flex-col w-full">
        <div class="flex flex-col w-full lg:flex-row">
          <div>
            <image-selector :filename="fields.image" :preview="imgMetadata.preview" @imageSelected="imageSelected" />
          </div>
          <div class="flex flex-col flex-grow w-full">
            <audio-file-selector :audioFileName="fields.link" @audioFileSelected="audioFileSelected" :error="errors"
              :label="'episode.label.file'" />
            <single-select :name="'serie'" :label="'episode.label.serie'" :options="series_options" :errors="errors"
              v-model:value="serie_id" />
          </div>
        </div>
        <!-- Fields-->
        <input-area :name="'title'" :label="'episode.label.title'" :errors="errors" v-model:value="fields.title" />
        <input-area :name="'subtitle'" :label="'episode.label.subtitle'" :errors="errors"
          v-model:value="fields.subtitle" />
        <input-area :name="'keyword'" :label="'episode.label.keyword'" :errors="errors"
          v-model:value="fields.keyword" />
        <input-area :name="'pubdate'" :type="'date'" :label="'episode.label.pubdate'" :errors="errors"
          v-model:value="pubdateText" />
        <input-area :name="'duration'" :label="'episode.label.duration'" :errors="errors"
          v-model:value="durationText" />
        <input-area :name="'slug'" :disabled="isEdit" :label="'episode.label.slug'" :errors="errors"
          v-model:value="fields.slug" />
        <input-area :name="'creator'" :label="'episode.label.creator'" :errors="errors" v-model:value="fields.creator"
          @change="setShortInfo" />
        <input-area :name="'summary'" :type="'textarea'" :label="'episode.label.summary'" :errors="errors"
          v-model:value="fields.summary" />
        <input-area :name="'description'" :type="'textarea'" :label="'episode.label.description'" :errors="errors"
          v-model:value="fields.description" />
        <switch-box :checked="fields.block" @checkedChanged="(val) => fields.block = val"
          :labelChecked="$t('episode.label.block_true')" :labelUnChecked="$t('episode.label.block_false')" />
        <switch-box :checked="fields.explicit" @checkedChanged="(val) => fields.explicit = val"
          :labelChecked="$t('episode.label.explicit_true')" :labelUnChecked="$t('episode.label.explicit_false')" />
        <input-area :name="'cross_ref'" :label="'episode.label.cross_ref'" v-model:value="(fields.cross_ref)"
          @change="setShortInfo" />
        <input-area :name="'video_link'" :label="'episode.label.video_link'" v-model:value="fields.video_link"
          @change="setShortInfo" />
        <switch-box :checked="fields.draft" @checkedChanged="(val) => fields.draft = val"
          :labelChecked="$t('episode.label.draft_true')" :labelUnChecked="$t('episode.label.draft_false')" />

        <div v-if="errors.length > 0" class="mt-5 ml-5 text-red-600 test-xs">
          <p>{{ $t("episode.label.errors") }}</p>
          <ul class="ml-5">
            <li class="list-disc" v-for="(err, index) in errors" :key="index">
              {{ $t(err.text) }}
            </li>
          </ul>
        </div>
        <!-- Buttons -->
        <div class="flex flex-row justify-end pb-10">
          <BaseButtonSecondary class="mr-4" @click="cancel">
            {{ $t("cancel") }}
          </BaseButtonSecondary>
          <BaseButtonPrimary @click="save">
            {{ $t("episode.saveEpisode") }}
          </BaseButtonPrimary>
        </div>
      </div>
  </div>
</template>
<script lang="ts">
import type { PropType } from "vue";
import {
  dateToIsoString,
  strToDurationInSec,
  strToDate,
  saveSlugFormText,
  durationInSecToStr,
  getSaveFilename,
} from "~~/base/Converters";
import type IPodcast from "~~/base/types/IPodcast";
import type IEpisode from "~~/base/types/IEpisode";
import validation from "~~/base/EpisodeDetailValidation";
import type ISerie from "../base/types/ISerie";
import { emptyISerieFactory } from "../base/types/ISerie";
import AudioFileMetadata from "~~/base/types/AudioFileMetadata";
import ImageMetadata from "~~/base/types/ImageMetadata";
import type IValidationError from "~~/base/types/IValidationError";
import { COUNT_AP, EPISODE_AP, FILES_AP, SERIE_AP, SERVER_IMG_PATH, SERVER_MP3_PATH, UPLOAD_AP } from "~~/base/Constants";
import type IEnumerator from "~~/base/types/IEnumerator";
import { ContentFile } from "~/base/ContentFile";

export default defineComponent({
  props: {
    episode: Object as PropType<IEpisode>,
    podcast: Object as PropType<IPodcast>,
    series: {
      type: Array<ISerie>,
      default: []
    }
  },
  name: "episode",
  async setup(props, { emit }) {
    const myFetch = useFetchApi()
    const errors = ref([] as Array<IValidationError>);
    const fields = ref({ ...props.episode } as IEpisode);
    if (!fields.value.cross_ref) fields.value.cross_ref = ''
    if (!fields.value.video_link) fields.value.video_link = ''
    const isEdit = computed(() => (fields.value as any).id != undefined);
    const uploadIndicator = ref(false)
    const keepImage = ref(isEdit.value)

    function generateSlug() {
      if (!isEdit.value && fields.value.title)
        fields.value.slug = saveSlugFormText(fields.value.title);
    };

    watch(() => fields.value.title, () => generateSlug())

    var serie = (props.episode.serie ? props.episode.serie : emptyISerieFactory());
    const serie_id = ref((serie.id ? serie.id : 0))
    const previousSeries_id = serie_id.value
    watch(serie_id, (newValue) => {
      serie = props.series.find((item) => item.id == newValue);
      if (!serie)
        return;
      fields.value.keyword = serie.title;
      fields.value.image = serie.cover_file;
      imgMetadata.value.preview = ContentFile.getMediaUrl(serie.cover_file);
      keepImage.value = true
    })

    const audioMetadata = ref(new AudioFileMetadata())
    const audioFileSelected = async (data: AudioFileMetadata) => {
      fields.value.link = data.selectedFile.name;
      fields.value.duration = data.duration;
      durationText.value = durationInSecToStr(fields.value.duration);
      fields.value.rawsize = data.size;
      for (var key in data.fields) {
        if (data.fields[key])
          fields.value[key] = data.fields[key]
      }
      if (!keepImage.value) {
        imgMetadata.value.blob = data.imgblob
        imgMetadata.value.preview = data.cover_preview 
        keepImage.value = true
      }
      audioMetadata.value = { ...data }
      generateSlug()
    };

    const setShortInfo = () => {
      fields.value.summary = "<p> " + fields.value.cross_ref + (fields.value.creator ? " // " + fields.value.creator : "") +
        (fields.value.video_link ? " // <a href='" + fields.value.video_link + "'>Video Version</a></p>" : "</p>")
    }

    const durationText = ref(durationInSecToStr(fields.value.duration));
    watch(durationText, () => {
      fields.value.duration = strToDurationInSec(durationText.value);
    });

    const pubdateText = ref((isEdit ? dateToIsoString(new Date(fields.value.pubdate)) : dateToIsoString(new Date())))
    watch(pubdateText, (newVal, oldVal) => {
      fields.value.pubdate = strToDate(newVal);
    });

    const imgMetadata = ref(new ImageMetadata());
    function imageSelected(data: ImageMetadata) {
      imgMetadata.value.imgHeight = data.imgHeight;
      imgMetadata.value.imgWidth = data.imgWidth;
      imgMetadata.value.selectedFile = data.selectedFile;
      imgMetadata.value.preview = data.preview;
      imgMetadata.value.blob = data.blob;
      if (data.imgWidth == 0) {
        fields.value.image = "";
        keepImage.value = false
      } else {
        keepImage.value = true
      }
    };

    function getFields() {
      var tmp = { ...fields.value };
      if (!fields.value.podcast?.episodes) delete tmp.podcast?.episodes;
      if (!fields.value.serie) delete tmp.serie;
      return tmp;
    };

    function getFileInFormData(path: string, fileObj: File) {
      const fd = new FormData();
      if (fileObj) {
        fd.append("path", path + props.podcast?.slug);
        const fn = getSaveFilename(fileObj.name)
        fd.append("filename", fn);
        fd.append("cover", fileObj, fileObj.name);
      }
      return fd;
    }

    function extention(type: string): string {
      if (type.includes("png")) return ".png"
      if (type.includes("gif")) return ".gif"
      return ".jpg"
    }

    function getBufferInFormData(path: string, blob: Blob) {
      const fd = new FormData();
      fd.append("path", path + props.podcast?.slug);
      fd.append('cover', blob, fields.value.slug + extention(blob.type));
      fd.append('filename', fields.value.slug + extention(blob.type));
      return fd
    }

    async function upload(server_path: string, fileObj: File | undefined, blob: Blob | undefined = undefined) {
      var linkToContent = "";
      var postResult: any;
      var postData = {
        method: "post",
        body: null as any,
      };
      if (fileObj)
        postData.body = getFileInFormData(server_path, fileObj)
      else if (blob)
        postData.body = getBufferInFormData(server_path, blob)
      if (postData.body) {
        try {
          postResult = await myFetch(  UPLOAD_AP, postData);
        } catch (err) {
          postResult.statusCode = 500
        }
      }
      if (postResult.statusCode == 201 && (fileObj || blob)) {
        linkToContent =
          server_path + props.podcast?.slug + "/" + (postData.body as FormData).get('filename');
      }
      return {
        link: linkToContent,
        result: postResult,
        nothingToDo: !fileObj && !blob,
      }
    }

    async function doTheSaving() {
      try {
      // set relations
      fields.value.serie =
        serie && "id" in serie ? serie : null;
      fields.value.podcast = props.podcast;

      // Upload Mp3
      if (audioMetadata.value.selectedFile) {
        var { result, link } = await upload(SERVER_MP3_PATH, audioMetadata.value.selectedFile)
        if (result.statusCode != 201) {
          errors.value.push({ field: "", text: "episode.validation.upload" })
          return
        }
        fields.value.link = link;
      }


      // Upload Image
      if (!imgMetadata.value.preview.endsWith(serie.cover_file) && (imgMetadata.value.selectedFile || audioMetadata.value.imgblob != undefined)) {
        var { result, link, nothingToDo } = await upload(SERVER_IMG_PATH, imgMetadata.value.selectedFile, audioMetadata.value.imgblob)
        if (result.statusCode != 201) {
          errors.value.push({ field: "", text: "episode.validation.upload" })
          return
        } 
        fields.value.image = link;
      }

      // Episode Metadata
      const postData = {
        method: "post",
        body: getFields()
      }
      result = await myFetch( EPISODE_AP, postData);
      if (result.statusCode != 201) {
        errors.value.push({ field: "", text: "saving" })
        return
      }
      if (serie_id != previousSeries_id && previousSeries_id > 0) {
        const slug = await myFetch( SERIE_AP, { method: "post", body: { id: previousSeries_id } })
          ; (await useSerie(slug)).refresh()
      }
      emit("save", fields.value.title);
    } catch (err) {
      console.log(err)
    } finally {
      hideIdicator()
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
      var countUrl = COUNT_AP + "?slug=" + fields.value.slug +
        (isEdit.value ? "&excludeId=" + fields.value.id : "")
      var count: number = await myFetch( countUrl);
      if (count > 0) errors.value.push({ field: "slug", text: "episode.validation.slug" });

      if (errors.value.length > 0) return;

      showIdicator()
      doTheSaving()
    }

    function showIdicator() {
      document.documentElement.style.overflow = 'hidden'
      uploadIndicator.value = true
    }
    function hideIdicator() {
      uploadIndicator.value = false
      document.documentElement.style.overflow = 'auto'
    }

    function remove() {
      emit("remove");
    }
    function cancel() {
      emit("episode-cancel");
    }
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
    const series_options = ref(props.series.map((s) => { return { "enumvalue_id": s.id, "displaytext": s.title } as Partial<IEnumerator> }))
    return {
      isEdit,
      imageSelected,
      imgMetadata,
      audioFileSelected,
      serie_id,
      fields,
      uploadIndicator,
      generateSlug,
      setShortInfo,
      durationText,
      pubdateText,
      errors,
      getClass,
      series_options,
      save,
      remove,
      cancel,
    };
  }
})
</script>