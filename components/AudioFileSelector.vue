<template>
  <div class="flex flex-col mt-3" @click="audioFileInput.click()">
    <label class="pl-2 text-sm text-gray-500" for="file">{{
      $t("episodeDetail.label.file")
    }}</label>
    <input
      :class="cssclass"
      type="text"
      name="file"
      readonly
      v-model="audioInputValue"
    />
    <input
      class="invisible"
      type="file"
      ref="audioFileInput"
      name="audioFileInput"
      @change="audioFileSelected"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AudioFileMetadata from '~~/base/types/AudioFileMetadata';

export default defineComponent({
    props: {
        audioFileName: String,
        cssclass: String
    },
    name: "AudioFileSelector",
    setup(props, ctx) {
        const audioFileInput = ref(null);
        var audioFile = ref(new AudioFileMetadata());
        var audioInputValue = ref(props.audioFileName);

        function audioFileSelected(event) {
            audioFile.value.selectedFile = event.target.files[0];
            audioInputValue.value = audioFile.value.selectedFile.name;
            ctx.emit("audioFileSelected", audioFile.value);
        }
        return {
            audioFileInput,
            audioInputValue,
            audioFileSelected,
            cssclass: props.cssclass,
        }
    },
})
</script>
<style lang="postcss" scoped>
.field {
  @apply border-2
              h-10
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              valid:border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300;
}
.error {
  @apply ring-orange-700 ring-1;
}
.textarea {
  @apply border-2
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300;
}
</style>