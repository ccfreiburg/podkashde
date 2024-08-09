<template>
  <div v-if="fields" class="w-full" v-on:keyup.enter="savePodcast" v-on:keyup.esc="cancel">
      <BaseH1>
        {{(isEdit ? $t("podcast.edit") : $t("podcast.new"))}}
      </BaseH1>
    <div v-if="!loading">
      <image-selector :filename="fields.cover_file" @imageSelected="imageSelected" />
      <!-- Fields-->
      <div class="flex flex-col">
        <input-area :name="'title'" :label="'podcast.label.title'" :errors="errors" v-model:value="fields.title" />
        <input-area :name="'subtitle'" :label="'podcast.label.subtitle'" :errors="errors"
          v-model:value="fields.subtitle" />
        <input-area :name="'slug'" :label="'podcast.label.slug'" :errors="errors" v-model:value="fields.slug" />
        <input-area :name="'author'" :label="'podcast.label.author'" :errors="errors" v-model:value="fields.author" />
        <input-area :name="'summary'" :type="'textarea'" :label="'podcast.label.summary'" :errors="errors"
          v-model:value="fields.summary" />
        <input-area :name="'description'" :type="'textarea'" :label="'podcast.label.description'" :errors="errors"
          v-model:value="fields.description" />
        <single-select :name="'language'" :label="'podcast.label.language'" :options="enumerations.languages()"
          :errors="errors" v-model:value="fields.language_id" />
        <single-select :name="'category'" :label="'podcast.label.category'" :options="enumerations.podcastGenres()"
          :errors="errors" :long="true" v-model:value="fields.category_id" />
        <single-select :name="'type'" :label="'podcast.label.type'" :options="enumerations.podcastTypes()"
          :errors="errors" v-model:value="fields.type_id" />
        <div class="my-3">
          <switch-box :checked="fields.explicit" @checkedChanged="(val) => fields.explicit = val"
            :labelChecked="$t('podcast.label.explicit_true')" :labelUnChecked="$t('podcast.label.explicit_false')" />
        </div>
        <input-area :name="'link'" :label="'podcast.label.link'" :errors="errors" v-model:value="fields.link" />
        <input-area :name="'copyright'" :label="'podcast.label.copyright'" :errors="errors"
          v-model:value="fields.copyright" />
        <input-area :name="'owner_name'" :label="'podcast.label.owner_name'" :errors="errors"
          v-model:value="fields.owner_name" />
        <input-area :name="'owner_email'" :label="'podcast.label.owner_email'" :errors="errors"
          v-model:value="fields.owner_email" />
        <input-area :name="'apple_url'" :label="'podcast.label.apple_url'" :errors="errors"
          v-model:value="fields.apple_url" />
        <input-area :name="'spotify_url'" :label="'podcast.label.spotify_url'" :errors="errors"
          v-model:value="fields.spotify_url" />
        <input-area :name="'google_url'" :label="'podcast.label.google_url'" :errors="errors"
          v-model:value="fields.google_url" />
        <input-area :name="'stitcher_url'" :label="'podcast.label.stitcher_url'" :errors="errors"
          v-model:value="fields.stitcher_url" />
        <switch-box :checked="fields.draft" @checkedChanged="(val) => fields.draft = val"
          :labelChecked="$t('podcast.label.draft_true')" :labelUnChecked="$t('podcast.label.draft_false')" />
        <div v-if="errors.length > 0" class="mt-5 ml-5 text-red-600 test-xs">
          <p>{{ $t("podcast.label.errors") }}</p>
          <ul class="ml-5">
            <li class="list-disc" v-for="(err, index) in errors" :key="index">
              {{ $t(err.text) }}
            </li>
          </ul>
        </div>
        <!-- Buttons -->
        <div class="flex flex-row justify-end">
          <BaseButtonSecondary class="mr-4" @click="cancel">
            {{ $t("cancel") }}
          </BaseButtonSecondary>
          <BaseButtonPrimary @click="savePodcast">
            {{ $t("podcast.savePodcast") }}
          </BaseButtonPrimary>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PODCAST_AP, UPLOAD_AP, SERVER_IMG_PATH, COUNT_AP } from "~~/base/Constants";
import type IPodcast from "~~/base/types/IPodcast";
import type IPostdata from "~~/base/types/IPostdata";
import validation from "~~/base/PodcastDetailValidation";
import ImageMetadata from "~~/base/types/ImageMetadata";
import type IValidationError from "~~/base/types/IValidationError";
import { getSaveFilename, saveSlugFormText } from "~~/base/Converters";

export default defineComponent({
  props: {
    podcast: Object as PropType<IPodcast>,
  },
  name: "podcast",
  async setup(props, ctx) {
    const imgMetadata = ref(new ImageMetadata())
    const errors = ref([] as Array<IValidationError>)
    const { enumerations, loading } = useEnumerations()
    const fields = ref({ ...props.podcast } as IPodcast)

    const isEdit = computed(() => {
      return fields.value.id && fields.value.id;
    })

    function hasError(errors, fieldname) {
      return errors.find((error) => error.field === fieldname);
    }
    function getError(errors, fieldname) {
      const err = hasError(errors.value, fieldname)
      return err || ""
    }

    function getClass(fieldname) {
      var cssclass = "field";
      if (hasError(errors.value, fieldname)) {
        cssclass = "field error";
      }
      return cssclass;
    }

    function generateSlug() {
      if (!isEdit.value && fields.value.title)
        fields.value.slug = saveSlugFormText(fields.value.title);
    };

    watch(() => fields.value.title, () => generateSlug())

    function getImageInFormData(newFilename: string) {
      const fd = new FormData();
      if (imgMetadata.value.selectedFile) {
        fd.append("path", SERVER_IMG_PATH + fields.value.slug);
        fd.append(
          "cover",
          imgMetadata.value.selectedFile,
          imgMetadata.value.selectedFile.name
        );
        fd.append("filename", newFilename);
      }
      return fd;
    }

    function getFields() {
      var tmp = { ...fields.value }
      delete tmp.episodes
      delete tmp.series
      return tmp
    }

    async function savePodcast(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      
      const myFetch = useFetchApi()
      
      var newFilename = ""

      if (imgMetadata.value.selectedFile) {
        newFilename = getSaveFilename(imgMetadata.value.selectedFile.name)
        fields.value.cover_file =
          SERVER_IMG_PATH +
          fields.value.slug +
          "/" + newFilename
      }
      
      errors.value = validation(
        fields.value,
        imgMetadata.value.imgWidth,
        imgMetadata.value.imgHeight
      )

      // server validation (if slug is unique) 
      var countUrl = COUNT_AP + "?slug=" + fields.value.slug + "&podcast=true" + (isEdit.value ? "&excludeId=" + fields.value.id : "")
      var count = await myFetch( countUrl ) as number;
      if (count > 0) errors.value.push({ field: "slug", text: "podcast.validation.slug" });
      
      if (errors.value.length == 0) {
        const postData: IPostdata = {
          method: "POST",
          body: {},
        };
        var postResult: any = { statusCode: 201 }
        try {
          if (imgMetadata.value.selectedFile) {
            postData.body = getImageInFormData(newFilename)
            postResult = await myFetch( UPLOAD_AP, postData)
          }
        } catch (err) {
          postResult.statusCode = 500
          errors.value.push({ field: "", text: 'podcast.validation.saveingimg' })
        }
        if (postResult.statusCode==201) {
          try {
            postData.body = getFields();
            postResult = await myFetch( PODCAST_AP, postData)
          } catch (err) {
            postResult.statusCode = 500
          }
        }
        if (postResult.statusCode == 201) {
          const {generate} = useRss(fields.value.slug);
          await generate();
          ctx.emit("onsaved", fields.value.title)
        }
      }
    }

    function cancel() {
      ctx.emit("oncancel");
    }

    function imageSelected(data: ImageMetadata) {
      imgMetadata.value = { ...data };
    }

    return {
      errors,
      fields,
      enumerations,
      loading,
      hasError,
      getError,
      isEdit,
      getClass,
      imageSelected,
      cancel,
      savePodcast,
      imgMetadata
    };
  },
});
</script>
