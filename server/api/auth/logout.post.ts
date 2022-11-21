import { sendRefreshToken } from "~~/server/jwt"
import { removeSession } from "~~/server/services/sessionService"
import { getCookie} from 'h3'

export default defineEventHandler(async (event) => {
    try {
        const refreshToken = getCookie(event, "refresh_token") as string
        await removeSession(refreshToken)
    } catch (error) { }

    sendRefreshToken(event, null)

    return { message: 'Done' }
})