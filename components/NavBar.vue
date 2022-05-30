<template>
  <div>
    <div class="fixed inset-x-0 top-0 z-10 bg-opacity-90 bg-gray-50">
      <nav id="nav" class="flex flex-row justify-between items-center">
        <img src="~/assets/logo.png" class="h-10 m-3" />
        <div
          class="
            p-4
            hidden
            md:flex
            flex-row
            justify-between
            flex-grow
            items-center
          "
        >
          Test
        </div>
        <div class="p-4 hover:text-orange-500" @click="onback">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div
          id="burger"
          class="p-4 text-grey-300 hover:text-orange-500 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-menu"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
      </nav>
    </div>
    <div class="mt-20"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavBar",
  methods: {
    onback() {
      const router = useRouter();
      router.go(-1);
    },
  },
});
</script>
