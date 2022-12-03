<script setup lang="ts">
// import { IUser } from "~/types/IUser";
import { useI18n } from "vue-i18n";
import IMenuSection from "./base/types/IMenuSection";
import { useUser, userLogout } from "./composables/authentication";

const nuxtApp = useNuxtApp();
const defaultRoute = useRuntimeConfig().defaultRoute;

nuxtApp.hook("page:finish", () => {
  window.scrollTo(0, 0);
});
const i18n = useI18n();
var id = 0
function getMenu(loggedin: boolean, username: string) : Array<IMenuSection> {
  var menu = [       {
          id: id++,
          name: i18n.t("menu.admin"),
          description: i18n.t("menu.adminsub"),
          entries: [],
        },
        {
          id: id++,
          name: i18n.t("menu.podcasts"),
          description: i18n.t("menu.podcastsub"),
          entries: [
            {
              id: id++,
              slug: "/podcasts",
              name: i18n.t("menu.list"),
            },
            {
              id: id++,
              slug: "/recent",
              name: i18n.t("menu.recent"),
            },
            {
              id: id++,
              slug: "/serie",
              name: i18n.t("menu.series"),
            }
          ],
        },
      ];
      if (!loggedin) {
        menu[0].entries.push({
          id: id++,
          slug: "/admin/login",
          name: i18n.t("menu.login"),
        });
      } else {
        menu[0].entries.push({
          id: id++,
          slug: "#logout",
          name: i18n.t("menu.logout"),
        });
        menu[0].entries.push({
          id: id++,
          slug: "/admin/invitation",
          name: i18n.t("menu.invitataion"),
        });
        menu[0].entries.push({
          id: id++,
          slug: "/admin/setpassword",
          name: i18n.t("menu.changepassword"),
        });
        if (username && username.startsWith('admin'))
          menu[0].entries.push({
            id: id++,
            slug: "/admin/import",
            name: i18n.t("menu.import"),
          });
        menu[1].entries.push({
          id: id++,
          slug: "/admin/new-podcast",
          name: i18n.t("menu.new"),
        });
        menu[1].entries.push({
          id: id++,
          slug: "/admin/new-serie",
          name: i18n.t("menu.newseries"),
        });
      }
  return menu;
}

const { useAuthUser, initAuth, useAuthLoading, logout } = useAuth()
const user = useAuthUser()
onBeforeMount(() => {
    initAuth()
})

const loggedin = computed( () => (user.value?true:false) )
const menu = computed( () => getMenu(loggedin.value, user.value?.username) )

function localeChanged(value) {
  i18n.locale.value = value;
}
function menuItemClicked(name) {
  if (name=="#logout") {
    logout()
  }
}
</script>
<template>
  <div>
    <NavBar :menu="menu" :defaultRoute="defaultRoute" :availableLocales="$i18n.availableLocales" :locale="$i18n.locale" @localeChanged="localeChanged" @menuItemClicked="menuItemClicked"/>
    <NuxtPage />
  </div>
</template>
