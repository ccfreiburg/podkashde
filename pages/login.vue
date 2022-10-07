<template>
  <div>
    <section class="py-10 bg-white overflow-hidden">
      <div class="container px-4 mx-auto flex flex-col">
        <div class="flex flex-row md:max-w-4xl mb-10 md:mb-10">
          <div
            class="mb-4 px-2 leading-tight tracking-tighter shrink ccfunderline"
          >
            <h1 class="text-3xl md:text-4xl font-bold">
              {{ $t("login.title") }}
            </h1>
          </div>
          <div class="flex-grow"></div>
        </div>
        <div class="flex flex-row flex-wrap content-start justify-evenly">
          <div class="w-140 flex flex-col">
            <div class="flex flex-col mt-3">
              <label class="pl-2 text-sm text-gray-800" for="user">{{
                $t("login.user")
              }}</label>
              <input type="text" name="user" class="field" v-model="user" />
            </div>
            <div class="flex flex-col mt-3">
              <label class="pl-2 text-sm text-gray-800" for="password">{{
                $t("login.password")
              }}</label>
              <input
                type="password"
                class="field"
                name="password"
                v-model="password"
              />
            </div>
            <button
              class="float-right h-12 w-40 mt-8 px-2 rounded-md ccfbutton-border"
              @click="login"
            >
              {{ $t("login.submit") }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
const user = ref("ar@3ar.de");
const password = ref("0test0++");
const login = () => {
  loginWithEmail(user.value, password.value) 
}
</script>