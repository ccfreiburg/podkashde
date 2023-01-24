<template>
  <button>
    <div
      class="relative float-right h-10 w-40 mt-8 px-2 rounded-[4px] bg-gradient-to-r from-skin-from via-skin-via to-skin-to bg-no-repeat">
      <div class="absolute left-[2px] top-[3px] right-[3px] bottom-[3px] rounded-[2px] 
      bg-skin-muted hover:bg-skin-light dark:bg-skin-muted-dark dark:hover:bg-skin-button-accent-hover 
      flex place-items-center justify-center">
        <div
          class="text-sm md:text-md tracking-wide uppercase bg-clip-text text-transparent bg-gradient-to-r from-skin-from via-skin-via to-skin-to bg-no-repeat font-bold">
          <slot />
        </div>
      </div>
    </div>
  </button>
</template>