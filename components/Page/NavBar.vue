<template>
  <div>
    <nav ref="navelement" class="flex flex-col items-center pt-4 pb-2 shadow-md 
        bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark h-18 sm:h-24">
      <div class="w-10/12
                          md:w-11/12
                          xl:w-8/12
                          2xl:w-[1280px]
                          2xl:mx-10
                          flex justify-between">
        <div class="relative flex flex-row items-center w-1/6 flex-nowrap">
          <button data-testid="show-locale-dropdown" @click="toggle('language')" class="inline-flex items-center text-sm font-medium text-center rounded-lg"
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
          <div v-show="showDropdown" class="absolute border-2 rounded shadow bg-skin-light dark:bg-skin-dark top-10 left-6 w-44">
            <ul class="py-1 text-sm">
              <li class="p-1" v-for="navLocale in locales.map((item)=>item.code) as string[]" :key="navLocale">
                <NuxtLink v-if="otherLanguagesNav.hasOwnProperty(navLocale)" :data-testid="'switch-locale-'+navLocale"  :to="otherLanguagesNav[navLocale]" @click="localeChanged(navLocale)">
                  {{ $t(navLocale) }}
                </NuxtLink>
                <div v-else>{{ $t(navLocale) }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="content-center flex-grow text-center align-middle">
          <NuxtLink :to="localePath('/')" class="inline-block">
            <img :src="$props.logo" class="dark:hidden m-1 w-28 sm:w-48" />
            <img :src="$props.logodark" class="dark:block hidden m-1 w-28 sm:w-48" />
          </NuxtLink>
        </div>
        <div class="flex flex-row items-center w-1/6 place-content-end">
          <div v-if="$props.enableDarkOption" >
            <button class="pr-2 hover:text-skin-accent hover:cursor-pointer" data-testid="NavBar.darkmode"
              @click.stop="switchColorMode">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="dark:block hidden w-4 h-4 sm:w-5 sm:h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="dark:hidden visible w-4 h-4 sm:w-5 sm:h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </button>
        </div>
          <div  v-if="showMenuButton" >
          <button class="hover:text-skin-accent hover:cursor-pointer mt-1" data-testid="NavBar.clickableElement" @click.stop="toggle('menu')">
            <svg v-if="!menuVisible" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
    showMenuButton: {
      type: Boolean,
      default: false
    },
    otherLanguagesNav: {
      type: Object,
      default: { de: '/', en: '/en' }
    },
    logo: String,
    logodark: String,
    enableDarkOption: {
      type: Boolean,
      default: true
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
    function switchColorMode() {
      ctx.emit('colorModeChanged')
    }
    return {
      showDropdown,
      locale,
      locales,
      localePath,
      setLocale,
      toggle,
      hide,
      localeChanged,
      switchColorMode,
    };
  },
});
</script>
