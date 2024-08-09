<template>
    <PageLayout :title="$t('login.invitationtitle')">
    <BaseContainer v-if="user" v-on:keyup.enter="generateUrl" class="pb-10">
      <div class="flex justify-center">
        <div class="flex flex-col w-2/3">
          <input-area class="w-full" name="username" type="text" :label="'login.user'"
            v-model:value="username"></input-area>
          <input-area class="w-full h-46" name="invitelinktext" type="textarea" :label="'login.invitelinktext'"
            v-model:value="url"></input-area>
          <!-- <div
            class="w-full dark:border-skin-dark dark:border-[1px] dark:bg-skin-dark border-skin-light border-2 bg-skin-light rounded-md mt-5 p-4 h-20 overflow-clip">
            {{ url }}
          </div> -->
          <div class="flex justify-end">
            <BaseButtonPrimary @click="generateUrl">
              {{ $t('login.invitelink') }}
            </BaseButtonPrimary>
          </div>
        </div>
      </div>
    </BaseContainer>
    </PageLayout>
</template>
<script setup lang="ts">
import { INVITE_TOKEN, SETPASS_LINK, USERTOKEN_AP } from '~~/base/Constants';

const {user} = useAuth()
const {on_mounted, on_before, on_user_changed} = useMounted(()=>{}, user, true)
onMounted( on_mounted )
onBeforeMount( on_before )
watch(user, on_user_changed);

const username = ref('');
const url = ref('');

const generateUrl = async () => {
  const myFetch = useFetchApi()
  const token = await myFetch( USERTOKEN_AP.replace("%%", username.value) + INVITE_TOKEN)
  url.value = useRuntimeConfig().public.appBase + SETPASS_LINK + token
}
</script>
