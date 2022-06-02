<template>
  <div
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

    <image-selector @imageSelected="imageSelected" />
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
            ? $t("podcastDetail.label.explicit_true")
            : $t("podcastDetail.label.explicit_false")
        }}</span>
      </div>
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
          <li class="list-disc" v-for="err in errors">
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
import Podcast from "~~/backend/entities/Podcast";
import { Enumerations } from "~~/backend/Enumerations";
import validation from "~~/backend/PodcastDetailValidation";
import {
  IMAGES_BASE_URL,
  PODCAST_AP,
  ENUMERATIONS_AP,
} from "~~/backend/Constants";
import { ImageMetadata } from "~~/backend/ImageMetadata";

export default defineComponent({
  props: {
    podcast: Object as PropType<Podcast>,
  },
  name: "PodcastDetail",
  data: () => {
    return {
      imgMetadata: new ImageMetadata(),
      errors: [],
      fields: new Podcast(),
      enumerations: new Enumerations(),
    };
  },
  async mounted() {
    if (!this.enumerations.isInitialized) {
      var enums = await $fetch(ENUMERATIONS_AP);
      this.enumerations.init(enums);
    }
  },
  watch: {
    podcast: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (!newValue) return;
        this.fields = { ...newValue };
        if (this.fields.cover_file && this.fields.cover_file.length > 0) {
          this.imgMetadata.preview = IMAGES_BASE_URL + this.fields.cover_file;
          this.imgMetadata.imgWidth = 1400; // Workaround satisfying validation later
          this.imgMetadata.imgHeight = 1400;
        } else {
          this.imgMetadata.preview = null;
          this.imgMetadata.imgWidth = 0;
          this.imgMetadata.imgHeight = 0;
        }
      },
    },
  },
  computed: {
    isEdit() {
      return this.fields.id && this.fields.id;
    },
  },
  methods: {
    hasError(fieldname) {
      return this.errors.find((error) => error.field === fieldname);
    },
    getClass(fieldname) {
      var cssclass = "field";
      if (this.hasError(fieldname)) {
        cssclass = "field error";
      }
      return cssclass;
    },

    getFormData() {
      const fd = new FormData();
      Object.keys(this.fields).forEach((key) => {
        fd.append(key, this.fields[key].toString());
      });
      if (this.imgMetadata.selectedFile) {
        fd.append(
          "cover",
          this.imgMetadata.selectedFile,
          this.imgMetadata.selectedFile.name
        );
      }
      return fd;
    },
    async savePodcast(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.errors = validation(
        this.fields,
        this.imgMetadata.imgWidth,
        this.imgMetadata.imgHeight
      );
      if (this.errors.length == 0) {
        const postData = {
          method: "post",
          body: this.getFormData(),
        };
        var postResult: Response = await $fetch(PODCAST_AP, postData);
        if (postResult.status == 201) {
          this.$emit("onsaved", this.fields.title);
        }
      }
    },
    cancel() {
      this.$emit("oncancel");
    },
    async deletePodcast() {
      const postData = {
        method: "delete",
        body: {
          id: this.fields.id,
          title: this.fields.title,
        },
      };
      var postResult: Response = await $fetch(PODCAST_AP, postData);
      if (postResult.status == 201) {
        this.$emit("ondeleted", this.fields.title);
      }
    },
    imageSelected(data: ImageMetadata) {
      this.fields.cover_file = data.selectedFile.name;
      this.imgMetadata.preview = data.preview;
      this.imgMetadata.selectedFile = data.selectedFile;
      this.imgMetadata.imgWidth = data.imgWidth;
      this.imgMetadata.imgHeight = data.imgHeight;
    },
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