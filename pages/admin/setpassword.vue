<template>
  <div v-if="currentuser" v-on:keyup.enter="submit">
    <messge-toast :msg="localMessage"></messge-toast>
    <div class="w-full flex justify-center">
        <div
          class="mt-6 md:mt-10 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
        >&nbsp;{{ $t("login.newpassword") }}&nbsp;
        </div>
  </div>
  <div class="w-full h-screen bg-gray-200 flex justify-center">
      <div class="container px-4 mx-auto flex flex-col">
        <div class="flex flex-row flex-wrap content-start justify-evenly">
          <div v-if="(!isDone)" class="w-2/3 flex flex-col">
            <input-area v-if="(!isInvite)" name="passwordOld" type="password" :errors="errors" :label="'login.oldpassword'" v-model:value="passwordOld"></input-area>
            <input-area name="password1" type="password" :errors="errors" :label="'login.password'" v-model:value="password1"></input-area>
            <input-area name="password2" type="password" :errors="errors" :label="'login.passwordrepeat'" v-model:value="password2"></input-area>
            <div class="flex flex-row">
            <div class="flex-grow">
            <button
              class="float-right h-12 w-40 mt-8 px-2 rounded-md ccfbutton-border"
              @click="submit"
            >
              {{ $t("login.submitnewpassword") }}
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
import { useI18n } from "vue-i18n";
import { INVITE_TOKEN } from "~~/base/Constants";
import { CHECK_TOKEN_AP } from "~~/base/Constants";
import IValidationError from "~~/base/types/IValidationError";
const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const isInvite = ref(route.query.hasOwnProperty('token'))
const isDone = ref(false)
const currentuser = useAuth().useAuthUser()
const token = route.query.token
const localMessage = ref("")
if (isInvite.value) {
  const {access, user} = await $fetch(CHECK_TOKEN_AP+token)
  if (access!==INVITE_TOKEN)
    router.go(-1)
  if (!user)
    router.go(-1)
  else
    currentuser.value = user
}
const passwordOld = ref("");
const password1 = ref("");
const password2 = ref("");
const errors = ref([] as Array<IValidationError>);

const validate = () => {
  errors.value.length=0
  if (password1.value!==password2.value) 
    errors.value.push({ field: "password2", text: i18n.t("login.validation.nomatch") })
  if (password1.value.length<8) 
    errors.value.push({ field: "password1", text: i18n.t("login.validation.length") })
  return errors.value.length==0 
}
const submit = async () => {
  if (validate()) {
    if (isInvite.value) {
      await useAuth().setFirstPassword(token as string, password1.value)
      localMessage.value = i18n.t('login.passwordset')
      router.push({
              path: "/admin",
              query: { msg: 'login.passwordset' }
            })
      isDone.value = true
    } else {
      try {
        const success = await useAuth().changePassword(currentuser.value.username, password1.value, passwordOld.value)
        if (success) {
          isDone.value = true
          var url = "/admin"
          router.push({
              path: url,
              query: { msg: 'login.passwordset' }
            })
        }
      } catch {
        errors.value.push({ field: "passwordOld", text: i18n.t("login.wrongpassword") })
      }
    }
  }
}
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))

setTimeout(()=>{ if (!currentuser.value) router.push('/admin/login')}, 200)
</script>