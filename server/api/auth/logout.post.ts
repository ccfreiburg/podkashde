import { sendRefreshToken } from "~~/server/jwt"
import { removeSession } from "~~/server/services/sessionService"

export default defineEventHandler(async (event) => {
    try {
        const cookies = useCookies(event)
        const refreshToken = cookies.refresh_token
        await removeSession(refreshToken)
    } catch (error) { }

    sendRefreshToken(event, null)

    return { message: 'Done' }
})