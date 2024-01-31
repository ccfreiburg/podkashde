<template>
  <div v-if="user">
    <div class="flex justify-center w-full">
      <div class="mt-6 mb-10 md:mt-10 md:mb-14">
        <BaseH1>{{ $t('login.invitationtitle') }}</BaseH1>
      </div>
    </div>
    <BaseContainer>
      <div class="flex justify-center">
        <div class="flex flex-col w-2/3">
          <input-area class="w-full" name="username" type="text" :label="'login.user'"
            v-model:value="username"></input-area>
          <div
            class="w-full dark:border-skin-dark dark:border-[1px] dark:bg-skin-dark border-skin-light border-2 bg-skin-light rounded-md mt-5 p-4 h-20 overflow-clip">
            {{ url }}
          </div>
          <div class="flex justify-end">
            <BaseButtonPrimary @click="generateUrl">
              {{ $t('login.invitelink') }}
            </BaseButtonPrimary>
          </div>
        </div>
      </div>
      <div class="h-screen"></div>

    </BaseContainer>
  </div>
</template>
<script setup lang="ts">
import { INVITE_TIME, INVITE_TOKEN, SETPASS_LINK, USERTOKEN_AP } from '~~/base/Constants';
const router = useRouter();
var user = await useAuth().useAuthUser()
const myFetch = useFetchApi()
const username = ref('');
const url = ref('');

const generateUrl = async () => {
  const token = await myFetch( USERTOKEN_AP.replace("%%", username.value) + INVITE_TOKEN)
  url.value = useRuntimeConfig().public.appBase + SETPASS_LINK + token
}
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {
    }
  }))
setTimeout(() => { if (!user.value) router.push('/admin/login') }, 200)
</script>
