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
        const regex = /refresh_token=(.*?)($|;|,(?! ))/
        var cookie = event.node.req.headers['cookie'] as string
        if (!cookie)
            cookie  = event.node.req.headers['Cookie'] as string
        const match = cookie?.match(regex)
        decoded = decodeRefreshToken((match?.length>1?match[1]:""))
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