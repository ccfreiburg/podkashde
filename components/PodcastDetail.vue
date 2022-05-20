<template>
  <div
    class="p-10 w-full h-full"
    v-on:keyup.enter="submitPodcast"
    v-on:keyup.esc="cancel"
  >
    <!--form class="m-5" @submit="submitPodcast"-->
    <div class="mb-5">
      <h1 class="text-2xl text-center">Add Podcast</h1>
    </div>
    <!-- Image Area -->
    <div
      ref="imgageHldr"
      class="
        self-center
        block
        cursor-pointer
        w-60
        h-60
        border-2 border-dotted
        rounded-md
        border-gray-500
        bg-center bg-cover
      "
      @click="chooseFile"
      :style="{ 'background-image': `url(${imgMetadata.preview})` }"
    >
      <div
        v-if="imgMetadata.preview === null"
        class="flex flex-col h-full w-full justify-center bg-slate-200"
      >
        <div class="text-gray-500 text-center">
          klicken um Bild hinzuzufügen
        </div>
      </div>
      <div v-else @click="removeImage" class="text-red-500 text-right mr-2">
        X
      </div>
    </div>
    <div>
      <input
        class="invisible"
        ref="fileInput"
        type="file"
        id="formFileLg"
        @change="selectImgFile"
      />
    </div>
    <!-- Fields-->
    <div class="flex flex-col">
      <div class="flex flex-col">
        <label class="pl-2 text-sm text-gray-500" for="title">Title</label>
        <input
          :class="getClass('title')"
          type="text"
          name="title"
          v-model="fields.title"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="subtitle"
          >Sub Title</label
        >
        <input
          class="field"
          type="text"
          name="subtitle"
          v-model="fields.subtitle"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="author">Author</label>
        <input
          :class="getClass('title')"
          type="text"
          name="author"
          v-model="fields.author"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="summary">Summary</label>
        <textarea
          class="textarea h-28"
          type="text"
          name="summary"
          v-model="fields.summary"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="description"
          >Description</label
        >
        <textarea
          class="textarea h-28"
          type="text"
          name="description"
          v-model="fields.description"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="language"
          >Language</label
        >
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
        <label class="pl-2 text-sm text-gray-500" for="category"
          >Category</label
        >
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
        <label class="pl-2 text-sm text-gray-500" for="type">Type</label>
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
            ? "Contains explicit content"
            : "Is clean from explicit content"
        }}</span>
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="author">Link</label>
        <input
          :class="getClass('link')"
          type="text"
          name="link"
          v-model="fields.link"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="copyright"
          >Copyright</label
        >
        <input
          class="field"
          type="text"
          name="copyright"
          v-model="fields.copyright"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="owner_name"
          >Owner name</label
        >
        <input
          :class="getClass('owner_name')"
          type="text"
          name="owner_name"
          v-model="fields.owner_name"
        />
      </div>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" for="owner_email"
          >Owner email</label
        >
        <input
          :class="getClass('title')"
          type="text"
          name="owner_email"
          v-model="fields.owner_email"
        />
      </div>
      <div v-if="errors.length > 0" class="mt-5 ml-5 test-xs text-red-600">
        <p>Pleas correct the following issues:</p>
        <ul class="ml-5">
          <li class="list-disc" v-for="err in errors">{{ err.text }}</li>
        </ul>
      </div>
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
          Cancel
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
          @click="submitPodcast"
        >
          Save Podcast
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Podcast from "~~/backend/entities/Podcast";
import { Enumerations } from "~~/backend/Enumerations";
import {
  IMAGES_BASE_URL,
  REQUIRED_IMG_WIDTH,
  REQUIRED_IMG_HEIGHT,
  PODCAST_AP,
  ENUMERATIONS_AP,
} from "~~/backend/Constants";

export default defineComponent({
  props: {
    podcast: Object as PropType<Podcast>,
  },
  name: "PodcastDetail",
  data: () => {
    return {
      imgMetadata: {
        preview: null,
        selectedFile: null,
        imgWidth: 0,
        imgHeight: 0,
      },
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
          this.calcImageSizePx(this.imgMetadata.preview as any);
        } else {
          this.imgMetadata.preview = null;
          this.imgMetadata.imgWidth = 0;
          this.imgMetadata.imgHeight = 0;
        }
      },
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
    validation() {
      this.errors = [];
      if (
        !(
          this.imgMetadata.imgWidth == REQUIRED_IMG_WIDTH &&
          this.imgMetadata.imgHeight == REQUIRED_IMG_HEIGHT
        ) ||
        this.fields.cover_file.length < 1
      )
        this.errors.push({
          field: "img",
          text: "Please select an image with the exact dimensions of 1400x1400 pixel",
        });
      if (this.fields.title.length < 1)
        this.errors.push({ field: "title", text: "Please enter a title" });
      if (this.fields.author.length < 1)
        this.errors.push({ field: "author", text: "Please enter an author" });
      if (this.fields.language_id < 0)
        this.errors.push({
          field: "language",
          text: "Please select the language",
        });
      if (this.fields.category_id < 0)
        this.errors.push({
          field: "category",
          text: "Please select a category for your content",
        });
      if (this.fields.type_id < 0)
        this.errors.push({
          field: "type",
          text: "Please select the publishing type",
        });
      var re =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      if (this.fields.link.length < 1 || re.test(this.fields.link) == false)
        this.errors.push({ field: "link", text: "Please enter the link" });
      if (this.fields.owner_name.length < 1)
        this.errors.push({
          field: "owner_name",
          text: "Please enter the owners name",
        });
      re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (
        this.fields.owner_email.length < 1 ||
        re.test(this.fields.owner_email) == false
      )
        this.errors.push({
          field: "owner_email",
          text: "Please enter a valid email address",
        });
      return this.errors.length == 0;
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
    async submitPodcast(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (this.validation()) {
        const postData = {
          method: "post",
          body: this.getFormData(),
        };
        var postResult = await $fetch(PODCAST_AP, postData);
        console.log(postResult);
        if (postResult.status == 201) {
          this.$emit("onsaved", this.fields.title);
        }
      }
    },
    cancel() {
      this.$emit("oncancel");
    },
    calcImageSizePx(source) {
      var img = new Image();
      img.onload = () => {
        this.imgMetadata.imgWidth = img.naturalWidth;
        this.imgMetadata.imgHeight = img.naturalHeight;
      };
      img.src = source;
    },
    removeImage(event) {
      this.imgMetadata.preview = null;
      this.imgMetadata.imgWidth = 0;
      this.imgMetadata.imgHeight = 0;
      event.stopImmediatePropagation();
    },
    chooseFile() {
      this.$refs.fileInput.click();
    },
    selectImgFile(event) {
      this.imgMetadata.selectedFile = event.target.files[0];
      if (this.imgMetadata.selectedFile) {
        this.fields.cover_file = this.imgMetadata.selectedFile.name;
        let reader = new FileReader();
        reader.onload = (e) => {
          this.imgMetadata.preview = e.target.result;
          this.calcImageSizePx(e.target.result as any);
        };
        reader.readAsDataURL(this.imgMetadata.selectedFile);
      }
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