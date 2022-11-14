<template>
  <div>
    <div class="w-full flex justify-center">
      <div
        class="mt-6 md:mt-12 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;Recent Episodes&nbsp;
      </div>
    </div>
    <div class="w-full h-screen bg-gray-200 flex justify-center">
      <div class="w-11/12 md:w-2/3 md:h-60 flex flex-row">
      <episodes-list :episodes="episodes" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEnumerations } from '~~/composables/enumerationdata';
const { refresh, episodes } = await useEpisodes();
</script>
