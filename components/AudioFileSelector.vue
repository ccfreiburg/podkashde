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
      accept=".mp3,.mpeg"
      @change="audioFileSelected"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import universalParse from "id3-parser/lib/universal/index.js";
import AudioFileMetadata from "~~/base/types/AudioFileMetadata";
import IEpisode from "~~/base/types/IEpisode";
import { IID3Tag } from "id3-parser/lib/interface";

export default defineComponent({
  props: {
    audioFileName: String,
    cssclass: String,
  },
  name: "AudioFileSelector",
  setup(props, ctx) {
    const audioFileInput = ref(null);
    var audioFile = ref(new AudioFileMetadata());
    var audioInputValue = ref(props.audioFileName);

    function array2base64(data, format) {
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }
      return `data:${format};base64,${window.btoa(base64String)}`;
    }
    
    function getDuration(file) {
      return new Promise<number>((resolve, reject) => {
        var audio = new Audio();
        audio.addEventListener("loadeddata", () => {
          resolve(audio.duration);
        });
        audio.src = file;
      });
    }

    async function audioFileSelected(event) {
      if (!event.target.files[0].type.split("/").includes("audio"))
        return;
      audioFile.value.selectedFile = event.target.files[0];
      audioInputValue.value = event.target.files[0].name;
      audioFile.value.duration = await getDuration(
        URL.createObjectURL(audioFile.value.selectedFile)
      );
      audioFile.value.size = event.target.files[0].size;
      try {
        var id3tag = await universalParse(event.target.files[0]);
        if (id3tag.title)  
          audioFile.value.fields = fieldsFromId3(id3tag);
        if (id3tag.image)
          audioFile.value.cover_preview = array2base64(
            id3tag.image.data,
            id3tag.image.mime
          );
      }  catch(err) {
        console.log(err)
      }
      ctx.emit("audioFileSelected", audioFile.value);
    }

    function fieldsFromId3(data: IID3Tag): Partial<IEpisode> {
      var ret: Partial<IEpisode> = {
      title: data.title,
      keyword: data.album,
      creator: data.artist,
      summary: data["set-part"]
      }
      if ("initial-key" in data)
        ret.external_id = Number(data["initial-key"]);
      return ret;
    }
    return {
      audioFile,
      audioFileInput,
      audioInputValue,
      audioFileSelected,
      cssclass: props.cssclass,
    };
  },
});
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
