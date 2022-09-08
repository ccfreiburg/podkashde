<template>
  <div
    v-if="fields"
    class="p-10 w-full h-full"
    v-on:keyup.enter="savePodcast"
    v-on:keyup.esc="cancel"
  >
    <div class="mb-5">
      <h1 class="text-2xl text-center">
        {{
          isEdit
            ? $t("podcastDetail.editPodcast")
            : $t("podcastDetail.newPodcast")
        }}
      </h1>
    </div>

    <image-selector :filename="fields.cover_file" @imageSelected="imageSelected" />
    <!-- Fields-->
    <div class="flex flex-col">
      <div class="flex flex-col">
        <label class="pl-2 text-sm text-gray-500" for="title">{{
          $t("podcastDetail.label.title")
        }}</label>
        <input
          :class="getClass('title')"
          type="text"
          name="title"
          v-model="fields.title"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="subtitle">{{
          $t("podcastDetail.label.subtitle")
        }}</label>
        <input
          class="field"
          type="text"
          name="subtitle"
          v-model="fields.subtitle"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="slug">{{
          $t("podcastDetail.label.slug")
        }}</label>
        <input class="field" type="text" name="slug" v-model="fields.slug" />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="author">{{
          $t("podcastDetail.label.author")
        }}</label>
        <input
          :class="getClass('author')"
          type="text"
          name="author"
          v-model="fields.author"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="summary">{{
          $t("podcastDetail.label.summary")
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
          $t("podcastDetail.label.description")
        }}</label>
        <textarea
          class="textarea h-28"
          type="text"
          name="description"
          v-model="fields.description"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="language">{{
          $t("podcastDetail.label.language")
        }}</label>
        <select
          :class="getClass('language')"
          name="language_id"
          v-model="fields.language_id"
        >
          <option
            v-for="langOption in enumerations.languages"
            :key="langOption.enumvalue_id"
            :value="langOption.enumvalue_id"
          >
            {{ langOption.displaytext }}
          </option>
        </select>
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="category">{{
          $t("podcastDetail.label.category")
        }}</label>
        <select
          :class="getClass('category')"
          name="category_id"
          v-model="fields.category_id"
        >
          <option
            v-for="categoryOption in enumerations.podcastGenres"
            :key="categoryOption.enumvalue_id"
            :value="categoryOption.enumvalue_id"
          >
            {{ categoryOption.parentCategory }} -
            {{ categoryOption.displaytext }}
          </option>
        </select>
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="type">{{
          $t("podcastDetail.label.type")
        }}</label>
        <select
          :class="getClass('type')"
          name="type_id"
          v-model="fields.type_id"
        >
          <option
            v-for="typeOption in enumerations.podcastTypes"
            :key="typeOption.enumvalue_id"
            :value="typeOption.enumvalue_id"
          >
            {{ typeOption.displaytext }}
          </option>
        </select>
      </div>
        <switch-box 
          :checked="fields.explicit" 
          @checkedChanged="(val)=>fields.explicit=val" 
          :labelChecked="$t('podcastDetail.label.explicit_true')"
          :labelUnChecked="$t('podcastDetail.label.explicit_false')"
        />

      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="author">{{
          $t("podcastDetail.label.link")
        }}</label>
        <input
          :class="getClass('link')"
          type="text"
          name="link"
          v-model="fields.link"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="copyright">{{
          $t("podcastDetail.label.copyright")
        }}</label>
        <input
          class="field"
          type="text"
          name="copyright"
          v-model="fields.copyright"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="owner_name">{{
          $t("podcastDetail.label.owner_name")
        }}</label>
        <input
          :class="getClass('owner_name')"
          type="text"
          name="owner_name"
          v-model="fields.owner_name"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="owner_email">{{
          $t("podcastDetail.label.owner_email")
        }}</label>
        <input
          :class="getClass('title')"
          type="text"
          name="owner_email"
          v-model="fields.owner_email"
        />
      </div>
      <div v-if="errors.length > 0" class="mt-5 ml-5 test-xs text-red-600">
        <p>{{ $t("podcastDetail.label.errors") }}</p>
        <ul class="ml-5">
          <li class="list-disc" v-for="(err, index) in errors" :key="index">
            {{ $t("podcastDetail.validation." + err.text) }}
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
          @click="deletePodcast"
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
          @click="savePodcast"
        >
          {{ $t("podcastDetail.savePodcast") }}
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

export default defineComponent({
  props: {
    podcast: Object as PropType<IPodcast>,
  },
  name: "PodcastDetail",
  async setup(props, ctx) {
    const imgMetadata = ref(new ImageMetadata());
    const errors = ref([] as Array<IValidationError>);
    const { enumerations } = await useEnumerations();
    const fields = ref({...props.podcast} as IPodcast);

    const isEdit = computed(() => {
      return fields.value.id && fields.value.id;
    })

    function hasError(fieldname) {
      return errors.value.find((error) => error.field === fieldname);
    }

    function getClass(fieldname) {
      var cssclass = "field";
      if (hasError(fieldname)) {
        cssclass = "field error";
      }
      return cssclass;
    }

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
        fields.value.cover_file = FILES_AP+
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