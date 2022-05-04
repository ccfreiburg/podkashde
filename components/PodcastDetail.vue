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
        <label class="text-sm text-gray-500" for="title">Title</label>
        <input
          class="border-2 h-8 p-2 rounded-md shadow-inner text-gray-800"
          type="text"
          name="title"
          id=""
          v-model="fields.title"
        />
        <button class="mt-5 border-2 bg-slate-200" @click="submit">
          Submit
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
      fields: {
        title: "",
        subtitle: "",
        author: "",
        type: "",
        summary: "",
        link: "",
        description: "",
        language: "", // enum
        copyright: "",
        owner_name: "",
        owner_email: "",
        categories: [],
        explicit: "", //enum
      },
    };
  },
  methods: {
    getFormData() {
      var fd = new FormData();
      if (this.file) fd.append("cover", this.file, this.file.name);
      Object.keys(this.fields).forEach((key) => {
        fd.append(key, this.fields[key]);
      });
      fd.append("title", this.fields.title);
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