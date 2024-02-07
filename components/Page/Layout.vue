<template>
  <div>
    <PageNavBar
      :closeOnScroll="false"
      :menuVisible="showMenu"
      :showMenuButton="!loading"
      @menuButtonClick="menuButtonClick"
      class="sticky top-0 z-40"
    />
    <div v-if="showMenu" class="w-full h-full bg-white shadow-md">
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
        v-if="user != null"
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
export default defineComponent({
  name: "NavBar",
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
    const { menu, refresh, loading } = useMetaData(locale.value, true);
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
    return {
      menuButtonClick,
      menuItemClicked,
      showMenu,
      menu,
      loading,
      user
    }
  },
});
</script>
