<template>
  <div class="w-full h-full" v-on:keyup.enter="save" v-on:keyup.esc="cancel">
    <div class="flex justify-center w-full mt-6 mb-6 md:mt-12 md:mb-8">
      <BaseH1>
        {{
          isEdit
          ? $t(type + ".edit")
          : $t(type + ".new")
        }}
      </BaseH1>
    </div>
    <div>
      <slot />
      <!-- Buttons -->
      <div class="flex flex-row justify-end">
        <BaseButtonSecondary class="mr-4" @click="cancel">
          {{ $t("cancel") }}
        </BaseButtonSecondary>
        <BaseButtonPrimary @click="save">
          {{ $t(type + ".save") }}
        </BaseButtonPrimary>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

export default defineComponent({
  props: {
    type: String,
    fields: Object
  },
  name: "DetailForm",
  async setup(props, { emit }) {
    const isEdit = computed(() => (props.fields as any).id != undefined && props.fields['id'] > 0);

    async function save(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      emit("frmsave");
    }
    function cancel() {
      emit("frmcancel");
    }
    return {
      isEdit,
      type: props.type,
      save,
      cancel,
    };
  }
})
</script>   
