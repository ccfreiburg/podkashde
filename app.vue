<script setup lang="ts">
// import { IUser } from "~/types/IUser";
import { useI18n } from "vue-i18n";
import IMenuSection from "./base/types/IMenuSection";
import { useUser } from "./composables/authentication";

const nuxtApp = useNuxtApp();

nuxtApp.hook("page:finish", () => {
  window.scrollTo(0, 0);
});
const user = useState("user");
const loggedin = user != null;
const i18n = useI18n();
var id = 0
function getMenu() : Array<IMenuSection> {
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
              slug: "/",
              name: i18n.t("menu.list"),
            },
          ],
        },
      ];
if (!loggedin) {
        menu[0].entries.push({
          id: id++,
          slug: "/login",
          name: i18n.t("menu.login"),
        });
      } else {
        menu[0].entries.push({
          id: id++,
          slug: "/?logout=true",
          name: i18n.t("menu.logout"),
        });
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
          slug: "/",
          name: i18n.t("menu.recent"),
        });
        menu[1].entries.push({
          id: id++,
          slug: "/",
          name: i18n.t("menu.series"),
        });
      }
  return menu;
}
const menu = ref(getMenu())

function localeChanged(value) {
  i18n.locale.value = value;
  menu.value = getMenu()
}
</script>
<template>
  <NavBar :menu="menu" :availableLocales="$i18n.availableLocales" :locale="$i18n.locale" @localeChanged="localeChanged"/>
  <NuxtPage class="p-3"/>
</template>
