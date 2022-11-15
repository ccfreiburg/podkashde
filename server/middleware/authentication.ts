import UrlPattern from "url-pattern"
import { sendError } from "h3"
import { decodeAccessToken, decodeRefreshToken } from "../jwt"
import { getUserById } from "../services/userService"

export default defineEventHandler(async (event) => {
    const endpoints = [
        '/api/auth/user',
    ]
    const login = new UrlPattern('/api/auth/login')

    const isHandledByThisMiddleware = 
        (event.req.method != 'GET' && !login.match(event.req.url)) ||
        endpoints.some(endopoint => {
            const pattern = new UrlPattern(endopoint)
            return pattern.match(event.req.url) 
        })

    if (!isHandledByThisMiddleware) {
        return
    }
    var token = event.req.headers['authorization']?.split(' ')[1]
    var decoded = decodeAccessToken(token)

    if (!decoded) {
        token = event.req.headers['cookie']?.split('=')[1]
        decoded = decodeRefreshToken(token)
        if (!decoded) {
            return sendError(event, createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            }))
        }
    }

    try {
        const userId = decoded.userId

        const user = await getUserById(userId)

        event.context.auth = { user }
    } catch (error) {
        return
    }

})