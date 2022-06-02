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
      :style="{ 'background-image': `url(${imgMetadata.preview})` }"
    >
      <div
        v-if="imgMetadata.preview === null"
        class="flex flex-col h-full w-full justify-center bg-slate-200"
      >
        <div class="text-gray-500 text-center">
          {{ $t("podcastDetail.label.img") }}
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
        id="fileInput"
        @change="imageFileSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ImageMetadata } from "~~/backend/ImageMetadata";

export default defineComponent({
  setup(_, { emit }) {
    const imgMetadata = ref(new ImageMetadata());
    const fileInput = ref(null);

    function calcImageSizePx(source, callback) {
      var img = new Image();
      img.onload = () => {
        imgMetadata.value.imgWidth = img.naturalWidth;
        imgMetadata.value.imgHeight = img.naturalHeight;
        callback();
      };
      img.src = source;
    }
    function removeImage(event) {
      imgMetadata.value.preview = null;
      imgMetadata.value.imgWidth = 0;
      imgMetadata.value.imgHeight = 0;
      event.stopImmediatePropagation();
      emit("imageSelected", imgMetadata.value);
    }
    function chooseImageFile() {
      fileInput.value.click();
    }
    function imageFileSelected(event) {
      imgMetadata.value.selectedFile = event.target.files[0];
      if (imgMetadata.value.selectedFile) {
        let reader = new FileReader();
        reader.onload = (e) => {
          imgMetadata.value.preview = e.target.result;
          calcImageSizePx(e.target.result as any, () =>
            emit("imageSelected", imgMetadata.value)
          );
        };
        reader.readAsDataURL(imgMetadata.value.selectedFile);
      }
    }
    return {
      imgMetadata,
      fileInput,
      imageFileSelected,
      chooseImageFile,
      removeImage,
      calcImageSizePx,
    };
  },
});
</script>
