<template>
  <MenuLink :item="item" @menuItemClicked="menuItemClicked">
    <div class="m-1 py-1 px-2 bg-[#f3f2f2] border-[#f3f2f2] text-[#888888] hover:bg-white border-2 rounded-xl">
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

