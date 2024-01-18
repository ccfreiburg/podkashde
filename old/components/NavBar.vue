<template>
  <div class="sticky top-0 z-30 bg-skin-light dark:bg-skin-dark">
    <nav ref="navelement"
      class="px-2 pt-2 shadow-md sm:px-4 bg-skin-ligt dark:bg-skin-dark text-skin-base dark:text-skin-dark">
      <div class="flex justify-between">
        <div class="relative z-40 flex flex-row items-center w-1/6 flex-nowrap">
          <svg class="z-40 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9">
            </path>
          </svg>
          <button @click="toggle('language')" class="inline-flex text-sm font-medium text-center rounded-lg items-centent"
            type="button">
            <div class="invisible w-0 sm:w-16 sm:visible">{{ localeName }}</div>
            <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div v-show="showDropdown" class="fixed top-12">
            <div class="relative z-50 border-2 rounded shadow w-44 bg-skin-light dark:bg-skin-dark">
              <ul class="py-1 text-sm">
                <li class="p-1" v-for="local in locales" :key="local.code">
                  <NuxtLink v-if="local.code !== locale" :to="switchLocalePath(local.code)"
                    @click="localeChanged(local.code)">{{ local.name }}
                  </NuxtLink>
                  <div v-else>{{ local.name }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content-center flex-grow text-center align-middle">
          <a :href="homeLink" class="inline-block">
            <img :src="$props.logo" class="m-1 h-7 sm:h-10" />
          </a>
        </div>
        <div class="flex flex-row items-center w-1/6 place-content-end">
          <div v-if="$props.enableDarkOption" @click.stop="switchColorMode">
            <svg v-if="$props.darkmode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </div>
          <div class="hover:text-skin-accent" data-testid="NavBar.clickableElement" @click="toggle('menu')">
            <svg v-if="!showMenu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
    <transition class="z-30" enter-from-class="translate-y-[150%] opacity-0" enter-active-class="transition duration-400"
      leave-active-class="transition duration-400" leave-to-class="translate-y-[150%] opacity-0">
      <div v-if="showMenu" class="fixed w-screen h-screen top-14 bg-skin-light dark:bg-skin-dark">
        <div
          class="pt-10 overflow-y-scroll shadow-md bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark">
          <!-- v-show="show" -->
          <div class="flex justify-around">
            <div class="mb-8 w-80" v-for="section in menuSections" :key="section.order">
              <div class="container flex flex-col px-4 mx-auto">
                <BaseH1>{{ (hasI18nKeysMenue ? $t(section.name) : section.name) }}</BaseH1>
                <BaseSubtitle>{{ (hasI18nKeysMenue ? $t(section.description) : section.description) }}</BaseSubtitle>
                <div v-for="(entry, index) in section.entries" :key="index">
                  <button v-if="entry.slug.startsWith('#')" data-testid="NavBar.menuItemEvent"
                    @click="menuItemClicked(entry.slug)">
                    {{ (hasI18nKeysMenue ? $t(entry.name) : entry.name) }}
                  </button>
                  <button v-else-if="!entry.local && entry.slug.startsWith('http')" data-testid="NavBar.menuItemEvent">
                    <a :href="entry.slug">
                      {{ (hasI18nKeysMenue ? $t(entry.name) : entry.name) }}
                    </a>
                  </button> <button v-else-if="!entry.local && baseUrl.length > 4" data-testid="NavBar.menuItemEvent">
                    <a :href="getExternalLink(entry)">
                      {{ (hasI18nKeysMenue ? $t(entry.name) : entry.name) }}
                    </a>
                  </button>
                  <NuxtLink v-else data-testid="NavBar.menuItem" :to="localePath('/' + entry.slug)">
                    {{ (hasI18nKeysMenue ? $t(entry.name) : entry.name) }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </transition>
    <div class="mt-4"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type IMenuItemBase from '~~/base/types/IMenuItemBase';
import type IMenuSectionBase from '~~/base/types/IMenuSection';

export default defineComponent({
  name: 'NavBar',
  props: {
    closeOnScroll: Boolean,
    menu: Object,
    logo: String,
    darkmode: Boolean,
    enableDarkOption: {
      type: Boolean,
      default: false
    }
  },
  //emits: ["menuItemClicked"],
  async setup(props, ctx) {
    const navelement = ref(null);
    const localePath = useLocalePath();
    const showMenu = ref(false);
    const showDropdown = ref(false);
    const { locale, locales, setLocale, t } = useI18n();
    var itWasMe = '';
    const switchLocalePath = useSwitchLocalePath();
    const menuSections = ref([] as Array<IMenuSectionBase>);
    const baseUrl = ref("/");
    const hasI18nKeysMenue = ref(true);
    const homeLink = ref(baseUrl.value)

    onMounted(async () => {
      document.addEventListener('click', closeIfClickedOutside);
      document.addEventListener('scroll', closeIfScrolled);
    })
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeIfClickedOutside);
      document.removeEventListener('scroll', closeIfScrolled);
    })

    const localeName = computed(() => {
      const local = locales.value.find((l) => l.code === locale.value);
      return local ? local.name : locale.value;
    });

    const setMenu = (locale: string) => {
      hasI18nKeysMenue.value = props.menu.hasOwnProperty('keys')
      if (props.menu.defaultBase != "/")
        baseUrl.value = props.menu.defaultBase
      menuSections.value = (hasI18nKeysMenue.value ? props.menu['keys'] : props.menu[locale])
      homeLink.value = baseUrl.value + "/" + (locale == "de" ? "" : locale)
    }
    watch(() => props.menu, (newVal) => {
      if (newVal)
        setMenu(locale.value)
    })
    setMenu(locale.value)

    const getExternalLink = (entry: IMenuItemBase): string => {
      var url =
        baseUrl.value +
        '/' +
        (locale.value == 'de' ? '' : locale.value + '/') +
        entry.slug;
      return url;
    };

    function toggle(what: string) {
      itWasMe = what;
      if (what == 'language') showDropdown.value = !showDropdown.value;
      else {
        showMenu.value = !showMenu.value;
      }
    }
    function hide() {
      showDropdown.value = false;
      showMenu.value = false;
    }
    function closeIfClickedOutside(event) {
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

    function closeIfScrolled(event) {
      if (props.closeOnScroll)
        closeIfClickedOutside(event)
    }

    function menuItemClicked(name: string) {
      ctx.emit('menuItemClicked', name);
    }

    function localeChanged(locale: string) {
      setMenu(locale)
      ctx.emit('localeChanged', locale);
    }

    function switchColorMode() {
      ctx.emit('colorModeChanged')
    }
    return {
      showMenu,
      showDropdown,
      switchColorMode,
      menuSections,
      locale,
      locales,
      setLocale,
      localePath,
      localeName,
      toggle,
      hide,
      navelement,
      baseUrl,
      menuItemClicked,
      localeChanged,
      getExternalLink,
      hasI18nKeysMenue,
      homeLink
    };
  },
});
</script>
