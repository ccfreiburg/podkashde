<template>
  <div class="flex flex-row">
    <div class="relative mb-4 px-2 leading-tight tracking-tighter shrink">
      <h1 class="text-xl md:text-2xl font-bold">
        <slot />
      </h1>
      <div
        class="absolute -z-10 bottom-0 left-0 w-full h-2 bg-gradient-to-r from-skin-from via-skin-via to-skin-to bg-no-repeat">
      </div>
    </div>
    <div class="flex-grow"></div>
  </div>
</template>