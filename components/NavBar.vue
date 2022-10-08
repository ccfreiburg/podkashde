<template>
  <div>
    <transition
      enter-from-class="translate-x-[150%] opacity-0"
      enter-active-class="transition duration-400"
      leave-active-class="transition duration-400"
      leave-to-class="translate-x-[150%] opacity-0"
    >
      <div
        v-if="show"
        class="absolute top-20 z-50 bg-white w-full shadow-md"
      >
        <!-- v-show="show" -->
        <div
          class="flex flex-row flex-wrap justify-evenly p-5"
          @click="hideDropdown"
        >
          <div class="w-100 mb-8" v-for="section in menu" :key="section.id">
            <div class="container px-4 mx-auto flex flex-col">
              <div class="flex flex-row">
                <div
                  class="
                    mb-4
                    px-2
                    leading-tight
                    tracking-tighter
                    shrink
                    ccfunderline
                  "
                >
                  <h1 class="text-3xl md:text-4xl font-bold">
                    &nbsp;{{ section.name }}&nbsp;
                  </h1>
                </div>
                <div class="flex-grow"></div>
              </div>
              <p class="text-sm mt-2 mb-6 font-thin">
                {{ section.description }}
              </p>
              <div v-for="entry in section.entries" :key="entry.id">
                <button v-if="entry.slug.startsWith('#')" data-testid="NavBar.menuItemEvent" @click="emit(entry.slug)">
                  {{ entry.name }}
                </button>
                <NuxtLink v-else data-testid="NavBar.menuItem" :to="entry.slug">
                  {{ entry.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </transition>
    <nav class="px-4 sm:px-10 py-4 bg-white sticky top-0 shadow-md">
      <div class="relative flex justify-between">
        <div class="flex flex-row">
          <div class="mt-4 mr-2">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              ></path>
            </svg>
          </div>
          <select
            class="bg-white mt-1 h-10 border-none"
            name="language_id"
            data-testid="NavBar.localeSelect" 
            v-model="currentLocale"
            @change="changeLocale"
          >
            <option
              v-for="(local, index) in availableLocales"
              :key="index"
              :value="local"
            >
              {{ $t(local.toString()) }}
            </option>
          </select>
        </div>
        <div class="flex-grow content-center text-center align-middle">
          <nuxt-link class="inline-block" to="/">
            <img src="/assets/img/logo.png" class="h-14 m-1" />
          </nuxt-link>
        </div>
        <div
          class="
            pt-3
            ^
            text-gray-500
            w-14
            h-14
            justify-center
            items-center
            hover:text-orange-500
          "
          data-testid="NavBar.clickableElement"
          @click="switchDropdown"
        >
          <svg v-if="!show"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </nav>
    <div class="mt-1"></div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref,onMounted, onBeforeUnmount } from "vue";
import IMenuSection from "~~/base/types/IMenuSection";

export default defineComponent({
  props: {
    menu: Object as PropType<Array<IMenuSection>>,
    availableLocales: Object as  PropType<Array<String>>,
    locale:  String
  },
  emits: ["localeChanged", "menuItemClicked"],
  name: "NavBar",
  setup(props, ctx) {
    const show = ref(false)
    const currentLocale = ref(props.locale)
    var itWasMe = false

    function switchDropdown() {
      itWasMe = true
      show.value = !show.value;
    }
    function hideDropdown() {
      show.value = false
    }
    function closeIfClickedOutside(event) {
      if (event.target.name==="language_id" || event.target.nodeName==="OPTION")
        return
      if (!itWasMe && show.value) {
        show.value = false
      }
      itWasMe = false
    }
    function emit(name: String) {
      ctx.emit("menuItemClicked", name)
    }
    function changeLocale(event) {
      ctx.emit("localeChanged", event.target.value)
    }

    onMounted(() =>  {
      document.addEventListener("click", closeIfClickedOutside)
      document.addEventListener("scroll", closeIfClickedOutside);

    })
    onBeforeUnmount(() => {
      document.removeEventListener("click", closeIfClickedOutside)
      document.removeEventListener("scroll", closeIfClickedOutside);
    })    
    return {
      show,
      switchDropdown,
      hideDropdown,
      changeLocale,
      availableLocales: props.availableLocales,
      currentLocale,
      emit
    }
  }
})
</script>