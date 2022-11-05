<template>
    <div class="relative">
      <div
        class="absolute top-0 right-6 md:right-8 pl-4 pb-4 h-10 w-6 hover:w-24 md:hover:w-36 text-gray-400 flex flex-col text-xs md:text-sm"
      >
      <div v-for="(item, index) in items" :key="index">
        <NuxtLink :to="item.slug">
          <button
            class="py-1 h-5 md:h-7 w-32 md:w-36 pr-2 rounded-xl hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700"
          >
            <div class="h-5 w-32 md:h-7 md:w-36 flex">
              <div v-if="item.layout=='edit'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#9D9D9D"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              </div>
              <div v-if="item.layout=='add'">
              <svg
                class="h-5 w-5 md:h-6 md:w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#9D9D9D"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              </div>
              <div class="pl-3 md:pl-5">{{$t(item.name)}}</div>
              </div>
            </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import IPageMenuItem from "~~/base/types/IPageMenuItem";

export default defineComponent({
  props: {
    items: Object as PropType<Array<IPageMenuItem>>
  },
  name: "InputArea"
})
</script>