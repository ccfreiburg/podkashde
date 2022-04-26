<template>
  <div>
    <div class="fixed inset-x-0 top-0 z-10 bg-opacity-90 bg-gray-50">
      <nav id="nav" class="flex flex-row justify-between items-center">
        <img src="../assets/logo.png" class="h-10 m-3" />
        <!-- Nav Items Working on Tablet & Bigger Sceen -->
        <div
          class="p-4 hidden md:flex flex-row justify-between items-center"
        ></div>
        <!-- Burger Nav Button on Mobile -->
        <div id="burger" class="p-4 md:hidden">
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
});
</script>
