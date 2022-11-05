<template>
  <div
    v-if="fields"
    class="px-10 w-full h-full"
    v-on:keyup.enter="savePodcast"
    v-on:keyup.esc="cancel"
  >
    <div class="w-full flex justify-center">
      <div
        class="mt-6 md:mt-12 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;{{
          isEdit
            ? $t("podcast.edit")
            : $t("podcast.new")
        }}&nbsp;
    </div>
  </div>
    <image-selector :filename="fields.cover_file" @imageSelected="imageSelected" />
    <!-- Fields-->
    <div class="flex flex-col">
      <input-area :name="'title'" :label="'podcast.label.title'" :errors="errors" v-model:value="fields.title" />
      <input-area :name="'subtitle'" :label="'podcast.label.subtitle'" :errors="errors" v-model:value="fields.subtitle" />
      <input-area :name="'slug'" :label="'podcast.label.slug'" :errors="errors" v-model:value="fields.slug" />
      <input-area :name="'author'" :label="'podcast.label.author'" :errors="errors" v-model:value="fields.author" />
      <input-area :name="'summary'" :type="'textarea'" :label="'podcast.label.summary'" :errors="errors" v-model:value="fields.summary" />
      <input-area :name="'description'" :type="'textarea'" :label="'podcast.label.description'" :errors="errors" v-model:value="fields.description" />
      <single-select :name="'language'" :label="'podcast.label.language'" :options="enumerations.languages" :errors="errors" v-model:value="fields.language_id" />
      <single-select :name="'category'" :label="'podcast.label.category'" :options="enumerations.podcastGenres" :errors="errors" :long="true" v-model:value="fields.category_id" />
      <single-select :name="'type'" :label="'podcast.label.type'" :options="enumerations.podcastTypes" :errors="errors" v-model:value="fields.type_id" />
      <div class="my-3"> 
      <switch-box 
          :checked="fields.explicit" 
          @checkedChanged="(val)=>fields.explicit=val" 
          :labelChecked="$t('podcast.label.explicit_true')"
          :labelUnChecked="$t('podcast.label.explicit_false')"
        />
      </div>
      <input-area :name="'link'" :label="'podcast.label.link'" :errors="errors" v-model:value="fields.link" />
      <input-area :name="'copyright'" :label="'podcast.label.copyright'" :errors="errors" v-model:value="fields.copyright" />
      <input-area :name="'owner_name'" :label="'podcast.label.owner_name'" :errors="errors" v-model:value="fields.owner_name" />
      <input-area :name="'owner_email'" :label="'podcast.label.owner_email'" :errors="errors" v-model:value="fields.owner_email" />

      <div v-if="errors.length > 0" class="mt-5 ml-5 test-xs text-red-600">
        <p>{{ $t("podcast.label.errors") }}</p>
        <ul class="ml-5">
          <li class="list-disc" v-for="(err, index) in errors" :key="index">
            {{ $t(err.text) }}
          </li>
        </ul>
      </div>
      <!-- Buttons -->
      <div class="flex flex-row justify-end">
        <button
          class="ccf-button ccf-secondary"
          @click="cancel"
        >
          {{ $t("cancel") }}
        </button>
        <button
          v-if="fields.id && fields.id > 0"
          class="
            ccf-button
            ccf-alert 
          "
          @click="deletePodcast"
        >
          {{ $t("delete") }}
        </button>
        <button
          class="
            ccf-button
            ccfbutton-border
          "
          @click="savePodcast"
        >
          {{ $t("podcast.savePodcast") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PODCAST_AP, UPLOAD_AP, SERVER_IMG_PATH, FILES_AP } from "~~/base/Constants";
import IPodcast from "~~/base/types/IPodcast";
import IPostdata from "~~/base/types/IPostdata";
import validation from "~~/base/PodcastDetailValidation";
import ImageMetadata from "~~/base/types/ImageMetadata";
import IValidationError from "~~/base/types/IValidationError";
import { saveSlugFormText } from "~~/base/Converters";

export default defineComponent({
  props: {
    podcast: Object as PropType<IPodcast>,
  },
  name: "podcast",
  async setup(props, ctx) {
    const imgMetadata = ref(new ImageMetadata());
    const errors = ref([] as Array<IValidationError>);
    const { enumerations } = await useEnumerations();
    const fields = ref({...props.podcast} as IPodcast);

    const isEdit = computed(() => {
      return fields.value.id && fields.value.id;
    })

    function hasError(errors, fieldname) {
      return errors.find((error) => error.field === fieldname);
    }
    function getError(errors, fieldname) {
      const err = hasError(errors.value, fieldname)
      return err || ""
    }

    function getClass(fieldname) {
      var cssclass = "field";
      if (hasError(errors.value, fieldname)) {
        cssclass = "field error";
      }
      return cssclass;
    }

    function generateSlug(){
      if (!isEdit.value && fields.value.title)
        fields.value.slug = saveSlugFormText(fields.value.title);
    };

    watch(() => fields.value.title, () => generateSlug())

    function getImageInFormData() {
      const fd = new FormData();
      if (imgMetadata.value.selectedFile) {
        fd.append("path", SERVER_IMG_PATH + fields.value.slug);
        fd.append(
          "cover",
          imgMetadata.value.selectedFile,
          imgMetadata.value.selectedFile.name
        );
      }
      return fd;
    }

    function getFields() {
      var tmp = { ...fields.value };        
      delete tmp.episodes;
      delete tmp.series;
      return tmp;
    }

    async function savePodcast(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (imgMetadata.value.selectedFile) {
        fields.value.cover_file =
          SERVER_IMG_PATH +
          fields.value.slug +
          "/" +
          imgMetadata.value.selectedFile.name;
      }
      errors.value = validation(
        fields.value,
        imgMetadata.value.imgWidth,
        imgMetadata.value.imgHeight
      )
      if (errors.value.length == 0) {
        const postData: IPostdata = {
          method: "POST",
          body: getFields(),
        };
        var postResult : any = await $fetch(PODCAST_AP, postData);
        if (postResult.status == 201 && imgMetadata.value.selectedFile) {
          postData.body = getImageInFormData();
          postResult = await $fetch(UPLOAD_AP, postData);
        }
        if (postResult.status == 201) ctx.emit("onsaved", fields.value.title);
      }
    }

    function cancel() {
      ctx.emit("oncancel");
    }

    async function deletePodcast() {
      const postData = {
        method: "delete",
        body: {
          id: fields.value.id,
          title: fields.value.title,
        },
      };
      var postResult: Response = await $fetch(PODCAST_AP, postData);
      if (postResult.status == 201) {
        ctx.emit("ondeleted", fields.value.title);
      }
    }

    function imageSelected(data: ImageMetadata) {
      imgMetadata.value = { ...data };
    }
    
    return {
      errors,
      fields,
      enumerations,
      hasError,
      getError,
      isEdit,
      getClass,
      imageSelected,
      deletePodcast,
      cancel,
      savePodcast,
      imgMetadata
    };
  },
});
</script>
