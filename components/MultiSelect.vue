<template id="MultiSelect">
  <div>
    <div class="
        p-2
        h-10
        rounded-md
        flex flex-nowrap
        place-content-between
      " data-testid="MultiSelect.clickableElement" v-if="!showAllways" @click="showDropdown">
      <div class="whitespace-nowrap mr-2">{{ title }}</div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <div v-else class="flex flex-row flex-nowrap items-end place-content-between">
      <div class="text-lg">{{ title }}</div>
      <div class="text-sm flex flex-row flex-nowrap">
        <button data-testid="MultiSelect.selectAll" class="text-sm mr-1 hover:cursor-pointer text-skin-accent"
          @click="all">
          all
        </button>
        |
        <button data-testid="MultiSelect.deselectAll" class="text-sm mx-1 hover:cursor-pointer text-skin-accent"
          @click="none">
          none
        </button>
        |
        <button data-testid="MultiSelect.invertSelection" class="text-sm ml-1 hover:cursor-pointer text-skin-accent"
          @click="invert">
          invert
        </button>
      </div>
    </div>
    <div id="dropdownlist" class="
        pin
        z-50
        overflow-auto
        flex
        border-2 rounded-md dark:border-skin-dark border-skin-light dark:bg-skin-dark bg-skin-light"
      :class="showAllways ? 'h-80' : 'fixed h-1/3'" v-if="show || showAllways">
      <div class="p-2">
        <ul>
          <li class="whitespace-nowrap" v-for="(option, index) in options" :key="index">
            <input class="m-2" type="checkbox" data-testid="Multiselect.Option" :id="index" :value="option.value"
              v-model="selected" />
            <label :for="index">{{ option.text }}</label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MultiSelect",
  props: ["options", "title", "checkedList", "showAllways"],
  data() {
    return {
      show: false,
      selected: [],
    };
  },
  methods: {
    all() {
      this.selected = this.options.map((element) => element.value);
    },
    invert() {
      var old = this.selected;
      this.selected = [];
      this.options.forEach((element) => {
        if (!old.includes(element.value)) this.selected.push(element.value);
      });
    },
    none() {
      this.selected = [];
    },
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
  },
  watch: {
    selected(val) {
      this.$emit("checked", this.selected);
    },
    checkedList(val) {
      this.selected = this.checkedList;
    },
    showAllways(val) {
      this.show = val;
    },
  },
  mounted() {
    if (this.checkedList)
      this.selected = this.checkedList.map((el) => el)
    window.addEventListener("scroll", this.hideDropdown);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.hideDropdown);
  },
});
</script>
