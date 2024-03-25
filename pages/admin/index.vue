<template>
  <div>
    <PageLayout :title="$t('menu.admin')">

    <BaseContainer>
      
      <div class="flex justify-center w-full">
        <div v-if="!user" class="flex flex-col w-5/6 py-6 md:py-10 md:w-2/3 md:h-60">
          <NuxtLink class="text-center" data-testid="NavBar.menuItem" :to="localePath('/admin/login')">
            {{ $t('menu.login') }}
          </NuxtLink>
        </div>
        <div v-if="user" class="flex flex-col w-5/6 py-6 md:py-10 md:w-2/3 md:h-60">
          <div
            class="pt-2 pb-2 text-sm font-bold tracking-widest text-center text-gray-500 sm:pt-8 sm:pb-4 md:text-ml">
            {{ $t('menu.adminsub') }}
          </div>
          <NuxtLink class="text-center" data-testid="NavBar.menuItem" :to="localePath('/admin/setpassword')">
            {{ $t('menu.changepassword') }}
          </NuxtLink>
          <NuxtLink class="text-center" v-if="(user && user.username.startsWith('Admin'))" data-testid="NavBar.menuItem"
            :to="localePath('/admin/invitation')">
            {{ $t('menu.invitataion') }}
          </NuxtLink>
          <NuxtLink class="text-center" v-if="(false && user && user.username.startsWith('Admin'))" data-testid="NavBar.menuItem"
            :to="localePath('/admin/import')">
            {{ $t('menu.import') }}
          </NuxtLink>
          <div> </div>
          <button data-testid="NavBar.menuItemEvent" @click="logout">
            {{ $t('menu.logout') }}
          </button>
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
const {user, logout} = useAuth()
const {on_mounted, on_before, on_user_changed} = useMounted(()=>{}, user, true)
onMounted( on_mounted )
onBeforeMount( on_before )
watch(user, on_user_changed);

const localePath = useLocalePath()
</script>
