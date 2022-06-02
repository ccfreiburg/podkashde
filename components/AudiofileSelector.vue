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
    >
      <div
        v-if="isFileSelected"
        @click="removeFile"
        class="text-red-500 text-right mr-2"
      >
        X
      </div>
    </div>
    <p>{{ tags }}</p>
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
import * as id3 from "id3js";

export default defineComponent({
  setup(_, { emit }) {
    const fileInput = ref(null);
    const selectedFile = ref(null);
    const tags = ref("");
    function chooseFile() {
      fileInput.value.click();
    }
    const isFileSelected = computed(() => {
      return selectedFile.value != null;
    });

    async function fileSelected(event) {
      var id3tags = await id3.fromFile(event.target.files[0]);
      // tags now contains v1, v2 and merged tags
      console.log(id3tags);
      selectedFile.value = event.target.files[0];
      //emit
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
    };
  },
});
</script>
