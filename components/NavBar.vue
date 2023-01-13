<template>
  <div>
    <nav ref="navelement" class="px-2 sm:px-4 pt-2 bg-white shadow-md">
      <div class="flex justify-between">
        <div class="w-1/6 z-40 relative flex flex-row items-center flex-nowrap">
          <svg
            class="w-4 h-4 z-40 sm:w-5 sm:h-5"
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
          <button
            @click="toggle('language')"
            class="font-medium rounded-lg text-sm text-center inline-flex items-centent"
            type="button"
          >
            <div class="w-0 sm:w-16 invisible sm:visible">{{ localeName }}</div>
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div
            v-show="showDropdown"
            class="absolute border-2 w-44 bg-white rounded shadow"
          >
            <ul class="py-1 text-sm text-gray-700">
              <li class="p-1" v-for="local in locales" :key="local.code">
                <NuxtLink
                  v-if="local.code !== locale"
                  :to="switchLocalePath(local.code)"
                  @click="localeChanged(local.code)"
                  >{{ local.name }}
                </NuxtLink>
                <div v-else>{{ local.name }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex-grow content-center text-center align-middle">
          <a :href="homeLink" class="inline-block">
            <img src="/img/logo.png" class="h-7 sm:h-10 m-1" />
          </a>
        </div>
        <div class="w-1/6 flex flex-row items-center place-content-end">
          <div
            class="text-gray-500 hover:text-orange-500"
            data-testid="NavBar.clickableElement"
            @click="toggle('menu')"
          >
            <svg
              v-if="!showMenu"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
    <transition
      enter-from-class="translate-y-[150%] opacity-0"
      enter-active-class="transition duration-400"
      leave-active-class="transition duration-400"
      leave-to-class="translate-y-[150%] opacity-0"
    >
      <div
        v-if="showMenu"
        class="fixed top-0 pt-2 z-50 bg-white w-full h-screen overflow-y-scroll shadow-md"
      >
        <!-- v-show="show" -->
        <div class="flex px-3 sm:px-4 justify-between">
          <div class="w-1/6"></div>
          <div class="flex-grow content-center text-center align-middle">
            <div class="inline-block">
              <img src="/img/logo.png" class="h-7 sm:h-10 m-1" />
            </div>
          </div>
          <div class="w-1/6 flex justify-end content-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <div
          class="flex flex-row flex-wrap justify-evenly p-5"
          @click="hideDropdown"
        >
          <div
            class="w-80 mb-8"
            v-for="section in menuSections"
            :key="section.order"
          >
            <div class="container px-4 mx-auto flex flex-col">
              <div class="flex flex-row">
                <div
                  class="mb-4 px-2 leading-tight tracking-tighter shrink ccfunderline2"
                >
                  <h1 class="ccf-underline text-xl md:text-2xl font-bold">
                    &nbsp;{{ (hasI18nKeysMenue?$t(section.name):section.name) }}&nbsp;
                  </h1>
                </div>
                <div class="flex-grow"></div>
              </div>
              <p class="text-sm mt-2 mb-6 font-thin">
                {{ (hasI18nKeysMenue?$t(section.description):section.description) }}
              </p>
              <div v-for="(entry, index) in section.entries" :key="index">
                <button
                  v-if="entry.slug.startsWith('#')"
                  data-testid="NavBar.menuItemEvent"
                  @click="menuItemClicked(entry.slug)"
                >
                  {{ (hasI18nKeysMenue?$t(entry.name):entry.name) }}
                </button>
                <button
                  v-else-if="!entry.local && entry.slug.startsWith('http')"
                  data-testid="NavBar.menuItemEvent"
                >
                  <a :href="entry.slug">
                    {{ (hasI18nKeysMenue?$t(entry.name):entry.name) }}
                  </a>
                </button>                <button
                  v-else-if="!entry.local && baseUrl.length > 4"
                  data-testid="NavBar.menuItemEvent"
                >
                  <a :href="getExternalLink(entry)">
                    {{ (hasI18nKeysMenue?$t(entry.name):entry.name) }}
                  </a>
                </button>
                <NuxtLink
                  v-else
                  data-testid="NavBar.menuItem"
                  :to="localePath('/' + entry.slug)"
                >
                  {{ (hasI18nKeysMenue?$t(entry.name):entry.name) }}
                </NuxtLink>
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
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import IMenuItemBase from '~~/base/types/IMenuItemBase';
import IMenuSectionBase from '~~/base/types/IMenuSection';

export default defineComponent({
  name: 'NavBar',
  props: {
    closeOnScroll: Boolean,
    menu: Object,
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
      if (props.menu.defaultBase!="/" )
        baseUrl.value = props.menu.defaultBase
      menuSections.value = (hasI18nKeysMenue.value?props.menu['keys']:props.menu[locale])
      homeLink.value = baseUrl.value+"/"+(locale=="de"?"":locale)
    }
    watch( ()=>props.menu, (newVal) => {
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
    return {
      showMenu,
      showDropdown,
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
