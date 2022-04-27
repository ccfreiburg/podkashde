<template>
  <div class="m-5 flex flex-row justify-center">
    <h1 class="text-2xl">Add Podcast</h1>
    <button @click="submit">Submit</button>
  </div>
</template>

<script>
export default {
  methods: {
    submit() {
      $fetch("/api/podcast", { method: "post", body: { test: 123 } });
    },
  },
};
</script>
