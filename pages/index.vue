<template>
  <div class="m-10">
    <div class="m-5 flex flex-col items-center justify-center">
      <div class="mb-5">
        <h1 class="text-2xl text-center">Add Podcast</h1>
      </div>
      <div
        class="m-5 previewBlock"
        @click="chooseFile"
        :style="{ 'background-image': `url(${filePreview})` }"
      ></div>
      <div>
        <input
          class="form-control form-control-lg"
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
