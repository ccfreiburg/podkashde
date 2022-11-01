import { booleanLiteral } from "@babel/types";
<template>
  <FormDetail type="serie" :fields="fields" @save="save" @delete="remove" @cancel="cancel">
    <div class="flex flex-col">
      <div class="flex flex-row">
        <div>
          <image-selector
            :filename="fields.cover_file"
            :preview="imgMetadata.preview"
            @imageSelected="imageSelected"
          />
        </div>
      </div>
      <!-- Fields-->
      <input-area :name="'title'" :label="'serie.label.title'" :errors="errors" v-model:value="fields.title" />
      <input-area :name="'subtitle'" :label="'serie.label.subtitle'" :errors="errors" v-model:value="fields.subtitle" />
      <input-area :name="'slug'" :disabled="isEdit" :label="'serie.label.slug'" :errors="errors" v-model:value="fields.slug" />
      <input-area :name="'description'" :type="'textarea'" :label="'serie.label.description'" :errors="errors" v-model:value="fields.description" />

      <div v-if="errors.length > 0" class="mt-5 ml-5 test-xs text-red-600">
        <p>{{ $t("serie.label.errors") }}</p>
        <ul class="ml-5">
          <li class="list-disc" v-for="(err, index) in errors" :key="index">
            {{$t(err.text)}}
          </li>
        </ul>
      </div>
    </div>
      <!-- Buttons -->
  </FormDetail>
</template>
<script lang="ts">
import { PropType } from "vue";
import {
  saveSlugFormText,
} from "~~/base/Converters";
import validation from "~~/base/SeriesDetailValidation";
import ISerie from "../base/types/ISerie";
import ImageMetadata from "~~/base/types/ImageMetadata";
import IValidationError from "~~/base/types/IValidationError";
import { COUNT_AP, FILES_AP, SERIES_AP, SERIES_IMG_PATH, SERVER_IMG_PATH, UPLOAD_AP } from "~~/base/Constants";

export default defineComponent({
  props: {
    serie: Object as PropType<ISerie>,
  },
  name: "SerieDetail",
  async setup(props, { emit }) {
    const errors = ref([] as Array<IValidationError>);

    const fields = ref({...props.serie} as ISerie);
    const isEdit = computed(() => (fields.value as any).id != undefined);

    function generateSlug(){
      if (!isEdit.value && fields.value.title)
        fields.value.slug = saveSlugFormText(fields.value.title);
    };

    watch(() => fields.value.title, () => generateSlug())

    const imgMetadata = ref(new ImageMetadata());
    function imageSelected(data: ImageMetadata) {
      imgMetadata.value = { ...data };
      if (data.imgWidth==0) {
        fields.value.cover_file = "";     
      } 
    };
  
    function getFields() {
      var tmp = { ...fields.value };

      return tmp;
    };

    function getFileInFormData(fileObj: File, path) {
      const fd = new FormData();
      if (fileObj) {
        fd.append("cover", fileObj, fileObj.name);
        fd.append("path", path )
      }
      return fd;
    }

    async function upload(server_path: string, fileObj: File) {
      var linkToContent = "";
      const path = server_path + SERIES_IMG_PATH ;
      var postResult = null;
      var postData = {
        method: "post",
        body: null,
      };
      if (fileObj) {
        postData.body = getFileInFormData(fileObj, path);
        postResult = await $fetch(UPLOAD_AP, postData);
      }
      if (postResult.status == 201 && fileObj) {
        linkToContent = path + "/" + fileObj.name;
      }
      return {
        link: linkToContent,
        result: postResult,
        nothingToDo: !fileObj,
      }
    }

    async function save(event) {
      if (imgMetadata.value.selectedFile) {
        fields.value.cover_file = FILES_AP+
          SERVER_IMG_PATH +
          SERIES_IMG_PATH +
          "/" +
          imgMetadata.value.selectedFile.name;
      }
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

      // Upload Image
      if (imgMetadata.value.selectedFile) {
      var {result, link, nothingToDo} = await upload(SERVER_IMG_PATH, imgMetadata.value.selectedFile)
        if (result.status != 201) {
          errors.value.push({field:"", text:"upoad"})
          return
        }
        fields.value.cover_file = FILES_AP+link;
      }

      // Episode Metadata
      const postData = {
        method: "post",
        body: [ getFields() ]
      }
      result = await $fetch(SERIES_AP, postData);
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
      fields,
      generateSlug,
      errors,
      getClass,
      save,
      remove,
      cancel,
    };
  }
})
</script>   
