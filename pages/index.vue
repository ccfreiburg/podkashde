<template>
  <div class="p-10 w-full h-full">
    <div class="m-5">
      <div class="mb-5">
        <h1 class="text-2xl text-center">Add Podcast</h1>
      </div>
      <div
        ref="imgageHldr"
        class="self-center block cursor-pointer w-60 h-60 border-2 border-dotted rounded-md border-gray-500 bg-center bg-cover"
        @click="chooseFile"
        :style="{ 'background-image': `url(${filePreview})` }"
      >
      <div v-if="file===null" class="text-gray-500 text-center">Drag 'n Drop oder klicken um Bild hinzuzufügen</div>
      <div v-else @click="removeImage" class="text-red-500 text-right mr-2">X</div>
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
      <button @click="submit">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      file: null,
      filePreview: null,
    };
  },
  methods: {
    submit() {
      var fd = new FormData();
      fd.append("cover", this.file, this.file.name);
      fd.append("name", "Alex R");
      console.log(fd);
      var data = {
        method: "post",
        body: fd,
      };
      $fetch("/api/podcast", data);
    },
    removeImage(event) {
      console.log("hi2");
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
};
</script>
<style scoped>
.container {
  max-width: 600px;
}
.previewBlock {
  display: block;
  cursor: pointer;
  width: 300px;
  height: 280px;
  margin: 0 auto 20px;
  background-position: center center;
  background-size: cover;
}
</style>
