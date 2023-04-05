<script setup lang="ts">
import { onBeforeMount } from "vue";
import { getDefaultMenu, getMenu, initDefaultMenu } from "./base/Menu";
import { useSettings } from "./composables/settingsdata";
import useAuth from "./composables/useAuth";

const settings = await useSettings();

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  window.scrollTo(0, 0);
});

const { logout, initAuth, useAuthUser } = useAuth()
onBeforeMount(() => {
  initAuth()
})

onMounted(() => {
  if (settings.value.enableDarkOption)
    darkmode.value = (colorMode.value == 'dark')
  else {
    colorMode.value = 'light'
    colorMode.preference = 'light'
  }
})

function menuItemClicked(name: string) {
  if (name == "#logout") {
    logout()
  }
}

const user = useAuthUser()
const menu = ref({})
var menudata = {}

if (true || !settings.value.menuSource || settings.value.menuSource.length() == 0) {
  menudata = initDefaultMenu()
}

const { locale } = useI18n()

async function setMenu(locale: string) {
  if (!settings.value.menuSource || settings.value.menuSource === "") {
    menu.value = getDefaultMenu(menudata, (user.value ? user.value.username : ""))
  } else
    menu.value = await getMenu(settings.value.menuSource)
}
setMenu(locale.value)
watch(() => user.value, () => setMenu(locale.value))

const colorMode = useColorMode()
const darkmode = ref(false)
function switchColorMode() {
  if (!settings.value.enableDarkOption)
    return
  colorMode.value = (colorMode.value == 'dark' ? 'light' : 'dark')
  colorMode.preference = colorMode.value
  darkmode.value = (colorMode.value == 'dark')
}

</script>
<template>
  <div class="theme-ccf"></div> <!-- this is to prevent postcss to remove the theme -->
  <div :class="settings.skin">
    <div class="bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark h-screen">
      <NavBar :menu="menu" :closeOnScroll="settings.closeOnScroll" @menuItemClicked="menuItemClicked"
        :enableDarkOption="settings.enableDarkOption" :logo="(darkmode ? settings.logo_w : settings.logo)"
        :darkmode="darkmode" @colorModeChanged="switchColorMode" />
      <NuxtPage />
    </div>
  </div>
</template>
