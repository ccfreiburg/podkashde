import { booleanLiteral } from "@babel/types";
<template>
  <div
    class="p-10 w-full h-full"
    v-on:keyup.enter="save"
    v-on:keyup.esc="cancel"
  >
    <div class="mb-5">
      <h1 class="text-2xl text-center">
        {{
          isEdit
            ? $t(type+".edit")
            : $t(type+".new")
        }}
      </h1>
    </div>
    <slot />
      <!-- Buttons -->
      <div class="flex flex-row justify-end">
        <button
          class="
            ccf-button
            ccf-secondary
          "
          @click="cancel"
        >
          {{ $t("cancel") }}
        </button>
        <button
          v-if="isEdit"
          class="ccf-button ccf-alert"
          @click="remove"
        >
          {{ $t("delete") }}
        </button>
        <button
          class="
            ccf-button
            ccfbutton-border
           "
          @click="save"
        >
          {{ $t(type+".save") }}
        </button>
      </div>
    </div>
</template>
<script lang="ts">
import IValidationError from "~~/base/types/IValidationError";

export default defineComponent({
  props: {
    type: String,
    fields: Object
  },
  name: "DetailForm",
  async setup(props, { emit }) {
    const isEdit = computed(() => (props.fields as any).id != undefined &&  props.fields['id'] > 0);

    async function save(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      emit("save");
    }
    function remove() {
      emit("remove");
    }
    function cancel() {
      emit("cancel");
    }
    return {
      isEdit,
      type: props.type,
      save,
      remove,
      cancel,
    };
  }
})
</script>   
