<template>
  <div>
    <PageLayout :title="$t('menu.admin')">
    <BaseContainer>
      <div class="flex justify-center w-full">
        <div v-if="user" class="flex flex-col w-5/6 py-6 md:py-10 md:w-2/3 md:h-60">
          <div
            class="pt-2 pb-2 text-sm font-bold tracking-widest text-center text-gray-500 sm:pt-8 sm:pb-4 md:text-ml">
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
        <div v-else class="flex flex-col w-5/6 py-6 md:py-10 md:w-2/3 md:h-60">
          <NuxtLink class="text-center" data-testid="NavBar.menuItem" :to="localePath('/admin/login')">
            {{ $t('menu.login') }}
          </NuxtLink>
        </div>
      </div>
      <div class="py-10 text-sm text-center text-gray-300">{{ (user ? user.username : "") }} PodKaschde {{ version }}
        &copy;
        Alex Röhm, 2022</div>
      <div class="h-screen"></div>

    </BaseContainer>
  </PageLayout>
  </div>
</template>
<script setup lang="ts">
import { VERSION, REVISION, BUILDTIME } from "../../version";
const version = ref("Ver " + VERSION + " " + REVISION + " " + BUILDTIME)
const router = useRouter();
const { logout, useAuthUser } = useAuth();
var user = await useAuthUser()
const localePath = useLocalePath();
setTimeout(() => { if (!user.value) router.push('/admin/login') }, 200)
const logmeout = () => {
  logout();
  router.push(localePath('/'))
}
</script>
