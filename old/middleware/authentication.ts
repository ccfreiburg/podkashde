export default defineNuxtRouteMiddleware(async(to, from) => {
  try {
    var user = useAuth().useAuthToken()
    if (!user || !user.value) { 
       return navigateTo('/admin/login')
    }
  } catch {
    return navigateTo('/admin/login')
  }
})