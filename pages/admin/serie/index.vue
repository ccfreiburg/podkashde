<template>
  <div class="w-full h-full">
<messge-toast></messge-toast>

    <div class="flex flex-col">
     <div class="flex felx-col flex-wrap text-sm">
        <div v-for="serie in series" :key="serie.id">
          <NuxtLink :to="'/serie/'+serie.slug">
            <div class="flex flex-row m-2">
              <img class="w-32 h-32 rounded-l-md" :src="serie.cover_file" />
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
                <div class="p-3 text-2xl">{{ serie.title }}</div>
              </div>
            </div>
            </NuxtLink>
        </div>
      </div>
    </div>
    <button class="ml-2 p-3 bg-orange-300 rounded-md" @click="refresh">Hallo</button>
  </div>
</template>

<script setup lang="ts">
import { useSeries } from '~~/composables/seriedata';
definePageMeta({
  middleware: "authentication",
});
const { refresh, series } = await useSeries()
const route = useRoute();
onBeforeMount( () => {
  if (route.query.refresh) refresh();
})
const router = useRouter();
onMounted( () =>
  router.replace({
    ...router.currentRoute,
    query: {
  }
}))
</script>
