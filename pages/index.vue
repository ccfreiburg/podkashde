<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <div v-show="user!=null">
      <NuxtLink :to="'/admin/new-podcast'">
        <div
          class="
            mt-5
            h-10
            border-2
            rounded-md
            bg-orange-300
            hover:bg-orange-400
          "
        >
        New
          <!-- {{ $t("newPodcast") }} -->
        </div>
      </NuxtLink>
      </div>
      <div class="flex felx-col flex-wrap text-sm">
        <div v-for="podcast in podcasts" :key="podcast.id">
          <NuxtLink :to="'/podcast/'+podcast.slug">
            <div class="flex flex-row m-2">
              <img class="w-32 h-32 rounded-l-md" :src="podcast.cover_file" />
              <div
                class="
                  flex flex-col
                  h-32
                  w-96
                  border-2
                  rounded-r-md
                  flex-shrink-0
                "
              >
                <div class="p-3 text-2xl">{{ podcast.title }}</div>
                <div class="pl-3">{{ podcast.author }}</div>
              </div>
            </div>
            </NuxtLink>
        </div>
      </div>
    </div>
    <button class="ml-2 p-3 bg-orange-300 rounded-md" @click="refresh">Hallo</button>
    <button class="ml-2 p-3 bg-orange-300 rounded-md" @click="login">Login</button>
    <button class="ml-2 p-3 bg-orange-300 rounded-md" @click="logout">Logut</button>
  </div>
</template>

<script setup lang="ts">
import { usePodcasts } from '~~/composables/podcastdata';
import { loginWithEmail } from '../composables/authentication';
const { refresh, podcasts } = await usePodcasts()
const login = async () => {
  await loginWithEmail("ar@3ar.de", "0test0++") 
}
const logout = async () => {
  userLogout();
}
const user = useState('user')
</script>
