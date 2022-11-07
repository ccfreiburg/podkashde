<template>
  <div class="relative">
    <div
      class="absolute top-0 right-6 md:right-8 pl-4 pb-4 h-10 w-6 hover:w-24 md:hover:w-36 text-gray-400 flex flex-col text-xs md:text-sm"
    >
      <div v-for="(item, index) in items" :key="index">
        <button
          v-if="item.slug.startsWith('#')"
          class="py-1 h-5 md:h-7 w-32 md:w-36 pr-2 rounded-xl hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700"
          @click="emit(item.slug)"
        >
        <div class="h-5 w-32 md:h-7 md:w-36 flex">

          <icon-selector :layout="item.layout" />
          <div class="pl-3 md:pl-5">{{ $t(item.name) }}</div>
          </div>
        </button>
        <NuxtLink v-else :to="item.slug">
          <button
            class="py-1 h-5 md:h-7 w-32 md:w-36 pr-2 rounded-xl hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700"
          >
        <div class="h-5 w-32 md:h-7 md:w-36 flex">

          <icon-selector :layout="item.layout" />
            <div class="pl-3 md:pl-5">{{ $t(item.name) }}</div>
            </div>
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import IPageMenuItem from '~~/base/types/IPageMenuItem';

export default defineComponent({
  props: {
    items: Object as PropType<Array<IPageMenuItem>>,
  },
  name: 'SubMenu',
  setup(props, {emit}) {
    return {
      emit: (value : string) => emit("menuItemClicked", value)
    }
  }
});
</script>
