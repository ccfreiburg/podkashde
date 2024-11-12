<template>
    <div>
                <button v-if="item.link && item.link.startsWith('#')"
                  data-testid="menuItemEvent" @click="menuItemClicked(item.link)">
                  <slot></slot>
                </button>
                <button v-else-if="item.link && item.link.startsWith('http')"
                  data-testid="menuItemEvent">
                  <a :href="item.link">
                    <slot></slot>
                  </a>
                </button>
                <button v-else-if="item.local"
                  data-testid="menuItemEvent">
                  <a :href="item.link">
                    <slot></slot>
                  </a>
                </button>
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

