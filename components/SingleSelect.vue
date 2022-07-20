<template id="SingleSelect">
  <div>
    <div
      class="
        p-2
        h-10
        rounded-md
        bg-slate-200
        flex flex-nowrap
        place-content-between
      "
      v-if="!showAllways"
      @click="showDropdown"
    >
      <div class="whitespace-nowrap mr-2">{{ selectedTitle }}</div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
    <div
      v-else
      class="flex flex-row flex-nowrap items-end place-content-between"
    >
      <div class="text-lg">{{ title }}</div>
    </div>
    <div
      id="dropdownlist"
      class="
        pin
        z-50
        overflow-auto
        flex
        bg-opacity-90 bg-gray-50
        border-2 border-gray-300
      "
      :class="showAllways ? 'h-80' : 'fixed h-1/3'"
      v-if="show || showAllways"
    >
      <div>
        <ul>
          <li
            class="whitespace-nowrap"
            v-for="(option, index) in options"
            :key="index"
          >
            <div
              class="text-sm"
              :class="selectbg(option.value)"
              @click="select(option.value)"
            >
              {{ option.text }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SingleSelect",
  props: ["options", "title", "selectedItem", "showAllways"],
  data() {
    return {
      show: false,
      selected: -1,
    };
  },
  methods: {
    showDropdown() {
      this.show = !this.show;
      if (this.show)
        document.addEventListener("click", this.closeIfClickedOutside);
    },
    hideDropdown() {
      this.show = false;
    },
    closeIfClickedOutside(event) {
      if (!this.$el.contains(event.target) && this.show) {
        document.removeEventListener("click", this.closeIfClickedOutside);
        this.show = false;
      }
    },
    select(val) {
      this.selected = val;
      this.hideDropdown();
      this.$emit("selected", this.selected);
    },
    selectbg(val) {
      if (val == this.selected) return "bg-orange-400";
      else return "bg-gray-50";
    },
  },
  computed: {
    selectedTitle() {
      if (this.selected > -1) {
        var selecedOption = this.options.find(
          (option) => option.value == this.selected
        );
        if (selecedOption) return selecedOption.text;
      }
      return this.title;
    },
  },
  watch: {
    checkedList(val) {
      this.selected = this.checkedList;
    },
    showAllways(val) {
      this.show = val;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.hideDropdown);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.hideDropdown);
  },
});
</script>
