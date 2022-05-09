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
            class="
              border-2
              h-10
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300
            "
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
            class="
              border-2
              h-10
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300
            "
            type="text"
            name="subtitle"
            v-model="fields.subtitle"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="author">Author</label>
          <input
            class="
              border-2
              h-10
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300
            "
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
            class="
              border-2
              h-20
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300
            "
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
            class="
              border-2
              h-28
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300
            "
            type="text"
            name="description"
            v-model="fields.description"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="description"
            >Language</label
          >
          <select
            class="
              border-2
              h-10
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300
            "
            type="text"
            name="description"
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
          <label class="pl-2 text-sm text-gray-500" for="description"
            >Category</label
          >
          <select
            class="
              border-2
              h-10
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300
            "
            type="text"
            name="description"
            v-model="fields.category"
          >
            <option
              v-for="categoryOption in categories"
              :key="categoryOption.id"
              :value="categoryOption.shorttext"
            >
              {{ categoryOption.parentCategory }} -
              {{ categoryOption.displaytext }}
            </option>
          </select>
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
      fields: {
        title: "",
        subtitle: "",
        author: "",
        summary: "",
        description: "",
        language: "",
        category: "",

        explicit: "", //enum
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
    console.log(this.languages);
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