<template>
      <div class="flex flex-col mt-3">
        <label class="pl-2 text-sm text-gray-500" :for="name">{{
          $t(label)
        }}</label>
        <select
          :class="'ccf-field'+getClass()"
          :name="name"
          :value="value"
          @change="updateEvent"
        >
          <option
            class="overflow-auto"
            v-for="aOption in options"
            :key="aOption.enumvalue_id"
            :value="aOption.enumvalue_id"
          >         
            {{(long?aOption.parentCategory + " - " + aOption.displaytext:aOption.displaytext)}}
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
    function getClass() {
      if (hasError(props.errors))
        return " ccf-error";
      else 
        return "";
    }
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