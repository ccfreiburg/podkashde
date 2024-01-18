<template>
  <div class="flex flex-col mt-3">
    <label class="pl-2 text-sm  text-skin-muted" :for="name">{{
      $t(label)
    }}</label>
    <select
      :class="getClass + 'w-full h-10 border-[2px] border-skin-light dark:border-skin-dark dark:border-[1px] px-3 py-1 mt-1 rounded-md bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark focus:outline-none focus:ring-[1px] focus:ring-skin-fokus'"
      :name="name" :value="value" @change="updateEvent">
      <option class="max-w-full overflow-y-scroll overflow-x-hidden " v-for="aOption in options"
        :key="aOption.enumvalue_id" :value="aOption.enumvalue_id">
        {{(long ? aOption.parentCategory + " - " + aOption.displaytext : aOption.displaytext) }}
      </option>
    </select>
  </div>

</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import IEnumerator from "~~/base/types/IEnumerator";
import IValidationError from "~~/base/types/IValidationError";

export default defineComponent({
  props: {
    name: String,
    label: String,
    errors: {
      type: Object as PropType<Array<IValidationError>>,
      default: [],
    },
    options: Object as PropType<Array<Partial<IEnumerator>>>,
    long: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      default: 0,
      required: true
    }
  },
  name: "SingleSelect",
  setup(props, ctx) {
    function hasError(errors) {
      return errors.find((error) => error.field === props.name);
    }
    const getClass = computed(() => {
      if (hasError(props.errors)) return "ring-skin-error ring-1 ";
      else return "";
    })
    function updateEvent(event) {
      ctx.emit('update:value', Number.parseInt(event.target.value))
    }
    return {
      getClass,
      updateEvent,
    }
  }
})
</script>