<template>
  <!-- Modal -->
  <div
    class="fixed top-0 left-0 z-50 w-full h-full overflow-x-hidden overflow-y-auto outline-none fade bg-skin-muted dark:bg-skin-muted-dark bg-opacity-80 dark:bg-opacity-80">
    <div class="relative w-auto mx-10 pointer-events-none top-1/3">
      <div
        class="relative flex flex-col w-full text-current border-2 rounded-md shadow-lg outline-none pointer-events-auto bg-skin-muted dark:bg-skin-muted-dark border-skin-light dark:border-skin-dark bg-clip-padding">
        <div
          class="flex items-center justify-between flex-shrink-0 p-4 border-2 modal-header border-skin-light dark:border-skin-dark rounded-t-md">
          <h5 class="font-medium leading-normal text-md text-skin-base dark:text-skin-dark" id="exampleModalLabel">
            {{ $t('podcast.change') }}
          </h5>
        </div>
        <SingleSelect class="p-4" title="podcast" label="podcast.headline" v-model:value="selectedPodcast" name="select_podcast"
          :options="podselect" :errors="[]"></SingleSelect>
        <div class="px-5 text-sm text-skin-error">
          {{ error }}
        </div>
        <div class="flex flex-wrap items-center justify-end flex-shrink-0 px-4 pb-5 modal-footer rounded-b-md">
          <div class="flex flex-row justify-end">
            <BaseButtonSecondary class="mr-4" @click="cancel">
              {{ $t("cancel") }}
            </BaseButtonSecondary>
            <BaseButtonPrimary data-testid="submit" @click="submit">
              {{ $t('episode.saveEpisode') }}
            </BaseButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type {IPodcast} from "~~/base/types/IPodcast";

export default defineComponent({
  props: {
    error: String,
    podcasts: Object as PropType<Array<IPodcast>>,

  },
  name: "iconselector",
  setup(props, { emit }) {
    const selectedPodcast = ref(0);
    const podselect = computed(() => {
      return props.podcasts?.map((p) => {
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
