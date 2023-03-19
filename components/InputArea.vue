<template>
  <div class="mt-2 flex flex-col">
    <div>
      <label v-if="label" class="pl-2 text-sm text-skin-muted" :for="name">{{
        $t(label)
      }}</label>
      <div v-else class="mt-4"></div>
      <span v-if="error !== ''" name="error" class="pl-2 text-sm text-skin-error">
        {{ $t(error) }}
      </span>
    </div>
    <input v-if="isInputElement()"
      :class="getClass + 'h-10 border-[2px] border-skin-light dark:border-skin-dark dark:border-[1px] px-3 py-1 mt-1 rounded-md bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark focus:outline-none focus:ring-[1px] focus:ring-skin-fokus'"
      :type="type" :valid="error == ''" :id="name" :name="name" :disabled="$props.disabled" :readonly="$props.readonly"
      :value="value" @input="updateEvent" />
    <textarea v-if="type === 'textarea'"
      class="h-24 border-[2px] border-skin-light dark:border-skin-dark dark:border-[1px] px-3 py-1 mt-1 rounded-md bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark focus:outline-none focus:ring-[1px] focus:ring-skin-fokus"
      type="text" :id="name" :name="name" :value="value" @input="updateEvent" />
  </div>
</template>

<script lang="ts">
import { type } from "os";
import { defineComponent, PropType, computed } from "vue";
import IValidationError from "~~/base/types/IValidationError";

export default defineComponent({
  props: {
    name: String,
    type: {
      type: String,
      default: "text",
    },
    label: String,
    errors: {
      type: Object as PropType<Array<IValidationError>>,
      default: [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
      required: true,
    },
  },
  name: "InputArea",
  setup(props, ctx) {
    const getClass = computed(() => {
      if (hasError(props.errors)) return "ring-skin-error ring-1 ";
      else return "";
    })
    function isInputElement() {
      return ["text", "number", "date", "password"].includes(props.type);
    }
    function hasError(errors) {
      return errors.find((error) => error.field === props.name);
    }
    const error = computed(() => {
      const err = hasError(props.errors);
      return err ? err.text : "";
    });
    function updateEvent(event) {
      ctx.emit("update:value", event.target.value);
    }

    return {
      isInputElement,
      updateEvent,
      getClass,
      error,
    };
  },
});
</script>
