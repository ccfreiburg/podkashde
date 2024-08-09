<template>
    <div>
      <button v-if="item.page && (item.page as Page).slug.startsWith('#')"
                  data-testid="menuItemEvent" @click="menuItemClicked((item.page as Page).slug)">
                  <slot></slot>
                </button>
                <button v-if="item.link && item.link.startsWith('#')"
                  data-testid="menuItemEvent" @click="menuItemClicked(item.link)">
                  <slot></slot>
                </button>
                <button v-else-if="!item.local && item.link && item.link.startsWith('http')"
                  data-testid="menuItemEvent">
                  <a :href="item.link">
                    <slot></slot>
                  </a>
                </button>
                <button v-else-if="!item.local && item.page && (item.page as Page).slug.startsWith('http')"
                  data-testid="menuItemEvent">
                  <a :href="(item.page as Page).slug">
                    <slot></slot>
                  </a>
                </button>
                <button v-else-if="item.local"
                  data-testid="menuItemEvent">
                  <a :href="item.link">
                    <slot></slot>
                  </a>
                </button>
                <NuxtLink v-else-if="item.page" data-testid="NavBar.menuItem" :to="localePath('/' + (item.page as Page).slug,(item.page as Page).locale)">
                    <slot></slot>
                </NuxtLink>
                <div v-else>
                    <slot></slot>
                </div>

    </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'MenuLink',
  props: {
    item: {
        type: Object,
        required: true
    }
  },
  emits: ["menuItemClicked"],
  setup(props, ctx) {
    const localePath = useLocalePath();
    function menuItemClicked(slug : string) {
        ctx.emit('menuItemClicked',slug)
    }
    return {
        menuItemClicked,
        localePath
    }
  }
})
</script>

