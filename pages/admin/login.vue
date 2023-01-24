<template>
  <div v-on:keyup.enter="onlogin" v-on:keyup.esc="oncancel">
    <messge-toast></messge-toast>
    <div class="w-full mt-20 flex justify-center">
      <BaseH1>{{ $t('login.title') }}</BaseH1>
    </div>
    <BaseContainer>
      <div class="flex flex-row flex-wrap content-start justify-evenly">
        <div class="w-2/3 flex flex-col">
          <input-area class="w-full" name="user" ref="userfield" :errors="errors" type="text" :label="'login.user'"
            value=""></input-area>
          <input-area name="password" ref="passfield" type="password" :errors="errors" :label="'login.password'"
            value=""></input-area>
          <div class="flex flex-row">
            <div class="flex-grow">
              <BaseButtonPrimary class="mt-8 float-right" @click="onlogin">{{ $t('login.submit') }}
              </BaseButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>
<script setup lang="ts">
import IValidationError from '~~/base/types/IValidationError';
import { useI18n } from 'vue-i18n';
const router = useRouter();

const userobj = useAuth().useAuthUser()

const i18n = useI18n();
const { login } = useAuth();
const errors = ref([] as Array<IValidationError>);

const userfield = ref(null)
const passfield = ref(null)

const onlogin = async () => {

  try {
    const username = userfield.value.$el.childNodes[1].value
    const password = passfield.value.$el.childNodes[1].value
    if (await login(username, password)) {
      // var url = router.opasswordptions.history.state.back as string;
      // if (url.includes('?')) url = url.substring(0, url.indexOf('?'));
      const url = (i18n.locale.value == 'de' ? '' : '/' + i18n.locale.value) + '/podcasts'
      router.push({
        path: url,
        query: { refresh: 'true', msg: 'login.loggedin' },
      });
    }
  } catch {
    errors.value.push({ field: 'user', text: i18n.t('login.loginfailed') });
    errors.value.push({ field: 'password', text: " " });
  }
};
const oncancel = async () => {
  router.go(-1);
};
onMounted(() =>
  router.replace({
    ...router.currentRoute,
    query: {},
  })
);
</script>
