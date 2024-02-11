<template>
  <div>
      <div class="theme-ccf"></div> <!-- this is to prevent postcss to remove the theme -->
    <div :class="useRuntimeConfig().public.skin">
    <div class="h-screen bg-skin-light dark:bg-skin-dark text-skin-base dark:text-skin-dark">
    <NuxtPage />
  </div>
  </div>
  </div>
</template>
