<template>
  <div class="p-10 w-full h-full">
    <div class="m-5">
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
        :style="{ 'background-image': `url(${filePreview})` }"
      >
        <div
          v-if="filePreview === null"
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
            class="field"
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
            class="field"
            type="text"
            name="author"
            v-model="fields.author"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="summary"
            >Summary</label
          >
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
            class="field"
            type="text"
            name="language"
            v-model="fields.language"
          >
            <option
              v-for="langOption in languages"
              :key="langOption.id"
              :value="langOption.shorttext"
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
            class="field"
            type="text"
            name="category"
            v-model="category_id"
          >
            <option
              v-for="categoryOption in categories"
              :key="categoryOption.id"
              :value="categoryOption.id"
            >
              {{ categoryOption.parentCategory }} -
              {{ categoryOption.displaytext }}
            </option>
          </select>
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="type">Type</label>
          <select class="field" type="text" name="type" v-model="fields.type">
            <option
              v-for="typeOption in types"
              :key="typeOption.id"
              :value="typeOption.id"
            >
              {{ typeOption.displaytext }}
            </option>
          </select>
        </div>
        <div class="mt-3 flex">
          <label
            for="toggle-example"
            class="flex items-center cursor-pointer relative mb-4"
          >
            <input
              type="checkbox"
              id="toggle-example"
              class="sr-only"
              v-model="fields.explicit"
            />
            <div
              class="
                toggle-bg
                bg-gray-200
                border-2 border-gray-200
                h-8
                w-14
                rounded-full
              "
            ></div>
            <span class="ml-3 text-gray-500 text-sm font-medium">{{
              fields.explicit
                ? "Contains explicit content"
                : "Is clean from explicit content"
            }}</span>
          </label>
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="author">Link</label>
          <input class="field" type="text" name="link" v-model="fields.link" />
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
            class="field"
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
            class="field"
            type="text"
            name="owner_email"
            v-model="fields.owner_email"
          />
        </div>
        <button
          class="
            mt-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
          @click="submit"
        >
          Podcast anlegen
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PodcastDetail",
  data: () => {
    return {
      file: null,
      filePreview: null,
      languages: [],
      categories: [],
      types: [],
      category_id: 0,
      fields: {
        title: "",
        subtitle: "",
        author: "",
        summary: "",
        description: "",
        language: "",
        category: "",
        subcategory: "",
        explicit: false,
        type: "",
        link: "",
        copyright: "",
        owner_name: "",
        owner_email: "",
      },
    };
  },
  async mounted() {
    var enums = await $fetch("/api/enums");
    this.languages = enums.filter((item) => item.enum_id === 0);
    this.categories = enums.filter((item) => item.enum_id === 1);
    this.types = enums.filter((item) => item.enum_id === 2);
  },
  watch: {
    category_id(nVal, oVal) {
      var cat = this.categories.find((item) => item.id == nVal);
      this.fields.category = cat.parentCategory;
      this.fields.subcategory = cat.displaytext;
    },
  },
  methods: {
    getFormData() {
      var fd = new FormData();
      if (this.file) fd.append("cover", this.file, this.file.name);
      Object.keys(this.fields).forEach((key) => {
        fd.append(key, this.fields[key]);
      });
      return fd;
    },
    submit() {
      var fd = this.getFormData();
      var data = {
        method: "post",
        body: fd,
      };
      $fetch("/api/podcast", data);
    },
    removeImage(event) {
      this.filePreview = null;
      event.stopImmediatePropagation();
    },
    chooseFile() {
      this.$refs.fileInput.click();
    },
    selectImgFile(event) {
      this.file = event.target.files[0];
      if (this.file) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.filePreview = e.target.result;
        };
        reader.readAsDataURL(this.file);
        this.$emit("fileInput", this.file);
      }
    },
  },
});
</script>
<style lang="postcss" scoped>
.toggle-bg:after {
  content: "";
  @apply absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-7 w-6 transition shadow-sm;
}

input:checked + .toggle-bg:after {
  transform: translateX(100%);
  @apply border-white;
}

input:checked + .toggle-bg {
  @apply bg-orange-300 border-orange-300;
}
.field {
  @apply border-2
              h-10
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300;
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