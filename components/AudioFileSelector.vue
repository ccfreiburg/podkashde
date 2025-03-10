<template>
  <div class="flex flex-col mt-3" @click="audioFileInput.click()">
    <input-area :name="'file'" :label="label" :errors="$props.errors" :readonly="true" v-model:value="audioInputValue" />
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
import parse from 'id3-parser';
import { convertFileToBuffer } from 'id3-parser/lib/util';
import AudioFileMetadata from "~~/base/types/AudioFileMetadata";
import type {IEpisode} from "~~/base/types/IEpisode";
//import type { IID3Tag } from "id3-parser/lib/interface";
import type IValidationError from "~/base/types/IValidationError";
export default defineComponent({
  props: {
    audioFileName: String,
    label: String,
    errors: {
      type: Object as PropType<Array<IValidationError>>,
      default: []
    },
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
    
    function array2blob(data: Buffer, format: string) : Blob {
      return new Blob( [data], { type: format});
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
        var id3tag = await convertFileToBuffer(event.target.files[0] as File).then(parse) as any ;
        if (id3tag.title)  
          audioFile.value.fields = fieldsFromId3(id3tag);
        if (id3tag.image) {
          audioFile.value.cover_preview = array2base64(
            id3tag.image.data,
            id3tag.image.mime)
          audioFile.value.imgblob = array2blob(  
            id3tag.image.data,
            id3tag.image.mime)
        }
      }  catch(err) {
        console.log(err)
      }
      ctx.emit("audioFileSelected", audioFile.value);
    }

    function fieldsFromId3(data: any): Partial<IEpisode> {
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
    };
  },
});
</script>

