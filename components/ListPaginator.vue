<template>
  <div>
  <div
    v-if="countPages>1"
    class="flex items-center justify-between border-t border-gray-200 px-4 py-3"
  >
    <div data-testid="ListPaginator.sm" class="flex flex-1 justify-between sm:hidden">
      <button
        @click="previous"
        data-testid="ListPaginator.sm_previous"
        class="inline-flex items-center rounded-md px-4 py-2 text-xs font-medium"
        :class="getClass('previous')"
        :disabled="selectedPage<=1"
      >
        {{ $t('paginator.previous') }}
      </button>
      <p class="text-xs tracking-widest font-bold text-gray-500">
          {{$t('paginator.statusshort', [selectedPage,countPages])}}
        </p>
      <button
        @click="next"
        data-testid="ListPaginator.sm_next"
        class="inline-flex items-center rounded-md px-4 py-2 text-xs font-medium"
        :class="getClass('next')"
        :disabled="selectedPage>=countPages"
      >
        {{ $t('paginator.next') }}
      </button>
    </div>
    <div class="hidden sm:pt-6 sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>      
        <p class="text-sm md:text-ml tracking-widest font-bold text-gray-500">
          {{$t('paginator.status', getStatus())}}
        </p>
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            :class="getClass('previous')"
            :disabled="selectedPage<=1"
            data-testid="ListPaginator.lg_previous"
            class="relative inline-flex items-center text-sm font-medium focus:z-20 px-2 py-2"
            @click="previous"
          >
            <span class="sr-only">{{ $t('paginator.previous') }}</span>
            <!-- Heroicon name: mini/chevron-left -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
          <div v-for="page in pagesList" :key="page">
            <div v-if="page==selectedPage">
              <button
            disabled
            class="relative w-8 inline-flex items-center text-b text-sm font-medium focus:z-20 px-2 py-2"
          >{{page}}</button>
        </div><div v-else>
          <button
            data-testid="ListPaginator.setpage"
            class="relative w-8 inline-flex items-center text-gray-500 text-sm font-bold focus:z-20 px-2 py-2"
            :class="getClass(page)"
            @click="(typeof page=='number'?setPage(page):'')"
          >{{page}}</button>
        </div>
        </div>
         <button
            :class="getClass('next')"
            :disabled="selectedPage>=countPages"
            data-testid="ListPaginator.lg_next"
            class="relative inline-flex items-center text-sm font-medium focus:z-20 px-2 py-2"
            @click="next"
          >
            <span class="sr-only">{{ $t('paginator.next') }}</span>
            <!-- Heroicon name: mini/chevron-right -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts">
import { ref, watch, defineComponent } from 'vue';
import { NUM_PAGINATION_LINKS } from '../base/Constants';

export function pageLabelList(current: number, countPages: number) : Array<number|string>  {
  const ret = [] as Array<number|string>
  if (countPages<=1)
     return ret
  const delta = 1
  const left = current - delta
  const right = current + delta + 1
  const borderdist = NUM_PAGINATION_LINKS - 2*delta
  var l : number = 0
  const range = [] as Array<number>

  for (let i = 1; i <= countPages; i++) {
    if (i == 1 || 
        i == countPages || 
        i >= left && i < right || 
        countPages<=NUM_PAGINATION_LINKS || 
        current > countPages-borderdist+1 && i > countPages-borderdist ||
        current < borderdist && i <= borderdist) {
      range.push(i);
    }
  }
  for (let i of range) {
    if (l && countPages>NUM_PAGINATION_LINKS) {
      if (i - l === 2) {
        ret.push(l + 1);
      } else if (i - l !== 1) {
        ret.push('...');
      }
    }
      ret.push(i);
      l = i;
  }
  return ret;
}

export default defineComponent({
  props: {
    itemsperpage: {
      type: Number,
      default: 10,
      required: false,
    },
    max: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  name: 'ListPaginator',
  setup(props, ctx) {
    const selectedPage = ref(props.value)
    const countPages = ref((props.max%props.itemsperpage==0?Math.floor(props.max/props.itemsperpage):Math.floor(1+props.max/props.itemsperpage))) 
    const pagesList = ref(pageLabelList(props.value,countPages.value))
    
    watch(selectedPage,(newVal) => {
      pagesList.value=pageLabelList(selectedPage.value,countPages.value)
      updateEvent(newVal)
    })
    function setPage( pageNum: number ) {
      selectedPage.value = pageNum
    }
    function getClass(elem: string | number) : string {
      if (typeof elem == 'number')
        return "hover:text-orange-600"
      if (elem=="...")
        return "disabled"
      if (elem=='previous' && selectedPage.value>1 || elem=='next' && selectedPage.value<countPages.value)
        return 'sm:border-0 border border-gray-300 text-gray-700 hover:bg-gray-50 sm:hover:bg-transparent sm:hover:text-orange-500'
      else return 'sm:border-0 border border-gray-200 text-gray-500'
    }
    function getStatus() : Array<number> {
      const start = (selectedPage.value-1)*props.itemsperpage+1
      const block = start+props.itemsperpage-1
      return [
        start,
        (selectedPage.value==countPages.value?props.max-1%props.itemsperpage+1:block),
        props.max
      ]
    }
    function previous() {
      if (selectedPage.value>1)
        selectedPage.value--
    }
    function next() {
      if (selectedPage.value<countPages.value)
        selectedPage.value++
    }
    function updateEvent(page: number) {
      ctx.emit('update:value', page)
    }
    return {
      getClass,
      getStatus,
      selectedPage,
      previous,
      next,
      countPages,
      pagesList,
      setPage
    };
  },
});
</script>
