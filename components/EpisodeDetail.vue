<template>
  <div
    class="px-10 w-full h-full"
    v-on:keyup.enter="save"
    v-on:keyup.esc="cancel"
  >
  <div class="w-full flex justify-center">
      <div
        class="mt-6 md:mt-12 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;{{
          isEdit
            ? $t("episode.edit")
            : $t("episode.new")
        }}&nbsp;
    </div>
  </div>
    <div class="flex flex-col">
      <div class="flex flex-row">
        <div>
          <image-selector
            :filename="fields.image"
            :preview="imgMetadata.preview"
            @imageSelected="imageSelected"
          />
        </div>
        <div class="flex flex-col">
          <audio-file-selector
            :audioFileName="fields.link"
            @audioFileSelected="audioFileSelected"
            :cssclass="getClass('file')"
          />
          <single-select :name="'serie'" :label="'episode.label.serie'" :options="series" :errors="errors" v-model:value="serie_id"/>
          <div class="mt-8 text-gray-600 text-ml">{{ podcast.title }}</div>
        </div>
      </div>
      <!-- Fields-->
      <input-area :name="'title'" :label="'episode.label.title'" :errors="errors" v-model:value="fields.title" />
      <input-area :name="'subtitle'" :label="'episode.label.subtitle'" :errors="errors" v-model:value="fields.subtitle" />
      <input-area :name="'keyword'" :label="'episode.label.keyword'" :errors="errors" v-model:value="fields.keyword" />
      <input-area :name="'pubdate'" :type="'date'" :label="'episode.label.pubdate'" :errors="errors" v-model:value="pubdateText" />
      <input-area :name="'duration'" :label="'episode.label.duration'" :errors="errors" v-model:value="durationText" />
      <input-area :name="'slug'" :disabled="isEdit" :label="'episode.label.slug'" :errors="errors" v-model:value="fields.slug" />
      <input-area :name="'creator'" :label="'episode.label.creator'" :errors="errors" v-model:value="fields.creator"/>
      <input-area :name="'summary'" :type="'textarea'" :label="'episode.label.summary'" :errors="errors" v-model:value="fields.summary" />
      <input-area :name="'description'" :type="'textarea'" :label="'episode.label.description'" :errors="errors" v-model:value="fields.description" />
      <switch-box 
          :checked="fields.block" 
          @checkedChanged="(val)=>fields.block=val" 
          :labelChecked="$t('episode.label.block_true')"
          :labelUnChecked="$t('episode.label.block_false')"
       />
      <switch-box 
          :checked="fields.explicit" 
          @checkedChanged="(val)=>fields.explicit=val" 
          :labelChecked="$t('episode.label.explicit_true')"
          :labelUnChecked="$t('episode.label.explicit_false')"
       />

      <div v-if="errors.length > 0" class="mt-5 ml-5 test-xs text-red-600">
        <p>{{ $t("episode.label.errors") }}</p>
        <ul class="ml-5">
          <li class="list-disc" v-for="(err, index) in errors" :key="index">
            {{$t(err.text)}}
          </li>
        </ul>
      </div>
      <!-- Buttons -->
      <div class="flex flex-row justify-end">
        <button
          class="
            ccf-button
            ccf-secondary
          "
          @click="cancel"
        >
          {{ $t("cancel") }}
        </button>
        <button
          class="
            ccf-button
            ccfbutton-border
           "
          @click="save"
        >
          {{ $t("episode.saveEpisode") }}
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
import { COUNT_AP, EPISODE_AP, FILES_AP, SERVER_IMG_PATH, SERVER_MP3_PATH, UPLOAD_AP } from "~~/base/Constants";
import IEnumerator from "~~/base/types/IEnumerator";
import episode from "~~/server/api/episode";

export default defineComponent({
  props: {
    episode: Object as PropType<IEpisode>,
    podcast: Object as PropType<IPodcast>,
    series: Object as PropType<Array<ISerie>>,
  },
  name: "episode",
  async setup(props, { emit }) {
    const errors = ref([] as Array<IValidationError>);    
    const fields = ref({...props.episode} as IEpisode);
    const isEdit = computed(() => (fields.value as any).id != undefined);
    const keepImage = ref(isEdit.value)

    function generateSlug(){
      if (!isEdit.value && fields.value.title)
        fields.value.slug = saveSlugFormText(fields.value.title);
    };

    watch(() => fields.value.title, () => generateSlug())

    var serie = (props.episode.serie?props.episode.serie:emptyISerieFactory());
    const serie_id = ref((serie.id?serie.id:0))
    watch ( serie_id, (newValue) => {
      serie = props.series.find((item) => item.id == newValue);
      if (!serie)
          return;
      fields.value.keyword = serie.title;
      if (!keepImage.value){
        fields.value.image = serie.cover_file;
        imgMetadata.value.preview = serie.cover_file;
        keepImage.value = true
      }
    })

    const audioMetadata = ref(new AudioFileMetadata())
    const audioFileSelected = (data: AudioFileMetadata) => {
      fields.value.link = data.selectedFile.name;
      fields.value.duration = data.duration;
      durationText.value = durationInSecToStr( fields.value.duration);
      fields.value.rawsize = data.size;
      for( var key in data.fields) {
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

    const durationText = ref(durationInSecToStr(fields.value.duration));
    watch(durationText, () => {
      fields.value.duration = strToDurationInSec(durationText.value);
    });

    const pubdateText = ref(dateToIsoString(new Date()));
    watch(pubdateText, (newVal, oldVal) => {
      fields.value.pubdate = strToDate(newVal);
    });
    const imgMetadata = ref(new ImageMetadata());
    function imageSelected(data: ImageMetadata) {
      imgMetadata.value.imgHeight = data.imgHeight;
      imgMetadata.value.imgWidth = data.imgWidth;
      imgMetadata.value.selectedFile = data.selectedFile;
      imgMetadata.value.preview = data.preview;
      if (data.imgWidth==0) {
        fields.value.image = "";
        keepImage.value = false
      } else {
        keepImage.value = true
      }
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
        fd.append("filename", fileObj.name);
      }
      return fd;
    }

    function extention(type: string) : string {
      if (type.includes("png")) return ".png"
      if (type.includes("gif")) return ".gif"
      return ".jpg"
    }

    function getBufferInFormData(path: string, blob: Blob) {
      const fd = new FormData();
      fd.append("path", path + props.podcast?.slug);
      fd.append('cover', blob, props.podcast?.slug+extention(blob.type));
      fd.append('filename', props.podcast?.slug+extention(blob.type));
      return fd
    }

    async function upload(server_path: string, fileObj: File, blob: Blob|undefined = undefined) {
      var linkToContent = "";
      var postResult = null;
      var postData = {
        method: "post",
        body: null as any,
      };
      if (fileObj) 
        postData.body = getFileInFormData(server_path, fileObj)
      else if (blob)
        postData.body = getBufferInFormData(server_path, blob)
      if (postData.body) {
        try  {
          postResult = await $fetch(UPLOAD_AP, postData);
          } catch (err) {
            postResult.status = 500
          }
      }
      if (postResult.status == 201 && (fileObj || blob)) {
        linkToContent =
          server_path + props.podcast.slug + "/" + (postData.body as FormData).get('filename');
      }
      return {
        link: linkToContent,
        result: postResult,
        nothingToDo: !fileObj && !blob,
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
          (isEdit.value?"&excludeId="+fields.value.id:"")
      var count : number = await $fetch(countUrl);
      if (count > 0) errors.value.push({ field: "slug", text: "episode.validation.slug" });

      if (errors.value.length > 0) return;

      // set relations
      fields.value.serie =
        serie && "id" in serie ? serie : null;
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
      if (imgMetadata.value.selectedFile || imgMetadata.value.blob!=undefined) {
      var {result, link, nothingToDo} = await upload(SERVER_IMG_PATH, imgMetadata.value.selectedFile, imgMetadata.value.blob)
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
      emit("save", fields.value.title);
    }
    function remove() {
      emit("remove");
    }
    function cancel() {
      emit("cancel");
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
      series: props.series.map((s) => {return { "enumvalue_id": s.id, "displaytext": s.title } as Partial<IEnumerator>}),
      save,
      remove,
      cancel,
    };
  }
})
</script>