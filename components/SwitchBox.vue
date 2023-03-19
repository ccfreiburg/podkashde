<template>
  <div class="flex flex-row mt-3">
    <div
      class="relative w-12 h-6 transition duration-200 ease-linear rounded-2xl border-[2px] border-skin-light dark:border-skin-dark dark:border-[1px]"
      :class="[isChecked ? 'bg-skin-button-accent' : 'bg-skin-light dark:bg-skin-dark']">
      <label for="toggle" class="
          absolute
          -top-[1px]
          left-0
          w-6
          h-6
          mb-2
          transition
          duration-100
          ease-linear
          transform
          dark:bg-skin-dark
          bg-skin-light
          border-2
          rounded-2xl
          cursor-pointer
        " @click.prevent="toggle" :class="[
          isChecked
            ? 'translate-x-full border-skin-fokus'
            : 'translate-x-0 dark:border-skin-dark border-skin-light',
        ]"></label>
      <input type="checkbox" id="toggle" data-testid="SwitchBox.toggle" name="toggle" :disabled="disabled"
        class="w-full h-full appearance-none focus:outline-none" @click="toggle" />
    </div>
    <span data-testid="SwitchBox.label" class="ml-3 text-skin-muted dark:text-skin-muted-dark text-sm font-medium">{{
      label
    }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";

export default defineComponent({
  props: {
    checked: Boolean,
    disabled: Boolean,
    labelChecked: String,
    labelUnChecked: String,
  },
  name: "SwitchBox",
  setup(props, ctx) {
    const isChecked = ref(props.checked);
    const toggle = () => {
      if (!props.disabled) isChecked.value = !isChecked.value
    }
    watch(isChecked, () => {
      ctx.emit("checkedChanged", isChecked.value);
    });
    const label = computed(() => {
      return (isChecked.value || !props.labelUnChecked ? props.labelChecked : props.labelUnChecked)
    });
    return {
      isChecked,
      disabled: props.disabled,
      label,
      toggle,
    };
  },
});
</script>