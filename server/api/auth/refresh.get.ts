import { sendError } from "h3"
import { decodeRefreshToken, generateAccessToken } from "~~/server/jwt";
import { getSessionByToken } from "~~/server/services/sessionService";
import { getUserById } from "~~/server/services/userService";

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, "refresh_token") as string

    if (!refreshToken) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Refresh token is invalid'
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

    try {
        const user = await getUserById(token.userId)

        const accessToken = generateAccessToken(user)

        return { access_token: accessToken }

    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Something went wrong'
        }))
    }
});