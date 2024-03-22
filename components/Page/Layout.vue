<template>
<div>
    <PageNavBar
      :closeOnScroll="false"
      :menuVisible="showMenu"
      :showMenuButton="!loading"
      :darkmode="darkmode"
      :logo="logo"
      :enable_dark_option="enableDarkMode"
      @menuButtonClick="menuButtonClick"
      @colorModeChanged="switchColorMode"
      class="sticky top-0 z-40"
    />
    <div v-if="showMenu" class="w-full h-full shadow-md">
      <transition
        enter-from-class="translate-y-[150%] opacity-100"
        enter-active-class="transition duration-400"
        leave-active-class="transition duration-800"
        leave-to-class="translate-y-[150%] opacity-0"
      >
        <Menu
          v-if="menu"
          :menu="menu"
          @emptyClick="menuButtonClick"
          @menuItemClicked="menuItemClicked"
        />
      </transition>
    </div>
    <div :hidden="showMenu">
      <MessageToast></MessageToast>
      <PageSubMenu
        v-if="user && submenu"
        :items="submenu"
        @menuItemClicked="menuItemClicked"
      />
      <div
        v-if="title"
        class="flex justify-center w-full mt-6 mb-10 md:mt-12 md:mb-14"
      >
        <BaseH1 class="">
          {{ title }}
        </BaseH1>
      </div>
      <div data-testid="content-area">
      <slot />
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import {ContentFile} from '../../base/ContentFile'

export default defineComponent({
  name: "PageLayout",
  props: {
    title: {
      type: String,
      default: undefined,
    },
    submenu: {
      type: Object,
      default: undefined,
    },
    otherLanguagesNav: {
      type: Object,
      default: { de: "/", en: "/en" },
    },
  },
  async setup(props, ctx) {
    const { locale } = useI18n();
    const { menu, settings, loading } = useMetaData(locale.value, true);
    const { user } = useAuth();
    const showMenu = ref(false);

    const menuButtonClick = () => {
      showMenu.value = !showMenu.value;
    };

    const menuItemClicked = (event: any) => {
      if (event == "#logout") {
        const { logout } = useAuth();
        logout();
      } else {
        ctx.emit("menuItemClicked", event);
      }
    };
    const colorMode = useColorMode()
const darkmode = ref(true)
function switchColorMode() {
  colorMode.value = (colorMode.value == 'dark' ? 'light' : 'dark')
  colorMode.preference = colorMode.value
  darkmode.value = (colorMode.value == 'dark')
}

const enableDarkMode = useRuntimeConfig().public.enableDarkMode

onMounted(() => {
  if (enableDarkMode)
    darkmode.value = (colorMode.value == 'dark')
  else {
    colorMode.value = 'light'
  }
})
    const logo = computed( () => (darkmode.value ? 
      ContentFile.getMediaUrl(useRuntimeConfig().public.logoDark) : 
      ContentFile.getMediaUrl(useRuntimeConfig().public.logo)) )
    return {
      menuButtonClick,
      menuItemClicked,
      switchColorMode,
      darkmode,
      enableDarkMode,
      showMenu,
      logo,
      menu,
      settings,
      loading,
      user
    }
  },
});
</script>
