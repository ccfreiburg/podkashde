<template>
  <div
    class="p-10 w-full h-full"
    v-on:keyup.enter="save"
    v-on:keyup.esc="cancel"
  >
    <div class="mb-5">
      <h1 class="text-2xl text-center">
        {{
          isEdit
            ? $t("episodeDetail.editEpisode")
            : $t("episodeDetail.newEpisode")
        }}
      </h1>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-row">
        <div>
          <image-selector :value="imgMetadata" @imageSelected="imageSelected" />
        </div>
        <div class="flex flex-col">
          <div class="flex flex-col mt-3" @click="audioFileInput.click()">
            <label class="pl-2 text-sm text-gray-500" for="file">{{
              $t("episodeDetail.label.file")
            }}</label>
            <input
              :class="getClass('file')"
              type="text"
              name="file"
              readonly
              v-model="audioFilename"
            />
            <input
              class="invisible"
              type="file"
              ref="audioFileInput"
              name="audioFileInput"
              @change="audioFileSelected"
            />
          </div>
          <div class="flex flex-col mt-3">
            <label class="pl-2 text-sm text-gray-500" for="serie">{{
              $t("episodeDetail.label.serie")
            }}</label>
            <select
              :class="getClass('serie')"
              name="serie_id"
              v-model="serie_id"
            >
              <option v-for="serie in series" :key="serie.id" :value="serie.id">
                {{ serie.title }}
              </option>
            </select>
          </div>
          </div>
       </div>
    </div>
    <div class="text-sm">{{ podcast.title }}</div>
    <!-- Fields-->
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="title">{{
        $t("episodeDetail.label.title")
      }}</label>
      <input
        :class="getClass('title')"
        type="text"
        name="title"
        @change="generateSlug()"
        v-model="fields.title"
      />
    </div>
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="subtitle">{{
        $t("episodeDetail.label.subtitle")
      }}</label>
      <input
        class="field"
        type="text"
        name="subtitle"
        v-model="fields.subtitle"
      />
    </div>
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="keyword">{{
        $t("episodeDetail.label.keyword")
      }}</label>
      <input
        class="field"
        type="text"
        name="keyword"
        v-model="fields.keyword"
      />
    </div>
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="pubdate">{{
        $t("episodeDetail.label.pubdate")
      }}</label>
      <input class="field" type="date" name="pubdate" v-model="pubdateText" />
    </div>
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="duration">{{
        $t("episodeDetail.label.duration")
      }}</label>
      <input class="field" type="text" name="duration" v-model="durationText" />
    </div>
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="slug">{{
        $t("episodeDetail.label.slug")
      }}</label>
      <input class="field" type="text" name="slug" v-model="fields.slug" />
    </div>
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="creator">{{
        $t("episodeDetail.label.creator")
      }}</label>
      <input
        :class="getClass('creator')"
        type="text"
        name="creator"
        @change="generateSlug()"
        v-model="fields.creator"
      />
    </div>
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="summary">{{
        $t("episodeDetail.label.summary")
      }}</label>
      <textarea
        class="textarea h-28"
        type="text"
        name="summary"
        v-model="fields.summary"
      />
    </div>
    <div class="flex flex-col mt-3">
      <label class="pl-2 text-sm text-gray-500" for="description">{{
        $t("episodeDetail.label.description")
      }}</label>
      <textarea
        class="textarea h-28"
        type="text"
        name="description"
        v-model="fields.description"
      />
    </div>
    <div class="flex flex-row mt-3">
      <div
        class="
          relative
          w-12
          h-6
          transition
          duration-200
          ease-linear
          rounded-2xl
        "
        :class="[fields.block ? 'bg-orange-300' : 'bg-gray-200']"
      >
        <label
          for="block"
          class="
            absolute
            left-0
            w-6
            h-6
            mb-2
            transition
            duration-100
            ease-linear
            transform
            bg-white
            border-2
            rounded-2xl
            cursor-pointer
          "
          :class="[
            fields.block
              ? 'translate-x-full border-orange-300'
              : 'translate-x-0 border-gray-300',
          ]"
        ></label>
        <input
          type="checkbox"
          id="block"
          name="block"
          class="w-full h-full appearance-none focus:outline-none"
          @click="fields.block = !fields.block"
        />
      </div>
      <span class="ml-3 text-gray-500 text-sm font-medium">{{
        fields.block
          ? $t("episodeDetail.label.block_true")
          : $t("episodeDetail.label.block_false")
      }}</span>
    </div>
    <div class="flex flex-row mt-3">
      <div
        class="
          relative
          w-12
          h-6
          transition
          duration-200
          ease-linear
          rounded-2xl
        "
        :class="[fields.explicit ? 'bg-orange-300' : 'bg-gray-200']"
      >
        <label
          for="toggle"
          class="
            absolute
            left-0
            w-6
            h-6
            mb-2
            transition
            duration-100
            ease-linear
            transform
            bg-white
            border-2
            rounded-2xl
            cursor-pointer
          "
          :class="[
            fields.explicit
              ? 'translate-x-full border-orange-300'
              : 'translate-x-0 border-gray-300',
          ]"
        ></label>
        <input
          type="checkbox"
          id="toggle"
          name="toggle"
          class="w-full h-full appearance-none focus:outline-none"
          @click="fields.explicit = !fields.explicit"
        />
      </div>
      <span class="ml-3 text-gray-500 text-sm font-medium">{{
        fields.explicit
          ? $t("episodeDetail.label.explicit_true")
          : $t("episodeDetail.label.explicit_false")
      }}</span>
    </div>
    <div v-if="errors.length > 0" class="mt-5 ml-5 test-xs text-red-600">
      <p>{{ $t("episodeDetail.label.errors") }}</p>
      <ul class="ml-5">
        <li class="list-disc" v-for="(err, index) in errors" :key="index">
          {{ $t("episodeDetail.validation." + err.text) }}
        </li>
      </ul>
    </div>
    <!-- Buttons -->
    <div class="flex flex-row justify-end">
      <button
        class="mt-5 px-5 h-10 border-2 rounded-md bg-gray-300 hover:bg-gray-400"
        @click="cancel"
      >
        {{ $t("cancel") }}
      </button>
      <button
        v-if="'id' in fields && fields['id'] > 0"
        class="mt-5 px-5 h-10 border-2 rounded-md bg-red-200 hover:bg-red-400"
        @click="remove"
      >
        {{ $t("delete") }}
      </button>
      <button
        class="
          mt-5
          ml-5
          px-5
          h-10
          border-2
          rounded-md
          bg-orange-300
          hover:bg-orange-400
        "
        @click="save"
      >
        {{ $t("episodeDetail.saveEpisode") }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import {
  dateToIsoString,
  strToDurationInSec,
  strToDate,
  saveSlugFormText,
} from "~~/base/Converters";
import IPodcast from "~~/base/types/IPodcast";
import IEpisode, { emptyIEpisodeFactory } from "~~/base/types/IEpisode";
import validation from "~~/base/EpisodeDetailValidation";
import ImageMetadata from "../base/types/ImageMetadata";
import { emptyISerieFactory } from "../base/types/ISerie";

export default defineComponent({
  props: {
    episode: Object as PropType<IEpisode>,
    series: Object as PropType<Array<ISerie>>,
    podcast: Object as PropType<IPodcast>,
  },
  name: "EpisodeDetail",
  setup(props, ctx) {
    const fields = ref(emptyIEpisodeFactory())
    const errors = ref([])

    const generateSlug = () => {
      fields.value.slug = saveSlugFormText(fields.value.title);
    };

    const serie = ref(emptyISerieFactory())   
    const serie_id = ref(-1)
    watch(serie_id, (newVal, oldVal) => {
      serie.value = props.series.find((item) => item.id == newVal);
      fields.value.image = serie.value.cover_file;
      fields.value.keyword = serie.value.title;
      imgMetadata.value.preview = serie.value.cover_file;
    });

    const audioFileInput = ref(null)
    var audiofile = ref(null);
    const audioFilename = computed(() => {
      if (audiofile.value) return audiofile.value.name;
      else return "";
    });
    function audioFileSelected(event) {
      audiofile.value = event.target.files[0];
    }

    const durationText = ref("");
    watch(durationText, (newVal, oldVal) => {
      fields.value.duration = strToDurationInSec(newVal);
    });

    const pubdateText = ref(dateToIsoString(new Date()));
    watch(pubdateText, (newVal, oldVal) => {
      fields.value.pubdate = strToDate(newVal);
    });

    const imgMetadata = ref(new ImageMetadata());
    const imageSelected = (data: ImageMetadata) => {
      fields.value.image = data.selectedFile.name;
      imgMetadata.value = { ...data };
    };

    function save() {
      errors.value = validation(
        fields.value,
        imgMetadata.value.imgWidth,
        imgMetadata.value.imgHeight
      );
      if (errors.value.length > 0) return;
      ctx.emit("onsaved");
    }
    function remove() {}

    function cancel() {
      ctx.emit("oncancel");
    }

    const isEdit = computed(() => (fields.value as any).id != undefined);
    const hasError = (fieldname) => {
      return errors.value.find((error) => error.field === fieldname);
    };
    const getClass = (fieldname) => {
      var cssclass = "field";
      if (hasError(fieldname)) {
        cssclass = "field error";
      }
      return cssclass;
    };

    return {
      isEdit,
      imageSelected,
      imgMetadata,
      audioFileInput,
      audioFileSelected,
      audioFilename,
      serie_id,
      fields,
      generateSlug,
      durationText,
      pubdateText,
      errors,
      getClass,
      save,
      remove,
      cancel,
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