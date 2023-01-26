<template>
  <!-- Modal -->
  <div
    class="fade fixed  z-50  top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto bg-skin-muted dark:bg-skin-muted-dark bg-opacity-80 dark:bg-opacity-80">
    <div class="relative mx-10 top-1/3 w-auto pointer-events-none">
      <div
        class="border-2 shadow-lg relative flex flex-col w-full pointer-events-auto bg-skin-muted dark:bg-skin-muted-dark border-skin-light dark:border-skin-dark bg-clip-padding rounded-md outline-none text-current">
        <div
          class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-2 border-skin-light dark:border-skin-dark  rounded-t-md">
          <h5 class="text-md font-medium leading-normal text-skin-base dark:text-skin-dark" id="exampleModalLabel">
            {{ $t('podcast.change') }}
          </h5>
        </div>
        <single-select class="p-4" title="podcast" label="podcast.headline" v-model:value="selectedPodcast"
          :options="podselect" :errors="[]"></single-select>
        <div class="px-5 text-sm text-skin-error">
          {{ error }}
        </div>
        <div class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end px-4 pb-5 rounded-b-md">
          <div class="flex flex-row justify-end">
            <BaseButtonSecondary class="mr-4" @click="cancel">
              {{ $t("cancel") }}
            </BaseButtonSecondary>
            <BaseButtonPrimary @click="submit">
              {{ $t('episode.saveEpisode') }}
            </BaseButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import IPodcast from "~~/base/types/IPodcast";

export default defineComponent({
  props: {
    error: String,
    podcasts: Object as PropType<Array<IPodcast>>,

  },
  name: "iconselector",
  setup(props, { emit }) {
    const selectedPodcast = ref(0);
    const podselect = computed(() => {
      return props.podcasts.map((p) => {
        return {
          enumvalue_id: p.id,
          displaytext: p.title,
        }
      })
    })
    function submit() {
      emit("submit", selectedPodcast.value)
    }
    function cancel() {
      emit('cancel')
    }
    return {
      selectedPodcast,
      podselect,
      submit,
      cancel
    }
  }
});
</script>
