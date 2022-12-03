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
        class="absolute top-10 md:top-16 z-50 bg-white w-full shadow-md"
      >
        <!-- v-show="show" -->
        <div
          class="flex flex-row flex-wrap sm:justify-evenly p-5"
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
                <h1
        class="mt-6 md:mt-12 mb-1 md:mb-4 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;{{ section.name }}&nbsp;
              </h1>
                </div>
                <div class="flex-grow"></div>
              </div>
              <p class="text-sm mb-6 font-thin">
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
    <nav class="px-2 md:px-4 bg-white sticky top-0 shadow-md">
      <div class="h-10 md:h-16 relative flex flex-row justify-between content-center place-content-center place-items-center">
        <div class="w-26 flex flex-row justify-start place-items-center">
            <svg
              class="w-4 h-4 align-middle"
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
          <select
            class="bg-white border-none h-5 md:text-sm text-xs"
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
        <div class="flex-grow flex flex-row place-content-center">
          <nuxt-link class="text-center inline-block" :to="defaultRoute">
            <img src="/img/logo.png" class="h-6 md:h-10" />
          </nuxt-link>
        </div>
        <div class="w-20"></div>
        <div
          class="
            text-gray-700
            hover:text-orange-500
          "
          data-testid="NavBar.clickableElement"
          @click="switchDropdown"
        >
          <svg v-if="!show" class="h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else class="h-6  block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </nav>
    <div class="mt-1"></div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref,onMounted, onBeforeUnmount } from "vue"
import IMenuSection from "~~/base/types/IMenuSection"

export default defineComponent({
  props: {
    menu: Object as PropType<Array<IMenuSection>>,
    defaultRoute: {
      type: String,
      default: "/recent"
    },
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
    function closeIfClickedOutside(event : Event) {
      const target  = event.target as any
      if (target.name==="language_id" || target.nodeName==="OPTION")
        return
      if (!itWasMe && show.value) {
        show.value = false
      }
      itWasMe = false
    }
    function emit(name: String) {
      ctx.emit("menuItemClicked", name)
    }
    function changeLocale(event : Event) {
      ctx.emit("localeChanged", (event.target as any).value)
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