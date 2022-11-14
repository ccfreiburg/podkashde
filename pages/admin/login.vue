<template>
  <div>
    <div class="w-full flex justify-center">
        <div
          class="mt-6 md:mt-10 mb-10 md:mb-14 grow-0 text-md md:text-2xl uppercase italic ccf-underline-xs"
        >&nbsp;{{ $t("login.title") }}&nbsp;
        </div>
  </div>
  <div class="w-full h-screen bg-gray-200 flex justify-center">
      <div class="container px-4 mx-auto flex flex-col">
        <div class="flex flex-row flex-wrap content-start justify-evenly">
          <div class="w-140 flex flex-col">
            <input-area name="user" type="text" :label="'login.user'" v-model:value="user"></input-area>
            <input-area name="password" type="password" :label="'login.password'" v-model:value="password"></input-area>
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
</template>
<script setup lang="ts">
const router = useRouter();
const { login } = useAuth()

const user = ref("ar@3ar.de");
const password = ref("0test0++");

const onlogin = async () => {
  if (await login(user.value, password.value)) {
    const url = router.options.history.state.back;
    router.push(url+"?refresh=true")
  }

}
</script>