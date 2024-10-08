<template>
  <div>
    <transition
      enter-from-class="translate-x-[150%] opacity-0"
      enter-active-class="transition duration-700"
      leave-active-class="transition duration-400"
      leave-to-class="translate-x-[150%] opacity-0"
    >
      <div
        v-if="showToast"
        class="absolute z-50 flex justify-center w-full place-content-center top-18"
      >
        <div
          id="toast-default"
          class="relative w-3/5 h-16 p-1 text-gray-500 rounded-lg bg-gradient-to-r from-skin-from via-skin-via to-skin-to dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
        <div class="flex items-center w-full h-full bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark rounded-md place-content-between ">
          <div class="ml-3">{{ toasterMessage }}</div>
          <button
            type="button"
            class="ml-1 mr-2 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
            @click="showToast = false"
          >
            <span class="sr-only">Close</span>
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const route = useRoute();
    const i18n = useI18n();

    const toasterMessage = ref('');
    const showToast = ref(false);

    const toast = (msg: string) => {
      toasterMessage.value = msg;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 4000);
    };

    if (props.msg.length>0)
      toast(props.msg)
    watch( () => props.msg, (newVal) => {
      toast(newVal)
    })
    onMounted(() => {
      if (route.query.msg) toast(i18n.t(route.query.msg as string));
    });
    onActivated(() => {
      if (route.query.msg) toast(i18n.t(route.query.msg as string));
    });
    return {
      showToast,
      toasterMessage,
    };
  },
});
</script>
