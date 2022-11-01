<template>
  <div class="w-full h-full">
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
  </div>
</template>

<script setup lang="ts">
import { useSeries } from '~~/composables/seriedata';
import { loginWithEmail } from '~~/composables/authentication';
const { refresh, series } = await useSeries()
const route = useRoute();
if (route.query.refresh)
  refresh();
</script>
