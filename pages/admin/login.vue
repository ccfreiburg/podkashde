<template>
  <div
    v-on:keyup.enter="onlogin"
    v-on:keyup.esc="oncancel"
  > <div class="w-full flex justify-center">
        <div
          class="mt-6 md:mt-10 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
        >&nbsp;{{ $t("login.title") }}&nbsp;
        </div>
  </div>
  <div class="w-full h-screen bg-gray-200 flex justify-center">
      <div class="container px-4 mx-auto flex flex-col">
        <div class="flex flex-row flex-wrap content-start justify-evenly">
          <div class="w-2/3 flex flex-col">
            <input-area class="w-full" name="user" type="text" :label="'login.user'" v-model:value="user"></input-area>
            <input-area name="password" type="password" :label="'login.password'" v-model:value="password"></input-area>
            <div class="flex flex-row">
            <div class="flex-grow">
            <button
              class="float-right h-12 w-40 mt-8 px-2 rounded-md ccfbutton-border"
              @click="onlogin"
            >
              {{ $t("login.submit") }}
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
const router = useRouter();
const { login } = useAuth()

const user = ref("admin");
const password = ref("0test0++");

const onlogin = async () => {
  if (await login(user.value, password.value)) {
    var url = router.options.history.state.back as string;
    if (url.includes("?"))
      url = url.substring(0,url.indexOf('?'))
    router.push({ path: url, query: { refresh: 'true', msg: 'login.loggedin' } })
  }
}
const oncancel = async () => {
  router.go(-1)
}
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
</script>