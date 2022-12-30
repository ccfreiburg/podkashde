<template>
  <div class="relative">
    <div
      class="absolute top-0 right-2 sm:right-4 text-gray-500 
      flex flex-col text-xs md:text-sm rounded-xl hover:bg-white opacity-90"
    >
      <div v-for="(item, index) in items" :key="index">
        <button
          v-if="item.slug.startsWith('#')"
          class="pb-2 h-5  w-40 md:h-6 md:w-44"
          @click="emit(item.slug)"
        >
          <div class="h-5 md:h-6 w-40 z-40 md:w-44 flex place-content-center justify-end hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 ">
            <div class="h-10 pr-1 text-transparent text-right">{{ $t(item.name) }}</div>
            <icon-selector :layout="item.layout" />
          </div>
        </button>
        <NuxtLink 
          v-else :to="localePath(item.slug)"
          class="pb-2 pt-1 h-5 w-40 md:h-6 md:w-44" 
        >
          <div class="h-5 md:h-6 w-40 z-40 md:w-44 flex place-content-center justify-end hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 ">
            <div class="h-10 pr-1 text-transparent text-right">{{ $t(item.name) }}</div>
            <icon-selector :layout="item.layout" />
          </div>
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
  setup(props, { emit }) {
    const localePath = useLocalePath();
    return {
      emit: (value: string) => emit('menuItemClicked', value),
    };
  },
});
</script>
