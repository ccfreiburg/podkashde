<template>
  <div>
    <div class="
        self-center
        block
        cursor-pointer
        sm:w-60
        sm:h-60
        w-40
        h-40
        border-2 border-dotted
        rounded-md
        border-gray-500
        bg-center bg-cover
      " @click="chooseImageFile" :style="{ 'background-image': `url(${preview})` }">
      <div v-if="preview.length < 1" class="flex flex-col h-full w-full justify-center bg-skin-light dark:bg-skin-dark">
        <div class="text-gray-500 text-center">
          {{ $t("podcast.label.img") }}
        </div>
      </div>
      <div v-else @click="removeImage" class="text-red-500 text-right mr-2">
        X
      </div>
    </div>
    <div>
      <input class="invisible" ref="imageFileInput" type="file" id="imageFileInput" accept=".jpg,.jpeg,.png,.gif"
        @change="imageFileSelected" />
    </div>
  </div>
</template>

<script lang="ts">
import { REQUIRED_IMG_HEIGHT, REQUIRED_IMG_WIDTH } from "../base/Constants";
import { defineComponent, ref, watch, computed } from "vue";
import ImageMetadata from "../base/types/ImageMetadata";
export default defineComponent({
  props: {
    filename: String,
    preview: String
  },
  name: "ImageSelector",
  setup(props, { emit }) {
    const imgMetadata = ref(new ImageMetadata());
    const imageFileInput = ref(null);

    const setImageMetaString = (filename: string, width: number, height: number) => {
      if (filename.length < 1)
        return
      imgMetadata.value.preview = filename;
      imgMetadata.value.imgWidth = width;
      imgMetadata.value.imgHeight = height;
      emit("imageSelected", imgMetadata.value)
    }
    watch(() => props.filename, (newVal) => {
      setImageMetaString(props.filename, REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT)
    })

    watch(() => props.preview, (newVal) => {
      imgMetadata.value.preview = props.preview;
      calcImageSizePx(props.preview, () => {
        emit("imageSelected", imgMetadata.value)
      })
    })
    if (props.filename && props.filename.length > 0)
      setImageMetaString(props.filename, REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT)

    const preview = computed(() => {
      if (imgMetadata.value && imgMetadata.value.preview)
        return imgMetadata.value.preview;
      return "";
    })

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
      event.stopImmediatePropagation();
      imgMetadata.value.preview = null;
      imgMetadata.value.selectedFile = null;
      imgMetadata.value.blob = undefined;
      imgMetadata.value.imgWidth = 0;
      imgMetadata.value.imgHeight = 0;
      emit("imageSelected", imgMetadata.value);
    }
    function chooseImageFile() {
      imageFileInput.value.click();
    }
    function imageFileSelected(event) {
      if (!event.target.files[0].type.split("/").includes("image"))
        return;
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
