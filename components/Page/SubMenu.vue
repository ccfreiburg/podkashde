<template>
  <div>
    <BaseContainerClean >
      <div> </div>
      <div class="relative">
      
    <div class="absolute top-0 right-0 flex flex-col text-xs sm:right-0 text-skin-muted dark:text-skin-muted-dark md:text-sm rounded-xl hover:bg-skin-light dark:hover:bg-skin-dark opacity-90">
      <div v-for="(item, index) in items" :key="index">
        <button v-if="item.slug.startsWith('#')" class="w-40 h-5 pb-2 md:h-6 md:w-44" @click="emit(item.slug)">
          <div
            class="z-40 flex justify-end w-40 h-5 md:h-6 md:w-44 place-content-center hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
            <div class="h-10 pr-1 text-right text-transparent">{{ $t(item.name) }}</div>
            <icon-selector :layout="item.layout" />
          </div>
        </button>      
        <NuxtLink v-else :to="localePath(item.slug)" class="w-40 h-5 pt-1 pb-2 md:h-6 md:w-44">
          <div
            class="z-40 flex justify-end w-40 h-5 md:h-6 md:w-44 place-content-center hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-skin-from via-skin-via to-skin-to">
            <div class="h-10 pr-1 text-right text-transparent">{{ $t(item.name) }}</div>
            <icon-selector :layout="item.layout" />
          </div>
        </NuxtLink>
      </div>
    </div></div>
  </BaseContainerClean>
  </div>
</template>
<script lang="ts">

export default defineComponent({
  props: {
    items: Object,
  },
  name: 'SubMenu',
  setup(props, { emit }) {
    const localePath = useLocalePath();
    return {
      localePath, 
      emit: (value: string) => emit('menuItemClicked', value),
    };
  },
});
</script>
