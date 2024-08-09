<template>
  <PageFormDetail type="serie" :fields="fields" @frmsave="save" @frmremove="remove" @frmcancel="cancel">
    <ImageSelector :filename="fields.cover_file" :preview="imgMetadata.preview" @imageSelected="imageSelected" />
    <!-- Fields-->
    <InputArea :name="'title'" :label="'serie.label.title'" :errors="errors" v-model:value="fields.title" />
    <InputArea :name="'subtitle'" :label="'serie.label.subtitle'" :errors="errors" v-model:value="fields.subtitle" />
    <InputArea :name="'slug'" :disabled="isEdit" :label="'serie.label.slug'" :errors="errors"
      v-model:value="fields.slug" />
    <InputArea :name="'description'" :type="'textarea'" :label="'serie.label.description'" :errors="errors"
      v-model:value="fields.description" />
    <SwitchBox :checked="fields.draft" @checkedChanged="(val) => fields.draft = val"
      :labelChecked="$t('serie.label.draft_true')" :labelUnChecked="$t('serie.label.draft_false')" />
    <div v-if="errors.length > 0" class="mt-5 ml-5 text-red-600 test-xs">
      <p>{{ $t("serie.label.errors") }}</p>
      <ul class="ml-5">
        <li class="list-disc" v-for="(err, index) in errors" :key="index">
          {{ $t(err.text) }}
        </li>
      </ul>
    </div>
  </PageFormDetail>
</template>
<script lang="ts">
import type { PropType } from "vue";
import {
  saveSlugFormText,
} from "~~/base/Converters";
import validation from "~~/base/SeriesDetailValidation";
import type ISerie from "../base/types/ISerie";
import ImageMetadata from "~~/base/types/ImageMetadata";
import type IValidationError from "~~/base/types/IValidationError";
import { COUNT_AP, SERIES_AP, SERIES_IMG_PATH, SERVER_IMG_PATH } from "~~/base/Constants";

export default defineComponent({
  props: {
    serie: Object as PropType<ISerie>,
  },
  name: "SerieDetail",
  async setup(props, { emit }) {
    const myFetch = useFetchApi()
    const errors = ref([] as Array<IValidationError>);

    const fields = ref({ ...props.serie } as ISerie);
    const isEdit = computed(() => (fields.value as any).id != undefined);

    function generateSlug() {
      if (!isEdit.value && fields.value.title)
        fields.value.slug = saveSlugFormText(fields.value.title);
    };

    watch(() => fields.value.title, () => generateSlug())

    const imgMetadata = ref(new ImageMetadata());
    function imageSelected(data: ImageMetadata) {
      imgMetadata.value = { ...data };
      console.log(data)
      if (data.imgWidth == 0) {
        fields.value.cover_file = "";
      }
    };

    function getFields() {
      var tmp = { ...fields.value };
      delete tmp.episodes
      return tmp;
    };

    async function save() {
       // validate fields
      errors.value = validation(
        fields.value,
        imgMetadata.value.imgWidth,
        imgMetadata.value.imgHeight
      );

      // server validation (if slug is unique)
      if (fields.value.slug !== props.serie?.slug) {
        var countUrl = COUNT_AP + "?slug=" + fields.value.slug + "&serie=true" +
          (isEdit.value ? "&excludeId=" + fields.value.id : "")
        var count = await myFetch(countUrl) as number;
        if (count > 0) errors.value.push({ field: "slug", text: "serie.validation.slug" });
      }

      if (errors.value.length > 0) return;

      // Upload Image
      const upload = useUploader()
      var { result, link, nothingToDo } = await upload(SERVER_IMG_PATH+SERIES_IMG_PATH, imgMetadata.value.selectedFile)
      console.log(JSON.stringify(result))
      if (!nothingToDo) {
        if ((result as any).statusCode != 201) {
          errors.value.push({ field: "", text: "upload" })
          return
        }
        fields.value.cover_file = link;
      }

      // Episode Metadata
      const postData = {
        method: "post",
        body: [getFields()]
      }
      result = await myFetch( SERIES_AP, postData) as any;
      if ((result as any).statusCode != 201) {
        errors.value.push({ field: "", text: "saving" })
        return
      }
      emit("save", fields.value.slug);
    }
    function remove() {
      emit("remove");
    }
    function cancel() {
      emit("cancel");
    }
    function hasError(fieldname: string) {
      return errors.value.find((error) => error.field === fieldname);
    };
    function getClass(fieldname: string) {
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
