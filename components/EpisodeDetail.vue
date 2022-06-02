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
    <image-selector @imageSelected="imageSelected" />
    <audiofile-selector />
    <!-- Fields-->
    <div class="flex flex-col">
      <div class="flex flex-col">
        <label class="pl-2 text-sm text-gray-500" for="title">{{
          $t("episodeDetail.label.title")
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
        <input
          class="field"
          type="text"
          name="pubdate"
          v-model="fields.pubdate"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="duration">{{
          $t("episodeDetail.label.duration")
        }}</label>
        <input
          class="field"
          type="text"
          name="duration"
          v-model="fields.duration"
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
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="author">{{
          $t("episodeDetail.label.link")
        }}</label>
        <input
          :class="getClass('link')"
          type="text"
          name="link"
          v-model="fields.link"
        />
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
          @click="delete"
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
import { defineComponent, PropType } from "vue";
import { IMAGES_BASE_URL } from "~~/backend/Constants";
import Episode from "~~/backend/entities/Episode";
import { ImageMetadata } from "~~/backend/ImageMetadata";

export default defineComponent({
  props: {
    episode: Object as PropType<Episode>,
  },
  name: "EpisodeDetail",
  data: () => {
    return {
      mp3Data: {
        selectedFile: null,
      },
      imgMetadata: new ImageMetadata(),
      currentWizzardStep: 0,
      errors: [],
      fields: new Episode(),
    };
  },
  async mounted() {},
  watch: {
    episode: {
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
      return this.fields.id != undefined;
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
    async save(event) {
      // event.preventDefault();
      // event.stopImmediatePropagation();
      // this.errors = validation(
      //   this.fields,
      //   this.imgMetadata.imgWidth,
      //   this.imgMetadata.imgHeight
      // );
      // if (this.errors.length == 0) {
      //   const postData = {
      //     method: "post",
      //     body: this.getFormData(),
      //   };
      //   //var postResult = await $fetch("", postData);
      //   if (postResult.status == 201) {
      //     this.$emit("onsaved", this.fields.title);
      //   }
      // }
    },
    cancel() {
      this.$emit("oncancel");
    },
    async delete() {
      const postData = {
        method: "delete",
        body: {
          id: this.fields.id,
          title: this.fields.title,
        },
      };
      //var postResult = await $fetch(PODCAST_AP, postData);
      // if (postResult.status == 201) {
      //   this.$emit("ondeleted", this.fields.title);
      // }
    },
    imageSelected(data: ImageMetadata) {
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