import UrlPattern from "url-pattern"
import { sendError } from "h3"
import { decodeAccessToken, decodeRefreshToken } from "../jwt"
import { getUserById } from "../services/userService"
import { d } from "vitest/dist/index-ea17aa0c"

export default defineEventHandler(async (event) => {
    const endpoints = [
        '/api/auth/user',
    ]
    const login = new UrlPattern('/api/auth/login')

    const isHandledByThisMiddleware = 
        (event.req.method != 'GET' && !login.match(event.node.req.url)) ||
        endpoints.some(endopoint => {
            const pattern = new UrlPattern(endopoint)
            return pattern.match(event.node.req.url) 
        })

    if (!isHandledByThisMiddleware) {
        return
    }

    var token = event.node.req.headers['authorization']?.split(' ')[1]
    var decoded = decodeAccessToken(token)

    if (!decoded) {
        token = event.node.req.headers['cookie']?.split('=')[3]
        console.log(JSON.stringify(token))
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