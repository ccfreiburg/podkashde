<template>
  <div class="mb-2 px-2 sm:mb-4 md:mb-10 flex flex-row">
    <div class="z-10 relative shrink">
      <div
        class="absolute bottom-[3px] -left-1 -right-2 h-[5px] bg-gradient-to-r from-skin-from via-skin-via to-skin-to bg-no-repeat">
      </div>
      <h1
        class="z-30 relative text-xl md:text-2xl leading-tight tracking-tighter italic uppercase text-skin-base dark:text-skin-dark">
        <slot />
      </h1>
    </div>
    <div class="flex-grow"></div>
  </div>
</template>