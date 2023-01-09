<template>
  <div v-on:keyup.enter="onlogin" v-on:keyup.esc="oncancel">
    <messge-toast></messge-toast>
    <div class="w-full flex justify-center">
      <div
        class="mt-6 md:mt-10 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
      >
        &nbsp;{{ $t('login.title') }}&nbsp;
      </div>
    </div>
    <div class="w-full h-screen bg-gray-200 flex justify-center">
      <div class="container px-4 mx-auto flex flex-col">
        <div class="flex flex-row flex-wrap content-start justify-evenly">
          <div class="w-2/3 flex flex-col">
            <input-area
              class="w-full"
              name="user"
              :errors="errors"
              type="text"
              :label="'login.user'"
              v-model:value="user"
            ></input-area>
            <input-area
              name="password"
              type="password"
              :errors="errors"
              :label="'login.password'"
              v-model:value="password"
            ></input-area>
            <div class="flex flex-row">
              <div class="flex-grow">
                <button
                  class="float-right h-12 w-40 mt-8 px-2 rounded-md ccfbutton-border"
                  @click="onlogin"
                >
                  {{ $t('login.submit') }}
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
import IValidationError from '~~/base/types/IValidationError';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const i18n = useI18n();
const { login } = useAuth();
const errors = ref([] as Array<IValidationError>);
const user = ref('');
const password = ref('');

const onlogin = async () => {
  try {
    if (await login(user.value, password.value)) {
      // var url = router.options.history.state.back as string;
      // if (url.includes('?')) url = url.substring(0, url.indexOf('?'));
      const url = (i18n.locale.value=='de'?'':'/'+i18n.locale.value)+'/podcasts'
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
