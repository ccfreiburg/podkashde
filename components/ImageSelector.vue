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
      @click="chooseImageFile"
      :style="{ 'background-image': `url(${preview()})` }"
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
        ref="imageFileInput"
        type="file"
        id="imageFileInput"
        @change="imageFileSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import ImageMetadata from "~~/base/types/ImageMetadata";

export default defineComponent({
  props: {
    value: ImageMetadata,
  },
  setup(props, { emit }) {
    const imgMetadata = ref(props.value);
    const imageFileInput = ref(null);

    function calcImageSizePx(source, callback) {
      var img = new Image();
      img.onload = () => {
        imgMetadata.value.imgWidth = img.naturalWidth;
        imgMetadata.value.imgHeight = img.naturalHeight;
        callback();
      };
      img.src = source;
    }
    function preview() {
      if (imgMetadata.value && imgMetadata.value.preview)
        return imgMetadata.value.preview;
      return "";
    }
    function removeImage(event) {
      imgMetadata.value.preview = null;
      imgMetadata.value.imgWidth = 0;
      imgMetadata.value.imgHeight = 0;
      event.stopImmediatePropagation();
      emit("imageSelected", imgMetadata.value);
    }
    function chooseImageFile() {
      imageFileInput.value.click();
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
      preview,
      imgMetadata,
      imageFileInput,
      imageFileSelected,
      chooseImageFile,
      removeImage,
      calcImageSizePx,
    };
  },
});
</script>
