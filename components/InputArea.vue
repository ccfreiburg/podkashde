<template>
  <div class="mt-2 flex flex-col">
    <div>
    <label class="pl-2 text-sm text-gray-500" :for="name">{{
      $t(label)
    }}</label>
    <span v-if="error!==''" name="error" class="ccf-text-error">
      {{$t(error)}}
    </span>
    </div>
      <input v-if="isInputElement()"
          :class="'ccf-field' + getClass()"
          :type="type"
          :valid="error==''"
          :name="name"
          :disabled="disabled"
          :value="value"
          @input="updateEvent"
        />
      <textarea v-if="type==='textarea'"
          class="ccf-textarea"
          type="text"
          :name="name"
          :value="value"
          @input="updateEvent"
      />
  </div>
</template>

<script lang="ts">
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
      default: []
    },
    disabled: {
      type: Boolean,
      default: false,
    },  
    value: {
      type: String,
      default: "",
      required: true
    }
  },
  name: "InputArea",
  setup(props, ctx) {
    function getClass() {
      if (hasError(props.errors)) 
        return " ccf-error";
      else 
        return "";
    }
    function isInputElement() {
      return ["text","number","date","password"].includes(props.type)
    }
    function hasError(errors) {
      return errors.find((error) => error.field === props.name);
    }
    const error = computed(() => {
      const err = hasError(props.errors)
      return (err?err.text:"")
    })
    function updateEvent(event) {
      ctx.emit('update:value', event.target.value)
    }
    return {
      isInputElement,
      updateEvent,
      getClass,
      error
      
    };
  },
});
</script>