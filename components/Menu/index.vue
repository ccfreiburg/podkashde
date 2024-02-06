<template>
    <div class="z-50 w-full h-full pt-2 shadow-md" @click="emptyClick">
        <div class="flex flex-col p-5 place-items-center">
          <div class="w-2/3 my-6" v-for="(section, idx) in menu" :key="idx">
            <div class="container flex flex-col mx-auto mt-8 place-items-center">
              <MenuLink :item="section" @menuItemClicked="menuItemClicked">
                <BaseH1>
                  <div class="flex flex-row flex-nowrap">
                  <div>
                    {{ section.Name }}
                  </div>
                  <div>

                  <svg class="w-6 h-6 mt-1 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">
                </path>
              </svg>
            </div>
          </div>
                </BaseH1>
              </MenuLink>
              <p class="mt-5 mb-5 text-normal tracking-wide font-bold text-[#888888]">
                {{ section.Description }}
              </p>
              <div class="flex flex-row flex-wrap justify-center">
              <div v-for="(entry, index) in section.menu_items" :key="index">
                <MenuButton v-if="!section.admin || notxor(entry.loggedin, user)"  :item="entry" @menuItemClicked="menuItemClicked">
                  <div class="flex flex-row flex-nowrap">
                  <div>
                    {{ entry.Name }}&nbsp;
                  </div>
                  <div>

                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">
                </path>
              </svg>
            </div>
          </div>

                </MenuButton>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Menu',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  //emits: ["menuItemClicked"],
  async setup(props, ctx) {
    var itWasMe = '';
    const showMenu = ref(false)
    const localePath = useLocalePath()
    const {user} = useAuth()
    
    function menuItemClicked(name: string) {
      ctx.emit('menuItemClicked', name);
    }
    function emptyClick() {
      ctx.emit('emptyClick');
    }
    function notxor(b1: boolean, b2: boolean): boolean {
      return b1 && b2 || !b1 && !b2
    }
    
    return {
      showMenu,
      localePath,
      menuItemClicked,
      emptyClick,
      notxor,
      user
    };
  },
});
</script>
