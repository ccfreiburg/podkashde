<template>
  <div v-if="currentuser" v-on:keyup.enter="submit">
    <PageLayout :title='$t("login.newpassword")'>
      <BaseContainer class="py-10">
      <div v-if="(!isDone)" class="flex flex-row flex-wrap content-start justify-evenly">
        <div class="flex flex-col w-2/3">
        <input-area v-if="(!isInvite)" name="passwordOld" type="password" :errors="errors" :label="'login.oldpassword'"
          v-model:value="passwordOld"></input-area>
        <input-area name="password1" type="password" :errors="errors" :label="'login.password'"
          v-model:value="password1"></input-area>
        <input-area name="password2" type="password" :errors="errors" :label="'login.passwordrepeat'"
          v-model:value="password2"></input-area>
        <div class="flex flex-row justify-end">
          <BaseButtonPrimary @click="submit">
            {{ $t("login.submitnewpassword") }}
          </BaseButtonPrimary>
        </div>
        </div>
      </div>
      <div class="h-screen"></div>
    </BaseContainer>
  </PageLayout>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { INVITE_TOKEN } from "~~/base/Constants";
import { CHECK_TOKEN_AP } from "~~/base/Constants";
import type IValidationError from "~~/base/types/IValidationError";
const myFetch = useFetchApi()


const route = useRoute()
const router = useRouter()
const token = route.query.token
const isInvite = ref(route.query.hasOwnProperty('token'))
const currentuser = ref(undefined)

if (isInvite.value) {
  const { access, user } = await myFetch( CHECK_TOKEN_AP + token) as any
  if (access !== INVITE_TOKEN)
    router.go(-1)
  if (!user)
    router.go(-1)
  else
    currentuser.value = user
} else {
  const { user: tmp } = useAuth()
  currentuser.value = tmp.value
}

const i18n = useI18n()
const {on_mounted, on_before, on_user_changed} = useMounted(()=>{}, currentuser, !isInvite)
onMounted( on_mounted )
onBeforeMount( on_before )
watch(currentuser, on_user_changed);

    
const isDone = ref(false)
const localMessage = ref("")

const passwordOld = ref("");
const password1 = ref("");
const password2 = ref("");
const errors = ref([] as Array<IValidationError>);

const validate = () => {
  errors.value.length = 0
  if (password1.value !== password2.value)
    errors.value.push({ field: "password2", text: i18n.t("login.validation.nomatch") })
  if (password1.value.length < 8)
    errors.value.push({ field: "password1", text: i18n.t("login.validation.length") })
  return errors.value.length == 0
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

</script>