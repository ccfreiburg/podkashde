<template>
  <div v-on:keyup.enter="onlogin" v-on:keyup.esc="oncancel">
    <PageLayout :title="$t('login.title')">
    <BaseContainer>
      <div class="flex flex-row flex-wrap content-start justify-evenly">
        <div class="flex flex-col w-2/3">
          <InputArea class="w-full" name="user" v-model:value="username" :errors="errors" type="text" :label="'login.user'"></InputArea>
          <InputArea name="password" type="password" v-model:value="password" :errors="errors" :label="'login.password'"></InputArea>
          <div class="flex flex-row">
            <div class="flex-grow">
              <BaseButtonPrimary data-testid="submit" class="float-right mt-8" @click="onlogin">{{ $t('login.submit') }}
              </BaseButtonPrimary>
            </div>
          </div>
        </div>
      </div>
      <div class="h-screen"></div>
    </BaseContainer>
  </PageLayout>
  </div>
</template>
<script setup lang="ts">
import type IValidationError from '~~/base/types/IValidationError';
import { useI18n } from 'vue-i18n';
const router = useRouter();

const i18n = useI18n();
const { login } = useAuth();
const errors = ref([] as Array<IValidationError>);

const username = ref("")
const password = ref("")

const onlogin = async () => {

  try {
    if (await login(username.value, password.value)) {
      const url = (i18n.locale.value == 'de' ? '' : '/' + i18n.locale.value) + '/podcasts'
      router.push({
        path: url,
        query: { refresh: 'true', msg: 'login.loggedin' },
      });
    }
  } catch( err ) {
    console.log(err)
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
