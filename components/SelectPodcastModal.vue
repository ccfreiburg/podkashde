<template>
  <!-- Modal -->
  <div
    class="fade fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto bg-white bg-opacity-40"
  >
    <div class="relative mx-10 top-1/3 w-auto pointer-events-none">
      <div
        class="border-2 shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current"
      >
        <div
          class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md"
        >
          <h5
            class="text-md font-medium leading-normal text-gray-800"
            id="exampleModalLabel"
          >
            {{ $t('podcast.change') }}
          </h5>
        </div>
        <div class="modal-body relative p-4">
          <single-select
            title="podcast"
            label="podcast.headline"
            v-model:value="selectedPodcast"
            :options="podselect"
            :errors="[]"
          ></single-select>
        </div>
        <div class="px-5 text-sm text-red-600">
          {{ error }}
        </div>
        <div
          class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md"
        >
          <div class="flex flex-row justify-end">
            <button
              class="ccf-button ccf-secondary"
              @click="cancel"
            >
              {{ $t('cancel') }}
            </button>
            <button
              class="ccf-button ccfbutton-border"
              @click="submit"
            >
              {{ $t('episode.saveEpisode') }}
            </button>
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
  setup( props, {emit}) {
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
      emit("submit",selectedPodcast.value)
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
