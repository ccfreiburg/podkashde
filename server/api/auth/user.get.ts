import { sanitizeUserForFrontend } from "~~/server/services/userService"

export default defineEventHandler(async (event) => {

    return {
        user: sanitizeUserForFrontend(event.context.auth?.user)
    }

})