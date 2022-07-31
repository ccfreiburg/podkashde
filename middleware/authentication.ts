import {defineNuxtRouteMiddleware} from "#app";
import {useUser} from "~~/composables/authentication";

export default defineNuxtRouteMiddleware(async(to) => {
  const user = await useUser()
  console.log(to)
  console.log(user)
  if (user == null && user == undefined) {
    return '/'
  }
})
