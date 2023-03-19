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

function menuItemClicked(name: string) {
  if (name == "#logout") {
    logout()
  }
}

const user = useAuthUser()
const menu = ref({})
var menudata = {}
const theme = ref("")
const logo_w = ref("/img/logo-w.png")
const logo_b = ref("/img/logo-b.png")

if (true || !settings.value.menuSource || settings.value.menuSource.length() == 0) {
  menudata = initDefaultMenu()
}

if (settings.value.skin) {
  theme.value = settings.value.skin
}
if (settings.value.logo_w) {
  logo_w.value = settings.value.logo_w
}
if (settings.value.logo) {
  logo_b.value = settings.value.logo
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
const darkmode = ref(colorMode.value == 'dark')
const logo = ref(colorMode.value == 'dark' ? logo_w.value : logo_b.value);
function switchColorMode() {
  colorMode.value = (colorMode.value == 'dark' ? 'light' : 'dark')
  colorMode.preference = colorMode.value
  logo.value = (colorMode.value == 'dark' ? logo_w.value : logo_b.value);
  darkmode.value = (colorMode.value == 'dark')
}

</script>
<template>
  <div :class="theme">
    <div class="bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark">
      <NavBar :menu="menu" :closeOnScroll="settings.closeOnScroll" @menuItemClicked="menuItemClicked" :logo="logo"
        :darkmode="darkmode" @colorModeChanged="switchColorMode" />
      <NuxtPage />
    </div>
  </div>
</template>
