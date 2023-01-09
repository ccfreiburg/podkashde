import {CHECK_TOKEN_AP} from "~~/base/Constants"

export default defineNuxtRouteMiddleware(async(to) => {
  try {
    const localePath = useLocalePath();
    const user = await useAuth().useAuthUser()
     if (!user.value) {
      return navigateTo(localePath('/admin/login'))
    }
  } catch {
    return navigateTo(localePath('/admin/login'))
  }
})