<template>

<div class="flex place-items-end items-center place-content-end h-10 sm:h-16 mt-1">
    <div v-if="!searchHiden" class="flex flex-row items-center flex-nowrap">
      <input class="h-8 sm:h-10 border-[2px] border-skin-light dark:border-skin-dark dark:border-[1px] 
      px-3 py-1 mt-1 rounded-md bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark 
      focus:outline-none focus:ring-[1px] focus:ring-skin-fokus sm:mr-2 mr-1"
          type="text" name="search" id="search" :value="value"  @input="updateEvent" />
      <div @click="close">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="h-5 w-5 sm:w-6 sm:h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
      </div>
      </div>
    </div>
    <div v-else @click="toggleSearch">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="currentColor" class="h-5 w-5 sm:w-6 sm:h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </div>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  props: {
    focus: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
      required: true,
    },
  },
  name: "InputArea",
  setup(props, ctx) {
    const searchHiden = ref(true);

    function close() {
          ctx.emit("update:value", '');
          searchHiden.value = true;
    }
    function updateEvent(event: any) {
      ctx.emit("update:value", event.target.value);
    }
    watch( ()=>props.focus, () => {
      if (props.focus) {
        const input = document.getElementById(props.name as string);
        input?.focus()
      }
    } )
    const toggleSearch = function () {
      searchHiden.value = !searchHiden.value;
      nextTick(() => {
        if (!searchHiden.value) {
          const el = document.getElementById('search')
          if (el)
            el.focus()
        }
      })
    }
    return {
      updateEvent,
      close,
      searchHiden,
      toggleSearch
    };
  },
});
</script>
