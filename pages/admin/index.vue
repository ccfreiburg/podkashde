<template>
  <div>
    <messge-toast></messge-toast>
    <div class="w-full flex justify-center">
      <div
        class="mt-4 md:mt-6 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;{{ $t('menu.admin') }}&nbsp;
      </div>
    </div>
    <div class="w-full bg-gray-200 flex justify-center">
      <div class="py-6 md:py-10 w-5/6 md:w-2/3 md:h-60 flex flex-col">
        <div
            class="pt-2 sm:pt-8 pb-2 sm:pb-4  text-sm md:text-ml tracking-widest font-bold text-gray-500 text-center"
          >
          {{ $t('menu.adminsub') }}
        </div>
        <button v-if="user" data-testid="NavBar.menuItemEvent" @click="logmeout">
          {{ $t('menu.logout') }}
        </button>
        <NuxtLink
          v-else class="text-center" 
          data-testid="NavBar.menuItem"
          :to="localePath('/admin/login')"
        >
          {{ $t('menu.login') }}
        </NuxtLink>
        <NuxtLink class="text-center" v-if="user" 
          data-testid="NavBar.menuItem"
          :to="localePath('/admin/setpassword')"
        >
          {{ $t('menu.changepassword') }}
        </NuxtLink>
        <NuxtLink class="text-center" v-if="(user && user.username.startsWith('admin'))" 
          data-testid="NavBar.menuItem"
          :to="localePath('/admin/invitation')"
        >
          {{ $t('menu.invitataion') }}
        </NuxtLink>
        <NuxtLink class="text-center" v-if="(user && user.username.startsWith('admin'))" 
          data-testid="NavBar.menuItem"
          :to="localePath('/admin/import')"
        >
          {{ $t('menu.import') }}
        </NuxtLink>
      </div>
    </div>
    <div class="text-center text-sm text-gray-300 py-10">PodKaschde {{ version }} &copy; Alex Röhm, 2022</div>
  </div>
</template>
<script setup lang="ts">
import { VERSION, REVISION ,BUILDTIME } from "../../version";
definePageMeta({
  middleware: "authentication",
});
const version = ref("Ver " + VERSION + " " +REVISION+ " " + BUILDTIME)
const router = useRouter();
const { logout, useAuthUser } = useAuth();
const user = useAuthUser();
onMounted( () => {
  router.replace({
      ...router.currentRoute,
      query: {
     }
    })
})
const localePath = useLocalePath();
const logmeout = () => {
  logout();
  router.push(localePath('/'))
}
</script>
