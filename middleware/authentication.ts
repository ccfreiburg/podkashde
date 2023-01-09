import {CHECK_TOKEN_AP} from "~~/base/Constants"

export default defineNuxtRouteMiddleware(async(to) => {
  try {
    const user = await useAuth().useAuthUser()
    if (!user.value) {
      return navigateTo('/admin/login')
    }
  } catch {
    return navigateTo('/admin/login')
  }
})