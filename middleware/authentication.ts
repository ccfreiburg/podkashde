import {defineNuxtRouteMiddleware} from "#app";
import {useUser} from "~~/composables/authentication";

export default defineNuxtRouteMiddleware(async(to) => {
  const user = await useUser()
  if (user == null && user == undefined) {
    return '/'
  }
})
