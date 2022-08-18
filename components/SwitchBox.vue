<template>
      <div class="flex flex-row mt-3">

            <div
          class="
            relative
            w-12
            h-6
            transition
            duration-200
            ease-linear
            rounded-2xl
          "
          :class="[isChecked ? 'bg-orange-300' : 'bg-gray-200']"
        >
          <label
            for="toggle"
            class="
              absolute
              left-0
              w-6
              h-6
              mb-2
              transition
              duration-100
              ease-linear
              transform
              bg-white
              border-2
              rounded-2xl
              cursor-pointer
            "
            :class="[
              isChecked
                ? 'translate-x-full border-orange-300'
                : 'translate-x-0 border-gray-300',
            ]"
          ></label>
          <input
            type="checkbox"
            id="toggle"
            name="toggle"
            class="w-full h-full appearance-none focus:outline-none"
            @click="isChecked = !isChecked"
          />
        </div>
          <span class="ml-3 text-gray-500 text-sm font-medium">{{
          label
        }}</span>
      </div>
</template>

<script lang="ts">
  export default defineComponent({
  props: {
    checked: Boolean,
    labelChecked: String,
    labelUnChecked: String,
  },
  name: "SwitchBox",
  async setup(props, ctx) {
    var isChecked = ref(props.checked)
    watch(isChecked, ()=>{
        ctx.emit("checkedChanged",isChecked.value)
    })
    var label = computed(()=>{
        if(isChecked.value)
            return props.labelChecked
        else if (props.labelUnChecked)
            return props.labelUnChecked
        else    
            return props.labelChecked
    })
    return {
        isChecked,
        label
    }
  }
  })
</script>