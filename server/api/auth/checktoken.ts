import bcrypt from "bcrypt"
import { decodeUrlToken, generateAccessToken, generateRefreshToken, sendRefreshToken } from "../../jwt.js"
import { sendError } from "h3"
import { getUserByEmail, getUserByUserName, sanitizeUserForFrontend } from "~~/server/services/userService.js"
import { createSession } from "~~/server/services/sessionService.js"

export default defineEventHandler(async (event) => {
    const query = await useQuery(event)
    const token: string = query.token
    
    if (!token) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Ivalid params'
        }))
    }

    const data = decodeUrlToken(token)
    const user = await getUserByUserName(data?.username)

    if (!user) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Username or password is invalid'
        }))
    }

    return {
        access: data.purpose, user: sanitizeUserForFrontend(user)
    }

}) 