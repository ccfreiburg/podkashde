<template>
  <div>
    <messge-toast></messge-toast>
    <div class="mt-4 md:mt-6 mb-10 md:mb-14 w-full flex justify-center">
      <BaseH1>
        {{ $t('menu.admin') }}
      </BaseH1>
    </div>
    <BaseContainer>
      <div class="w-full flex justify-center">
        <div v-if="user" class="py-6 md:py-10 w-5/6 md:w-2/3 md:h-60 flex flex-col">
          <div
            class="pt-2 sm:pt-8 pb-2 sm:pb-4  text-sm md:text-ml tracking-widest font-bold text-gray-500 text-center">
            {{ $t('menu.adminsub') }}
          </div>
          <NuxtLink class="text-center" data-testid="NavBar.menuItem" :to="localePath('/admin/setpassword')">
            {{ $t('menu.changepassword') }}
          </NuxtLink>
          <NuxtLink class="text-center" v-if="(user && user.username.startsWith('admin'))" data-testid="NavBar.menuItem"
            :to="localePath('/admin/invitation')">
            {{ $t('menu.invitataion') }}
          </NuxtLink>
          <NuxtLink class="text-center" v-if="(user && user.username.startsWith('admin'))" data-testid="NavBar.menuItem"
            :to="localePath('/admin/import')">
            {{ $t('menu.import') }}
          </NuxtLink>
          <div> </div>
          <button data-testid="NavBar.menuItemEvent" @click="logmeout">
            {{ $t('menu.logout') }}
          </button>
        </div>
        <div v-else class="py-6 md:py-10 w-5/6 md:w-2/3 md:h-60 flex flex-col">
          <NuxtLink class="text-center" data-testid="NavBar.menuItem" :to="localePath('/admin/login')">
            {{ $t('menu.login') }}
          </NuxtLink>
        </div>
      </div>
      <div class="text-center text-sm text-gray-300 py-10">{{ (user ? user.username : "") }} PodKaschde {{ version }}
        &copy;
        Alex Röhm, 2022</div>
      <div class="h-screen"></div>

    </BaseContainer>
  </div>
</template>
<script setup lang="ts">
import { VERSION, REVISION, BUILDTIME } from "../../version";
const version = ref("Ver " + VERSION + " " + REVISION + " " + BUILDTIME)
const router = useRouter();
const { logout, useAuthUser } = useAuth();
var user = useAuthUser()
const localePath = useLocalePath();
setTimeout(() => { if (!user.value) router.push('/admin/login') }, 200)
const logmeout = () => {
  logout();
  router.push(localePath('/'))
}
</script>
