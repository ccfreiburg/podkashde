<template>
  <div>
    <nav ref="navelement" class="flex flex-col items-center px-2 pt-4 pb-2 bg-white shadow-md sm:px-4">
      <div class="w-10/12
                          md:w-11/12
                          xl:w-8/12
                          2xl:w-[1280px]
                          2xl:mx-10
                          flex justify-between">
        <div class="relative flex flex-row items-center w-1/6 flex-nowrap">
          <button @click="toggle('language')" class="inline-flex items-center text-sm font-medium text-center rounded-lg"
            type="button"> 
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9">
              </path>
            </svg>
            <div class="invisible w-0 text-xs sm:w-14 sm:visible">{{ $t(locale) }}</div>
            <svg class="invisible w-4 h-4 sm:visible" aria-hidden="true" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div v-show="showDropdown" class="absolute bg-white border-2 rounded shadow top-10 left-6 w-44">
            <ul class="py-1 text-sm text-gray-700">
              <li class="p-1" v-for="navLocale in locales.map((item)=>item.code) as string[]" :key="navLocale">
                <NuxtLink v-if="otherLanguagesNav.hasOwnProperty(navLocale)" :to="otherLanguagesNav[navLocale]" @click="localeChanged(navLocale)">
                  {{ $t(navLocale) }}
                </NuxtLink>
                <div v-else>{{ $t(navLocale) }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="content-center flex-grow text-center align-middle">
          <NuxtLink :to="localePath('/')" class="inline-block">
            <img src="~/assets/img/logo.png" class="m-1 h-7 sm:h-14" />
          </NuxtLink>
        </div>
        <div class="flex flex-row items-center w-1/6 place-content-end">
          <div class="hover:text-orange-500 hover:cursor-pointer" data-testid="NavBar.clickableElement" @click="toggle('menu')">
            <svg v-if="!menuVisible" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
    <div class="mt-4"></div>
  </div>
</template>

<script lang="ts">

export default defineComponent({
  name: 'NavBar',
  props: {
    menuVisible: Boolean,
    otherLanguagesNav: {
      type: Object,
      default: { de: '/', en: '/en' }
    }
  },
  //emits: ["menuItemClicked"],
  setup(props, ctx) {
    var itWasMe = '';
    const showDropdown = ref(false);
    const { locale, locales, setLocale } = useI18n();
    const localePath = useLocalePath();
    const switchLocalePath = useSwitchLocalePath();
    onMounted(() => {
      document.addEventListener('click', closeIfClickedOutside);
      document.addEventListener('scroll', closeIfScrolled);
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeIfClickedOutside);
      document.removeEventListener('scroll', closeIfScrolled);
    })

    function toggle(what: string) {
      itWasMe = what;
      if (what == 'language') showDropdown.value = !showDropdown.value;
      else {
        ctx.emit('menuButtonClick')
      }
    }
    function hide() {
      showDropdown.value = false;
      ctx.emit('closeAll')
    }
    function closeIfClickedOutside(event: any) {
      if (
        event.target.name === 'language_id' ||
        event.target.nodeName === 'OPTION' ||
        event.target.nodeName === 'LI'
      )
        return;
      if (itWasMe === '') {
        hide();
      }
      itWasMe = '';
    }

    function closeIfScrolled(event: any) {
      closeIfClickedOutside(event)
    }

    function localeChanged(locale: string) {
      ctx.emit('localeChanged', locale);
    }
    return {
      showDropdown,
      locale,
      locales,
      localePath,
      setLocale,
      toggle,
      hide,
      localeChanged
    };
  },
});
</script>
