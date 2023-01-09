<template>
  <div v-if="user">
    <div class="w-full flex justify-center">
      <div
        class="mt-6 md:mt-10 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;{{ $t('login.invitationtitle') }}&nbsp;
      </div>
    </div>
    <div class="w-full h-screen bg-gray-200 flex justify-center">
      <div class="container px-4 mx-auto flex flex-col">
        <div class="flex flex-row flex-wrap content-start justify-evenly">
          <div class="w-2/3 flex flex-col">
            <input-area class="w-full" name="username" type="text" :label="'login.user'" v-model:value="username"></input-area>
            <div class="w-full bg-white rounded-md mt-5 p-4 h-20 overflow-clip">{{url}}</div>
            <div class="flex flex-row">
              <div class="flex-grow">
                <button
                  class="float-right h-12 w-40 mt-8 px-2 rounded-md ccfbutton-border"
                  @click="generateUrl"
                >
                  {{ $t('login.invitelink') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { INVITE_TIME, INVITE_TOKEN, SETPASS_LINK, USERTOKEN_AP } from '~~/base/Constants';
const router = useRouter();
const settings= await useSettings();

const baseUrl = settings.value.baseUrl
const username = ref('');
const url = ref('');

const generateUrl = async () => {
  const token =  await $fetch(USERTOKEN_AP.replace("%%",username.value)+INVITE_TOKEN)
  url.value = baseUrl + SETPASS_LINK + token
}
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
var user =  useAuth().useAuthUser()
setTimeout(()=>{ if (!user.value) router.push('/admin/login')}, 200)
</script>
