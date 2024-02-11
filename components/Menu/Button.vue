<template>
  <MenuLink :item="item" @menuItemClicked="menuItemClicked">
    <div class="px-2 py-1 m-1 border-2 bg-muted dark:bg-skin-muted-dark hover:text-skin-muted dark:hover:text-skin-muted-dark hover:bg-muted dark:hover:bg-skin-muted-dark rounded-xl">
    <!-- bg-[#f3f2f2] border-[#f3f2f2] text-[#888888] hover:bg-white "> -->
        <div class="text-xs font-extrabold tracking-widest uppercase whitespace-nowrap">
        <slot></slot>
    </div>
    </div>
  </MenuLink>
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
  setup(_, ctx) {
    function menuItemClicked(event) {
      ctx.emit("menuItemClicked",event)
    }
    return {
      menuItemClicked
    }
  }
})
</script>

