import { sendError } from "h3"
import { sendRefreshToken } from "~~/server/jwt"
import { decodeRefreshToken, generateAccessToken, deleteRefreshToken } from "~~/server/jwt";
import { getSessionByToken, removeOldSessions } from "~~/server/services/sessionService";
import { getUserById, sanitizeUserForFrontend } from "~~/server/services/userService";

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, "refresh_token") as string

    if (!refreshToken) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'No Refresh token'
        }))
    }

    const session = await getSessionByToken(refreshToken)

    if (!session) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Refresh token is invalid'
        }))
    }

    const token = decodeRefreshToken(refreshToken)
    if (!token) {
        const days = 14
        const priorByDays = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        await removeOldSessions(priorByDays)
        deleteRefreshToken(event)

        return sendError(event, createError({
            statusCode: 403,
            statusMessage: 'Session expired'
        }))
    }

    try {
        const accessToken = generateAccessToken(token.userId)
        const user = sanitizeUserForFrontend(await getUserById(token.userId))
        user.token = accessToken
        return { access_token: accessToken, user }

    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Something went wrong'
        }))
    }
});