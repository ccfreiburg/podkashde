<template>
  <div>
    <div
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
      :style="{ 'background-image': `url(${preview})` }"
    >
      <div
        v-if="isFileSelected"
        @click="removeFile"
        class="text-red-500 text-right mr-2"
      >
        X
      </div>
    </div>
    <div>
      <input
        class="invisible"
        ref="fileInput"
        type="file"
        id="fileInput"
        @change="fileSelected"
      />
    </div>
  </div>
</template>


<script lang="ts">
import { ref } from "vue";
//Der ID3 reader geht nicht wirklich :(
//Stattdessen:
//https://github.com/creeperyang/id3-parser
// import { parse } from "id3-parser";
// import {
//   convertFileToBuffer,
//   fetchFileAsBuffer,
// } from "id3-parser/lib/universal/helpers";
import universalParse from "id3-parser/lib/universal/index.js";

export default defineComponent({
  setup(_, { emit }) {
    const fileInput = ref(null);
    const selectedFile = ref(null);
    const tags = ref(null);
    const preview = ref(null);

    function chooseFile() {
      fileInput.value.click();
    }
    const isFileSelected = computed(() => {
      return selectedFile.value != null;
    });
    function array2base64(data, format) {
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }
      return `data:${format};base64,${window.btoa(base64String)}`;
    }

    async function fileSelected(event) {
      selectedFile.value = event.target.files[0];
      try {
        universalParse(event.target.files[0]).then((id3tags) => {
          tags.value = id3tags;
          emit("fileSelected", tags.value);
          preview.value = array2base64(id3tags.image.data, id3tags.image.mime);
        });
      } catch {}
    }

    function removeFile(event) {
      selectedFile.value = null;
      event.stopImmediatePropagation();
      //emit
    }

    return {
      tags,
      fileInput,
      chooseFile,
      fileSelected,
      removeFile,
      isFileSelected,
      preview,
    };
  },
});
</script>
