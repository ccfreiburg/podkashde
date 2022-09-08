import { FILES_AP, SERVER_IMG_PATH, SERVER_MP3_PATH, SERVER_POSTIMG_PATH } from "~~/base/Constants";

export default defineNuxtRouteMiddleware((to,from) => {
  if (to.path.startsWith(SERVER_IMG_PATH) ||
  to.path.startsWith(SERVER_MP3_PATH) ||
  to.path.startsWith(SERVER_POSTIMG_PATH)
  )
    return navigateTo(FILES_AP+to.path, { replace: true, redirectCode: 201 });
})