<template>
  <div>
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
      @click="chooseImageFile"
    >
      <div @click="removeFile" class="text-red-500 text-right mr-2">X</div>
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
export default defineComponent({
  setup(_, { emit }) {
    const fileInput = ref(null);
    function chooseFile() {
      fileInput.value.click();
    }
    function fileSelected(event) {}
    function removeFile(event) {}
    return {
      fileInput,
      fileSelected,
      removeFile,
    };
  },
});
</script>
