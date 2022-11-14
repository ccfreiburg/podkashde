export default defineNuxtRouteMiddleware(async(to) => {
  const user = await useAuth().useAuthUser()
  if (user.value == null && user.value == undefined) {
    return navigateTo('/')
  }
})